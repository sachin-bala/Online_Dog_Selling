import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { loadProductsFromDisk, saveProductsToDisk, StoredProduct } from '../utils/productStore.js';
import { formatApiResponse } from '../utils/validators.js';

// Auto-seed in-memory or mongo if empty
const ensureDatabaseSynced = async () => {
  try {
    const diskList = loadProductsFromDisk();
    if (mongoose.connection.readyState === 1 && diskList.length > 0) {
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('[ PawVerse Product DB ] Syncing initial products into MongoDB...');
        for (const item of diskList) {
          try {
            await Product.create({
              ...item,
              _id: new mongoose.Types.ObjectId(),
            });
          } catch (e: any) {
            console.warn('[ Product Sync Warning ]', e.message);
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('[ Product Sync Error ]', err.message);
  }
};

// Initial sync call
ensureDatabaseSynced();

export const getAllProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const { type, category, brand, search, inStock, featured, sort } = req.query;

    if (mongoose.connection.readyState === 1) {
      try {
        const query: any = {};

        if (type && ['FOOD', 'ACCESSORY'].includes(String(type).toUpperCase())) {
          query.type = String(type).toUpperCase();
        }

        if (category && category !== 'All') {
          query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        if (brand && brand !== 'All') {
          query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
        }

        if (inStock === 'true') {
          query.stock = { $gt: 0 };
          query.isAvailable = true;
        }

        if (featured === 'true') {
          query.featured = true;
        }

        if (search) {
          const searchRegex = new RegExp(String(search), 'i');
          query.$or = [
            { name: searchRegex },
            { brand: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
          ];
        }

        let sortOption: any = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };

        const products = await Product.find(query).sort(sortOption);
        if (products.length > 0) {
          return res.status(200).json(formatApiResponse(true, 'Products retrieved successfully', products));
        }
      } catch (dbErr: any) {
        console.warn('[ Product Query Mongo Warning ]', dbErr.message);
      }
    }

    // Disk Store Fallback
    let list = loadProductsFromDisk();

    if (type && ['FOOD', 'ACCESSORY'].includes(String(type).toUpperCase())) {
      list = list.filter((p) => p.type === String(type).toUpperCase());
    }

    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (brand && brand !== 'All') {
      list = list.filter((p) => p.brand.toLowerCase() === String(brand).toLowerCase());
    }

    if (inStock === 'true') {
      list = list.filter((p) => p.stock > 0 && p.isAvailable !== false);
    }

    if (featured === 'true') {
      list = list.filter((p) => p.featured === true);
    }

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

    return res.status(200).json(formatApiResponse(true, 'Products retrieved successfully (disk store)', list));
  } catch (error: any) {
    console.error('[ GET ALL PRODUCTS ERROR ]', error);
    return res.status(500).json(formatApiResponse(false, error.message || 'Error fetching products'));
  }
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = String(req.params.id);

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const product = await Product.findById(id);
          if (product) {
            return res.status(200).json(formatApiResponse(true, 'Product found', product));
          }
        }
      } catch (err: any) {
        console.warn('[ Mongo getProductById Warning ]', err.message);
      }
    }

    const diskList = loadProductsFromDisk();
    const product = diskList.find((p) => p.id === id || p._id === id);

    if (!product) {
      return res.status(404).json(formatApiResponse(false, 'Product not found'));
    }

    return res.status(200).json(formatApiResponse(true, 'Product found', product));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message || 'Error finding product'));
  }
};

// CREATE PRODUCT - STRICTLY ADMIN ONLY
export const createProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    // Role check verification
    const userRole = (req.user?.role || '').toUpperCase();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return res.status(403).json(
        formatApiResponse(false, 'Security Restriction: Only administrators can add Dog Food and Dog Accessories to PawVerse.')
      );
    }

    const {
      name,
      type,
      category,
      brand,
      price,
      originalPrice,
      stock,
      weight,
      lifeStage,
      material,
      size,
      description,
      features,
      ingredients,
      imageUrl,
      isAvailable,
      featured,
    } = req.body;

    if (!name || !type || !category || !brand || !price || !description) {
      return res.status(400).json(
        formatApiResponse(false, 'Please fill in all mandatory product fields: name, type (FOOD/ACCESSORY), category, brand, price, and description.')
      );
    }

    const normalizedType = String(type).toUpperCase();
    if (!['FOOD', 'ACCESSORY'].includes(normalizedType)) {
      return res.status(400).json(
        formatApiResponse(false, 'Product type must be either FOOD or ACCESSORY.')
      );
    }

    // Process image: from uploaded files, explicit imageUrl, or default fallback
    let imageList: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      imageList = (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`);
    } else if (imageUrl) {
      imageList = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
    } else {
      imageList = [
        normalizedType === 'FOOD'
          ? 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
      ];
    }

    const parsedFeatures: string[] = Array.isArray(features)
      ? features
      : typeof features === 'string'
      ? features.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const numPrice = Number(price);
    const numOriginalPrice = originalPrice ? Number(originalPrice) : Math.round(numPrice * 1.18);
    const numStock = stock !== undefined ? Number(stock) : 25;

    let mongoCreated: any = null;
    const newId = `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (mongoose.connection.readyState === 1) {
      try {
        mongoCreated = await Product.create({
          name: String(name).trim(),
          type: normalizedType as 'FOOD' | 'ACCESSORY',
          category: String(category).trim(),
          brand: String(brand).trim(),
          price: numPrice,
          originalPrice: numOriginalPrice,
          stock: numStock,
          rating: 4.9,
          reviewsCount: 1,
          weight: weight ? String(weight).trim() : '',
          lifeStage: lifeStage ? String(lifeStage).trim() : '',
          material: material ? String(material).trim() : '',
          size: size ? String(size).trim() : '',
          images: imageList,
          description: String(description).trim(),
          features: parsedFeatures,
          ingredients: ingredients ? String(ingredients).trim() : '',
          isAvailable: isAvailable !== false && isAvailable !== 'false',
          featured: featured === true || featured === 'true',
          addedBy: 'admin',
        });
      } catch (dbErr: any) {
        console.warn('[ Mongo Product Creation Warning ]', dbErr.message);
      }
    }

    // Always update persistent disk store
    const diskList = loadProductsFromDisk();
    const storedItem: StoredProduct = {
      id: mongoCreated?._id ? mongoCreated._id.toString() : newId,
      _id: mongoCreated?._id ? mongoCreated._id.toString() : newId,
      name: String(name).trim(),
      type: normalizedType as 'FOOD' | 'ACCESSORY',
      category: String(category).trim(),
      brand: String(brand).trim(),
      price: numPrice,
      originalPrice: numOriginalPrice,
      stock: numStock,
      rating: 4.9,
      reviewsCount: 1,
      weight: weight ? String(weight).trim() : '',
      lifeStage: lifeStage ? String(lifeStage).trim() : '',
      material: material ? String(material).trim() : '',
      size: size ? String(size).trim() : '',
      images: imageList,
      description: String(description).trim(),
      features: parsedFeatures,
      ingredients: ingredients ? String(ingredients).trim() : '',
      isAvailable: isAvailable !== false && isAvailable !== 'false',
      featured: featured === true || featured === 'true',
      addedBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    diskList.unshift(storedItem);
    saveProductsToDisk(diskList);

    return res.status(201).json(
      formatApiResponse(
        true,
        `Admin Success: ${normalizedType === 'FOOD' ? 'Dog Food' : 'Dog Accessory'} "${name}" added to marketplace.`,
        mongoCreated || storedItem
      )
    );
  } catch (error: any) {
    console.error('[ CREATE PRODUCT ERROR ]', error);
    return res.status(500).json(formatApiResponse(false, error.message || 'Error creating product'));
  }
};

// UPDATE PRODUCT - STRICTLY ADMIN ONLY
export const updateProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userRole = (req.user?.role || '').toUpperCase();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return res.status(403).json(
        formatApiResponse(false, 'Security Restriction: Only administrators can modify Dog Food and Dog Accessories.')
      );
    }

    const id = String(req.params.id);
    const updateData = req.body;

    let updatedMongo: any = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      try {
        updatedMongo = await Product.findByIdAndUpdate(
          id,
          {
            $set: {
              ...updateData,
              addedBy: 'admin', // Enforce admin attribution
            },
          },
          { new: true, runValidators: true }
        );
      } catch (dbErr: any) {
        console.warn('[ Mongo Product Update Warning ]', dbErr.message);
      }
    }

    // Update disk store
    const diskList = loadProductsFromDisk();
    const index = diskList.findIndex((p) => p.id === id || p._id === id);

    if (index !== -1) {
      diskList[index] = {
        ...diskList[index],
        ...updateData,
        addedBy: 'admin',
        updatedAt: new Date().toISOString(),
      };
      saveProductsToDisk(diskList);
    }

    return res.status(200).json(
      formatApiResponse(
        true,
        'Admin Success: Product information successfully updated and saved.',
        updatedMongo || (index !== -1 ? diskList[index] : null)
      )
    );
  } catch (error: any) {
    console.error('[ UPDATE PRODUCT ERROR ]', error);
    return res.status(500).json(formatApiResponse(false, error.message || 'Error updating product'));
  }
};

// DELETE PRODUCT - STRICTLY ADMIN ONLY
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userRole = (req.user?.role || '').toUpperCase();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return res.status(403).json(
        formatApiResponse(false, 'Security Restriction: Only administrators can delete or fix products.')
      );
    }

    const id = String(req.params.id);

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      try {
        await Product.findByIdAndDelete(id);
      } catch (dbErr: any) {
        console.warn('[ Mongo Product Delete Warning ]', dbErr.message);
      }
    }

    // Remove from disk store
    let diskList = loadProductsFromDisk();
    const originalLength = diskList.length;
    diskList = diskList.filter((p) => p.id !== id && p._id !== id);

    if (diskList.length !== originalLength) {
      saveProductsToDisk(diskList);
    }

    return res.status(200).json(
      formatApiResponse(true, 'Product successfully removed by administrator.')
    );
  } catch (error: any) {
    console.error('[ DELETE PRODUCT ERROR ]', error);
    return res.status(500).json(formatApiResponse(false, error.message || 'Error deleting product'));
  }
};

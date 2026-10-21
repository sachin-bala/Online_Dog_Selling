import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Dog } from '../models/Dog.js';
import { Seller } from '../models/Seller.js';
import { Review } from '../models/Review.js';
import { formatApiResponse } from '../utils/validators.js';
import { uploadBufferToCloudinary } from '../services/cloudinaryService.js';

export const createDogListing = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes((req.user.role || '').toUpperCase());
    let seller = await Seller.findOne({ userId: req.user._id });

    if (!isAdmin && (!seller || seller.sellerStatus !== 'APPROVED')) {
      return res.status(403).json(formatApiResponse(false, 'You must be an approved seller to add a dog.'));
    }

    const {
      name,
      breed,
      category,
      age,
      ageMonths,
      gender,
      price,
      originalPrice,
      location,
      color,
      weightKg,
      vaccinationStatus,
      microchipNumber,
      description,
      sellerName,
      sellerPhone,
      sellerEmail,
      sellerBusinessName,
      foodRecommendation,
      exerciseRecommendation,
      certified,
    } = req.body;

    if (!name || !breed || !age || !price || !location) {
      return res.status(400).json(formatApiResponse(false, 'Please fill in mandatory dog listing details (name, breed, age, price, location).'));
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json(formatApiResponse(false, 'Price must be a valid positive number.'));
    }

    const files = req.files as Express.Multer.File[];
    const uploadedImages: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const url = await uploadBufferToCloudinary(file.buffer, 'pawverse_dogs', 'auto', file.mimetype);
        if (url) uploadedImages.push(url);
      }
    }

    // Support direct image URL or base64 data string passed in body
    const directImageUrl = req.body.imageUrl || req.body.image;
    if (directImageUrl && typeof directImageUrl === 'string' && directImageUrl.trim().length > 0) {
      if (!uploadedImages.includes(directImageUrl.trim())) {
        uploadedImages.unshift(directImageUrl.trim());
      }
    }

    if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        req.body.images.forEach((img: any) => {
          if (typeof img === 'string' && img.trim().length > 0 && !uploadedImages.includes(img.trim())) {
            uploadedImages.push(img.trim());
          }
        });
      } else if (typeof req.body.images === 'string' && req.body.images.trim().length > 0) {
        if (!uploadedImages.includes(req.body.images.trim())) {
          uploadedImages.push(req.body.images.trim());
        }
      }
    }

    if (uploadedImages.length === 0) {
      uploadedImages.push('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80');
    }

    const dog = await Dog.create({
      name,
      breed,
      category: category || 'Family Dogs',
      age,
      ageMonths: Number(ageMonths) || 3,
      gender: gender === 'Female' ? 'Female' : 'Male',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.15,
      location,
      color: color || 'Standard',
      weightKg: Number(weightKg) || 6,
      images: uploadedImages,
      frames360: uploadedImages,
      vaccinationStatus: vaccinationStatus || 'Fully Vaccinated',
      microchipNumber: microchipNumber || '',
      sellerId: seller?._id || req.user._id,
      sellerInfo: {
        name: sellerName || seller?.fullName || req.user.fullName || 'PawVerse Admin',
        businessName: sellerBusinessName || (sellerName ? `${sellerName} Kennel` : seller?.kennelName || 'PawVerse Premium Kennel'),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewsCount: 12,
        city: location || seller?.address?.city || 'Chennai',
        phone: sellerPhone || seller?.phone || req.user.phone || '+91 98765 00000',
      },
      description: description || 'Healthy pedigree puppy reared in sanitary environment with core vaccinations completed.',
      foodRecommendation: foodRecommendation || 'Royal Canin Starter / Premium Dog Formula',
      exerciseRecommendation: exerciseRecommendation || '30-45 minutes daily play & walk',
      certified: certified !== undefined ? Boolean(certified) : true,
      status: isAdmin ? 'APPROVED' : 'PENDING',
      availability: true,
    });

    return res.status(201).json(
      formatApiResponse(true, isAdmin ? 'Seller dog added successfully and published!' : 'Dog listing submitted successfully! Pending approval.', dog)
    );
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const updateDogListing = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const { id } = req.params;
    const dog = await Dog.findById(id);

    if (!dog) {
      return res.status(404).json(formatApiResponse(false, 'Dog listing not found'));
    }

    const seller = await Seller.findOne({ userId: req.user._id });
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isAdmin && (!seller || dog.sellerId.toString() !== seller._id.toString())) {
      return res.status(403).json(formatApiResponse(false, 'You do not have permission to edit this listing'));
    }

    const updatedDog = await Dog.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(formatApiResponse(true, 'Dog listing updated successfully', updatedDog));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const deleteDogListing = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const { id } = req.params;
    const dog = await Dog.findById(id);

    if (!dog) {
      return res.status(404).json(formatApiResponse(false, 'Dog listing not found'));
    }

    const seller = await Seller.findOne({ userId: req.user._id });
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isAdmin && (!seller || dog.sellerId.toString() !== seller._id.toString())) {
      return res.status(403).json(formatApiResponse(false, 'You do not have permission to delete this listing'));
    }

    await Dog.findByIdAndDelete(id);
    return res.status(200).json(formatApiResponse(true, 'Dog listing deleted successfully'));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getPublicDogs = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      search,
      breed,
      category,
      gender,
      minPrice,
      maxPrice,
      location,
      vaccinated,
      microchipped,
      sort,
      page = '1',
      limit = '20',
    } = req.query;

    const filterQuery: any = {
      status: 'APPROVED',
      availability: true,
    };

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filterQuery.$or = [
        { name: searchRegex },
        { breed: searchRegex },
        { location: searchRegex },
        { 'sellerInfo.businessName': searchRegex },
      ];
    }

    if (breed && breed !== 'All') {
      filterQuery.breed = new RegExp(String(breed), 'i');
    }

    if (category && category !== 'All') {
      filterQuery.category = String(category);
    }

    if (gender && (gender === 'Male' || gender === 'Female')) {
      filterQuery.gender = gender;
    }

    if (location && location !== 'All') {
      filterQuery.location = new RegExp(String(location), 'i');
    }

    if (minPrice || maxPrice) {
      filterQuery.price = {};
      if (minPrice) filterQuery.price.$gte = Number(minPrice);
      if (maxPrice) filterQuery.price.$lte = Number(maxPrice);
    }

    if (vaccinated === 'true') {
      filterQuery.vaccinationStatus = 'Fully Vaccinated';
    }

    if (microchipped === 'true') {
      filterQuery.microchipNumber = { $ne: '' };
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'popular') sortOptions = { 'sellerInfo.rating': -1 };

    const pageNum = parseInt(String(page), 10);
    const limitNum = parseInt(String(limit), 10);
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Dog.countDocuments(filterQuery);
    const dogs = await Dog.find(filterQuery).sort(sortOptions).skip(skip).limit(limitNum);

    return res.status(200).json(
      formatApiResponse(true, 'Dogs fetched successfully', {
        dogs,
        pagination: {
          totalCount,
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          limit: limitNum,
        },
      })
    );
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getDogById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const dog = await Dog.findById(id);

    if (!dog) {
      return res.status(404).json(formatApiResponse(false, 'Dog not found'));
    }

    const reviews = await Review.find({ dogId: dog._id }).populate('userId', 'fullName profileImage');

    const relatedDogs = await Dog.find({
      _id: { $ne: dog._id },
      status: 'APPROVED',
      $or: [{ breed: dog.breed }, { category: dog.category }],
    }).limit(4);

    return res.status(200).json(
      formatApiResponse(true, 'Dog details retrieved', {
        dog,
        reviews,
        relatedDogs,
      })
    );
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

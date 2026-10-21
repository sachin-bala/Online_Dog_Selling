import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Cart } from '../models/Cart.js';
import { Dog } from '../models/Dog.js';
import { formatApiResponse } from '../utils/validators.js';

export const getCart = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized access'));
    }

    let cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'items.dogId',
      model: 'Dog',
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    return res.status(200).json(formatApiResponse(true, 'Cart retrieved successfully', cart));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message || 'Error fetching cart'));
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized access'));
    }

    const { dogId, quantity = 1 } = req.body;

    if (!dogId) {
      return res.status(400).json(formatApiResponse(false, 'Dog ID is required to add to cart'));
    }

    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json(formatApiResponse(false, 'Dog listing not found'));
    }

    if (!dog.availability || dog.status !== 'APPROVED') {
      return res.status(400).json(formatApiResponse(false, 'This dog is no longer available for purchase'));
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [{ dogId: dog._id as any, price: dog.price, quantity: Number(quantity) || 1 }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.dogId.toString() === dogId.toString()
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += Number(quantity) || 1;
      } else {
        cart.items.push({ dogId: dog._id as any, price: dog.price, quantity: Number(quantity) || 1 });
      }

      await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.dogId',
      model: 'Dog',
    });

    return res.status(200).json(formatApiResponse(true, 'Item added to cart', updatedCart));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message || 'Error adding to cart'));
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized access'));
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json(formatApiResponse(false, 'Cart not found'));
    }

    const item = cart.items.find((i) => i._id?.toString() === itemId || i.dogId.toString() === itemId);

    if (!item) {
      return res.status(404).json(formatApiResponse(false, 'Item not found in cart'));
    }

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter((i) => i._id?.toString() !== itemId && i.dogId.toString() !== itemId);
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.dogId',
      model: 'Dog',
    });

    return res.status(200).json(formatApiResponse(true, 'Cart item updated', updatedCart));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message || 'Error updating cart item'));
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized access'));
    }

    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json(formatApiResponse(false, 'Cart not found'));
    }

    cart.items = cart.items.filter((i) => i._id?.toString() !== itemId && i.dogId.toString() !== itemId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.dogId',
      model: 'Dog',
    });

    return res.status(200).json(formatApiResponse(true, 'Item removed from cart', updatedCart));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message || 'Error removing item from cart'));
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized access'));
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json(formatApiResponse(true, 'Cart cleared'));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message || 'Error clearing cart'));
  }
};

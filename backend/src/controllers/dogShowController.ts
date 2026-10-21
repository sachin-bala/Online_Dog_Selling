import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { DogShow } from '../models/DogShow.js';
import { ShowRegistration } from '../models/ShowRegistration.js';
import { formatApiResponse } from '../utils/validators.js';

// Safe helper to delete uploaded show images from disk
const safeDeleteUploadFile = (imagePath?: string) => {
  if (!imagePath) return;
  try {
    const filename = path.basename(imagePath);
    const protectedImages = [
      'kci-championship.jpg',
      'rajapalayam-expo.jpg',
      'rajapalayam-champion.jpg',
      'hero-dog-poster.jpg',
    ];
    if (protectedImages.includes(filename.toLowerCase())) return;

    if (imagePath.includes('/uploads/') || imagePath.startsWith('uploads/')) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      const fullPath = path.join(uploadsDir, filename);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`[ Dog Show Image ] Safely deleted image from disk: ${fullPath}`);
      }
    }
  } catch (err) {
    console.warn('[ Dog Show Image ] Image deletion warning:', err);
  }
};

// Process an uploaded file buffer to /uploads/ directory with safe unique filename
const saveUploadedShowImage = (file: Express.Multer.File): string => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const mime = (file.mimetype || '').toLowerCase();
  let ext = 'jpg';
  if (mime.includes('png')) ext = 'png';
  else if (mime.includes('webp')) ext = 'webp';
  else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';

  const safeUniqueId = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const filename = `show_${safeUniqueId}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, file.buffer);
  console.log(`[ Dog Show Image ] Saved new event image: ${filePath}`);

  return `/uploads/${filename}`;
};

export const getDogShows = async (req: Request, res: Response): Promise<any> => {
  try {
    const shows = await DogShow.find().sort({ date: 1, createdAt: -1 });
    return res.status(200).json(formatApiResponse(true, 'Dog shows retrieved', shows));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getDogShowById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const show = await DogShow.findById(id);

    if (!show) {
      return res.status(404).json(formatApiResponse(false, 'Dog show event not found'));
    }

    const participants = await ShowRegistration.find({ showId: show._id });

    return res.status(200).json(formatApiResponse(true, 'Dog show details retrieved', { show, participants }));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const createDogShow = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const {
      title,
      eventName,
      description,
      organizer,
      location,
      venue,
      city,
      state,
      country,
      date,
      time,
      startTime,
      endTime,
      registrationDeadline,
      registrationDetails,
      categories,
      rules,
      prizes,
      sponsors,
      contactEmail,
      contactPhone,
      websiteLink,
      registrationFee,
      status,
      bannerImage,
      image,
    } = req.body;

    // Resolve unified fields
    const resolvedName = (eventName || title || '').trim();
    const resolvedLocation = (location || venue || '').trim();
    const resolvedDate = (date || '').trim();
    const resolvedTime = (time || startTime || '09:00 AM').trim();
    const resolvedDescription = (description || '').trim();

    // Validation
    if (!resolvedName) {
      return res.status(400).json(formatApiResponse(false, 'Event Name is required'));
    }
    if (!resolvedLocation) {
      return res.status(400).json(formatApiResponse(false, 'Event Location (venue, city, or address) is required'));
    }
    if (!resolvedDate) {
      return res.status(400).json(formatApiResponse(false, 'Event Date is required'));
    }
    if (!resolvedDescription) {
      return res.status(400).json(formatApiResponse(false, 'Event Description is required'));
    }

    // Process image: Uploaded file takes precedence, then URL, then default banner
    let finalImagePath = '';
    if (req.file) {
      finalImagePath = saveUploadedShowImage(req.file);
    } else if (image || bannerImage) {
      finalImagePath = (image || bannerImage).trim();
    } else {
      finalImagePath = '/images/shows/kci-championship.jpg';
    }

    // Parse array fields if passed as comma strings or arrays
    const parsedCategories = Array.isArray(categories)
      ? categories
      : typeof categories === 'string' && categories.trim().length > 0
      ? categories.split(',').map((c: string) => c.trim()).filter(Boolean)
      : ['Best in Show', 'Puppy Championship', 'Native Indian Breeds'];

    const parsedRules = Array.isArray(rules)
      ? rules
      : typeof rules === 'string' && rules.trim().length > 0
      ? rules.split(',').map((r: string) => r.trim()).filter(Boolean)
      : ['KCI Registration or Veterinary Health Certificate required', 'Valid vaccination passport must be presented at arena desk'];

    const parsedSponsors = Array.isArray(sponsors)
      ? sponsors
      : typeof sponsors === 'string' && sponsors.trim().length > 0
      ? sponsors.split(',').map((s: string) => s.trim()).filter(Boolean)
      : ['PawVerse AI', 'Royal Canin'];

    const show = await DogShow.create({
      title: resolvedName,
      eventName: resolvedName,
      bannerImage: finalImagePath,
      image: finalImagePath,
      description: resolvedDescription,
      organizer: organizer || 'Kennel Club of India (KCI)',
      location: resolvedLocation,
      venue: resolvedLocation,
      city: city || resolvedLocation.split(',')[0].trim() || 'Chennai',
      state: state || 'Tamil Nadu',
      country: country || 'India',
      date: resolvedDate,
      time: resolvedTime,
      startTime: resolvedTime,
      endTime: endTime || '06:00 PM',
      registrationDeadline: registrationDeadline || resolvedDate,
      registrationDetails: (registrationDetails || '').trim(),
      categories: parsedCategories,
      rules: parsedRules,
      prizes: prizes || '₹2,50,000 Cash Prize + Gold Trophy',
      sponsors: parsedSponsors,
      contactEmail: contactEmail || 'shows@pawverse.ai',
      contactPhone: contactPhone || '+91 98765 43210',
      websiteLink: websiteLink || 'https://pawverse.ai',
      registrationFee: Number(registrationFee) || 0,
      status: (status || 'UPCOMING').toUpperCase(),
    });

    return res.status(201).json(formatApiResponse(true, 'Dog show event created successfully', show));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const updateDogShow = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const existingShow = await DogShow.findById(id);

    if (!existingShow) {
      return res.status(404).json(formatApiResponse(false, 'Dog show event not found'));
    }

    const {
      title,
      eventName,
      description,
      organizer,
      location,
      venue,
      city,
      state,
      country,
      date,
      time,
      startTime,
      endTime,
      registrationDeadline,
      registrationDetails,
      categories,
      rules,
      prizes,
      sponsors,
      contactEmail,
      contactPhone,
      websiteLink,
      registrationFee,
      status,
      bannerImage,
      image,
    } = req.body;

    const updates: any = {};

    if (eventName || title) {
      const name = (eventName || title).trim();
      updates.title = name;
      updates.eventName = name;
    }
    if (location || venue) {
      const loc = (location || venue).trim();
      updates.location = loc;
      updates.venue = loc;
    }
    if (city !== undefined) updates.city = city.trim();
    if (state !== undefined) updates.state = state.trim();
    if (country !== undefined) updates.country = country.trim();
    if (date !== undefined) updates.date = date.trim();
    if (time || startTime) {
      const t = (time || startTime).trim();
      updates.time = t;
      updates.startTime = t;
    }
    if (endTime !== undefined) updates.endTime = endTime.trim();
    if (description !== undefined) updates.description = description.trim();
    if (registrationDetails !== undefined) updates.registrationDetails = registrationDetails.trim();
    if (registrationDeadline !== undefined) updates.registrationDeadline = registrationDeadline.trim();
    if (organizer !== undefined) updates.organizer = organizer.trim();
    if (prizes !== undefined) updates.prizes = prizes;
    if (contactEmail !== undefined) updates.contactEmail = contactEmail.trim();
    if (contactPhone !== undefined) updates.contactPhone = contactPhone.trim();
    if (websiteLink !== undefined) updates.websiteLink = websiteLink.trim();
    if (registrationFee !== undefined) updates.registrationFee = Number(registrationFee) || 0;
    if (status !== undefined) updates.status = status.toUpperCase();

    if (categories !== undefined) {
      updates.categories = Array.isArray(categories)
        ? categories
        : typeof categories === 'string'
        ? categories.split(',').map((c: string) => c.trim()).filter(Boolean)
        : existingShow.categories;
    }

    if (rules !== undefined) {
      updates.rules = Array.isArray(rules)
        ? rules
        : typeof rules === 'string'
        ? rules.split(',').map((r: string) => r.trim()).filter(Boolean)
        : existingShow.rules;
    }

    if (sponsors !== undefined) {
      updates.sponsors = Array.isArray(sponsors)
        ? sponsors
        : typeof sponsors === 'string'
        ? sponsors.split(',').map((s: string) => s.trim()).filter(Boolean)
        : existingShow.sponsors;
    }

    // Handle Image: If new file uploaded, save it and delete previous custom upload
    if (req.file) {
      const newImagePath = saveUploadedShowImage(req.file);
      // Safely delete previous custom upload if it was replaced
      safeDeleteUploadFile(existingShow.bannerImage || existingShow.image);
      updates.bannerImage = newImagePath;
      updates.image = newImagePath;
    } else if (image || bannerImage) {
      const img = (image || bannerImage).trim();
      if (img && img !== existingShow.bannerImage && img !== existingShow.image) {
        // If changing to another image, delete old local upload
        safeDeleteUploadFile(existingShow.bannerImage || existingShow.image);
        updates.bannerImage = img;
        updates.image = img;
      }
    }
    // Note: If no new file or URL is passed, existing image is retained automatically!

    const updatedShow = await DogShow.findByIdAndUpdate(id, updates, { new: true });

    return res.status(200).json(formatApiResponse(true, 'Dog show updated successfully', updatedShow));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const deleteDogShow = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const show = await DogShow.findById(id);

    if (!show) {
      return res.status(404).json(formatApiResponse(false, 'Dog show event not found'));
    }

    // Safely remove associated custom uploaded image
    safeDeleteUploadFile(show.bannerImage || show.image);

    // Delete show document
    await DogShow.findByIdAndDelete(id);

    // Safely delete any associated participants / registrations
    await ShowRegistration.deleteMany({ showId: id });

    return res.status(200).json(formatApiResponse(true, `Dog show event "${show.title || show.eventName}" deleted successfully`));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const registerForShow = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const { id } = req.params; // showId
    const { ownerName, email, phone, dogName, breed, age, gender, category } = req.body;

    const show = await DogShow.findById(id);
    if (!show) {
      return res.status(404).json(formatApiResponse(false, 'Dog show event not found'));
    }

    const registration = await ShowRegistration.create({
      showId: show._id,
      userId: req.user._id,
      ownerName: ownerName || req.user.fullName,
      email: email || req.user.email,
      phone: phone || req.user.phone || '',
      dogName: dogName || 'Veera',
      breed: breed || 'Rajapalayam',
      age: age || '1 Year',
      gender: gender || 'Male',
      category: category || 'Best in Show',
      paymentStatus: 'PAID',
      registrationStatus: 'PENDING',
    });

    return res.status(201).json(
      formatApiResponse(true, 'Registered for dog show successfully! Under admin approval.', registration)
    );
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

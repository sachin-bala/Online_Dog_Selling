import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/database.js';
import { User } from './models/User.js';
import { Seller } from './models/Seller.js';
import { Dog } from './models/Dog.js';
import { DogShow } from './models/DogShow.js';
import { loadAdminsFromDisk, saveAdminsToDisk } from './utils/adminStore.js';

export const seedDatabase = async () => {
  try {
    console.log('[ PawVerse DB Seed ] Connecting to database...');
    await connectDB();

    console.log('[ PawVerse DB Seed ] Clearing existing development demo records...');
    await User.deleteMany({});
    await Seller.deleteMany({});
    await Dog.deleteMany({});
    await DogShow.deleteMany({});

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminRawPass = process.env.ADMIN_PASSWORD || 'admin@123';
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash(adminRawPass, salt);
    const sellerPassword = await bcrypt.hash('seller123', salt);

    // 1. Create Super Admin Account
    const admin = await User.create({
      fullName: 'PawVerse AI Super Admin',
      email: adminEmail,
      password: adminPassword,
      phone: '+91 98765 00000',
      role: 'SUPER_ADMIN',
      emailVerified: true,
      accountStatus: 'ACTIVE',
    });

    const adminMap = loadAdminsFromDisk();
    adminMap.set(adminEmail, {
      id: admin._id.toString(),
      _id: admin._id.toString(),
      fullName: 'PawVerse AI Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'SUPER_ADMIN',
      accountStatus: 'ACTIVE',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    });
    saveAdminsToDisk(adminMap);

    // 2. Create Sample Approved Seller Profile
    const sellerUser = await User.create({
      fullName: 'Raja Sundaram',
      email: 'raja@rajapalayamkennel.com',
      password: sellerPassword,
      phone: '+91 94431 88920',
      role: 'SELLER',
      emailVerified: true,
      accountStatus: 'ACTIVE',
    });

    const seller = await Seller.create({
      userId: sellerUser._id,
      fullName: 'Raja Sundaram',
      phone: '+91 94431 88920',
      address: { city: 'Rajapalayam', state: 'Tamil Nadu', pincode: '626117', country: 'India' },
      govtIdNumber: 'TN-KCI-88941',
      kennelName: 'Rajapalayam Royal Kennel Club',
      experienceYears: 14,
      sellerStatus: 'APPROVED',
      reviewedBy: admin._id,
      reviewedAt: new Date(),
    });

    // 3. Create Sample Approved Dogs
    await Dog.create([
      {
        name: 'Veera - Royal Rajapalayam Champion',
        breed: 'Rajapalayam',
        category: 'Rare Breeds',
        age: '12 Weeks',
        ageMonths: 3,
        gender: 'Male',
        price: 35000,
        originalPrice: 42000,
        location: 'Rajapalayam, TN',
        color: 'Milky Ivory White',
        weightKg: 8.5,
        images: [
          'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
        ],
        frames360: [
          'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
        ],
        vaccinationStatus: 'Fully Vaccinated',
        microchipNumber: 'KCI-TN-985141001',
        sellerId: seller._id,
        sellerInfo: {
          name: seller.fullName,
          businessName: seller.kennelName,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          rating: 4.95,
          reviewsCount: 48,
          city: 'Rajapalayam, TN',
          phone: seller.phone,
        },
        status: 'APPROVED',
        availability: true,
        certified: true,
        featured: true,
        description: 'Authentic royal bloodline Rajapalayam puppy. Pure white short coat, pink nose, and formidable loyalty.',
        foodRecommendation: 'Royal Canin Starter / Raw Meat Blend',
        exerciseRecommendation: '45 mins daily running',
      },
      {
        name: 'Max - Golden Retriever Show Pedigree',
        breed: 'Golden Retriever',
        category: 'Family Dogs',
        age: '10 Weeks',
        ageMonths: 2.5,
        gender: 'Male',
        price: 28000,
        originalPrice: 32000,
        location: 'Chennai, TN',
        color: 'Golden',
        weightKg: 6.2,
        images: [
          'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80',
        ],
        vaccinationStatus: 'Fully Vaccinated',
        microchipNumber: 'KCI-CH-8821092',
        sellerId: seller._id,
        sellerInfo: {
          name: seller.fullName,
          businessName: seller.kennelName,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          rating: 4.95,
          reviewsCount: 48,
          city: 'Chennai, TN',
          phone: seller.phone,
        },
        status: 'APPROVED',
        availability: true,
        certified: true,
        featured: true,
        description: 'Super friendly Golden Retriever puppy. Highly trainable, excellent with kids and apartment living.',
        foodRecommendation: 'Puppy Growth Kibble',
        exerciseRecommendation: '30 mins play & fetch',
      },
    ]);

    // 4. Create Sample Dog Shows
    await DogShow.create([
      {
        title: '2026 Tamil Nadu State KCI All Breed Championship',
        bannerImage: '/images/shows/kci-championship.jpg',
        description: 'Prestigious KCI points championship featuring over 400 canine competitors across India.',
        organizer: 'Kennel Club of India (KCI) & TN Canine Association',
        venue: 'Chennai Trade Centre, Nandanam',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        date: 'August 25, 2026',
        startTime: '09:00 AM',
        endTime: '06:00 PM',
        registrationDeadline: 'August 18, 2026',
        status: 'UPCOMING',
        categories: ['Best in Show (KCI Title)', 'Native Breeds (Rajapalayam, Chippiparai)', 'Puppy Championship'],
        prizes: '₹2,50,000 Grand Cash Prize + KCI Gold Crown Trophy',
        registrationFee: 1500,
        contactEmail: 'kci-tn@pawverse.ai',
        contactPhone: '+91 94440 12345',
      },
      {
        title: 'South India Native Breeds Expo & Rajapalayam Championship',
        bannerImage: '/images/shows/rajapalayam-expo.jpg',
        description: 'An exclusive state celebration celebrating the rich heritage of Tamil Nadu native dog breeds.',
        organizer: 'Tamil Nadu Native Dog Preservation Society',
        venue: 'Madurai Race Course Grounds',
        city: 'Madurai',
        state: 'Tamil Nadu',
        country: 'India',
        date: 'August 15, 2026',
        startTime: '10:00 AM',
        endTime: '05:00 PM',
        registrationDeadline: 'August 10, 2026',
        status: 'UPCOMING',
        categories: ['Best Purebred Rajapalayam', 'Chippiparai Speed & Conformation', 'Kanni Agility & Instinct', 'Kombai Bear Hound Title'],
        prizes: '₹1,50,000 Cash Award + Traditional Silver Shield',
        registrationFee: 1000,
        contactEmail: 'madurai-expo@pawverse.ai',
        contactPhone: '+91 94432 12345',
      },
    ]);

    console.log(`\n==================================================`);
    console.log(` ✅ PawVerse DB Seed Completed Successfully!`);
    console.log(` 👑 Admin Email: ${adminEmail} | Password: ${adminRawPass}`);
    console.log(` 🐕 Seller Email: raja@rajapalayamkennel.com | Password: seller123`);
    console.log(`==================================================\n`);
  } catch (error) {
    console.error('[ PawVerse DB Seed Error ] Seed failed:', error);
  }
};

if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase().then(() => {
    mongoose.disconnect();
    process.exit(0);
  });
}

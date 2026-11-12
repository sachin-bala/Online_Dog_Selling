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

    // 3. Create Sample Approved Dogs (All 8 Core Breeds)
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
      {
        name: 'Madurai Velan - Pure Chippiparai',
        breed: 'Chippiparai',
        category: 'Rare Breeds',
        age: '10 Weeks',
        ageMonths: 2.5,
        gender: 'Male',
        price: 28000,
        originalPrice: 34000,
        location: 'Madurai, TN',
        color: 'Silver Grey & Fawn',
        weightKg: 7.2,
        images: [
          'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80',
        ],
        vaccinationStatus: 'Fully Vaccinated',
        microchipNumber: 'KCI-TN-985141002',
        sellerId: seller._id,
        sellerInfo: {
          name: seller.fullName,
          businessName: seller.kennelName,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          rating: 4.95,
          reviewsCount: 140,
          city: 'Madurai, TN',
          phone: seller.phone,
        },
        status: 'APPROVED',
        availability: true,
        certified: true,
        featured: true,
        description: 'Madurai Velan is an extremely fast, loyal Chippiparai puppy. Renowned for zero maintenance grooming and high disease immunity.',
        foodRecommendation: 'Rice with chicken broth and ragi malt.',
        exerciseRecommendation: '45-60 mins sprint & agility drills.',
      },
      {
        name: 'Karuppan - Royal Kanni',
        breed: 'Kanni',
        category: 'Guard Dogs',
        age: '11 Weeks',
        ageMonths: 2.7,
        gender: 'Male',
        price: 32000,
        originalPrice: 38000,
        location: 'Tirunelveli, TN',
        color: 'Deep Jet Black & Tan',
        weightKg: 7.8,
        images: [
          'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1200&q=80',
        ],
        vaccinationStatus: 'Fully Vaccinated',
        microchipNumber: 'KCI-TN-985141003',
        sellerId: seller._id,
        sellerInfo: {
          name: seller.fullName,
          businessName: seller.kennelName,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
          rating: 4.97,
          reviewsCount: 112,
          city: 'Tirunelveli, TN',
          phone: seller.phone,
        },
        status: 'APPROVED',
        availability: true,
        certified: true,
        featured: true,
        description: 'Karuppan is a rare Paal Kanni pup (Black and Tan). Known in Tamil Nadu culture as a protective guardian for eternal loyalty.',
        foodRecommendation: 'Curd rice with boiled eggs, minced meat.',
        exerciseRecommendation: 'Daily long walks and open field fetch games.',
      },
      {
        name: 'Singham - Ferocious Kombai Bear Hound',
        breed: 'Kombai',
        category: 'Guard Dogs',
        age: '14 Weeks',
        ageMonths: 3.5,
        gender: 'Male',
        price: 30000,
        originalPrice: 36000,
        location: 'Coimbatore, TN',
        color: 'Reddish Brown with Black Mask',
        weightKg: 10.5,
        images: [
          'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80',
        ],
        vaccinationStatus: 'Fully Vaccinated',
        microchipNumber: 'KCI-TN-985141004',
        sellerId: seller._id,
        sellerInfo: {
          name: seller.fullName,
          businessName: seller.kennelName,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          rating: 4.92,
          reviewsCount: 96,
          city: 'Coimbatore, TN',
          phone: seller.phone,
        },
        status: 'APPROVED',
        availability: true,
        certified: true,
        featured: true,
        description: 'Singham is a muscular Kombai puppy with a classic black mask. Unmatched territorial guard capability.',
        foodRecommendation: 'High protein mutton/chicken meal with rice.',
        exerciseRecommendation: '60 mins active exercise and guard training drills.',
      },
      {
        name: 'Bella - Imperial Frenchie',
        breed: 'French Bulldog',
        category: 'Small Dogs',
        age: '8 Weeks',
        ageMonths: 2.0,
        gender: 'Female',
        price: 65000,
        originalPrice: 75000,
        location: 'Bengaluru, KA',
        color: 'Lilac Fawn Velvet',
        weightKg: 3.2,
        images: [
          'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
        ],
        vaccinationStatus: 'Fully Vaccinated',
        microchipNumber: 'KCI-IND-985141006',
        sellerId: seller._id,
        sellerInfo: {
          name: seller.fullName,
          businessName: seller.kennelName,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          rating: 4.95,
          reviewsCount: 88,
          city: 'Bengaluru, KA',
          phone: seller.phone,
        },
        status: 'APPROVED',
        availability: true,
        certified: true,
        featured: true,
        description: 'Bella is a rare Lilac Fawn French Bulldog. Ideal for modern apartment living with air conditioning.',
        foodRecommendation: 'Grain-free organic salmon kibble.',
        exerciseRecommendation: 'Short 20-minute daily walks.',
      },
      {
        name: 'Kaiser - Heavy Bone German Shepherd',
        breed: 'German Shepherd',
        category: 'Guard Dogs',
        age: '12 Weeks',
        ageMonths: 3.0,
        gender: 'Male',
        price: 38000,
        originalPrice: 45000,
        location: 'Salem, TN',
        color: 'Classic Black & Red Tan',
        weightKg: 11.2,
        images: [
          'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1200&q=80',
        ],
        vaccinationStatus: 'Fully Vaccinated',
        microchipNumber: 'KCI-TN-985141007',
        sellerId: seller._id,
        sellerInfo: {
          name: seller.fullName,
          businessName: seller.kennelName,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          rating: 4.96,
          reviewsCount: 160,
          city: 'Salem, TN',
          phone: seller.phone,
        },
        status: 'APPROVED',
        availability: true,
        certified: true,
        featured: false,
        description: 'Kaiser is a heavy-boned, double-coat German Shepherd puppy from champion KCI bloodlines in Salem.',
        foodRecommendation: 'High protein chicken & rice puppy formula.',
        exerciseRecommendation: '60 mins active obedience training and ball fetch daily.',
      },
      {
        name: 'Coco - Cute Toy Pomeranian',
        breed: 'Pomeranian',
        category: 'Small Dogs',
        age: '9 Weeks',
        ageMonths: 2.2,
        gender: 'Female',
        price: 22000,
        originalPrice: 28000,
        location: 'Tiruchirappalli, TN',
        color: 'Pure Snow White',
        weightKg: 1.8,
        images: [
          'https://images.unsplash.com/photo-1546975490-e8b92a360b24?auto=format&fit=crop&w=1200&q=80',
        ],
        vaccinationStatus: 'Fully Vaccinated',
        microchipNumber: 'KCI-TN-985141008',
        sellerId: seller._id,
        sellerInfo: {
          name: seller.fullName,
          businessName: seller.kennelName,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
          rating: 4.93,
          reviewsCount: 75,
          city: 'Tiruchirappalli, TN',
          phone: seller.phone,
        },
        status: 'APPROVED',
        availability: true,
        certified: true,
        featured: false,
        description: 'Coco is an adorable toy Pomeranian pup with fluffy double coat. Cheerful apartment lap dog.',
        foodRecommendation: 'Royal Canin Mini Starter Puppy Kibble.',
        exerciseRecommendation: '15-20 mins indoor playtime and short strolls.',
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

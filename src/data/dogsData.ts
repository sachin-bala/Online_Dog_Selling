export interface HealthRecord {
  vaccinationStatus: 'Fully Vaccinated' | 'Partially Vaccinated' | 'Pending';
  healthScore: number; // 0 - 100
  microchipId: string;
  dnaVerified: boolean;
  vetInspectionDate: string;
  deWormed: boolean;
  medicalHistory: string[];
}

export interface SellerInfo {
  id: string;
  name: string;
  businessName: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  verifiedBreeder: boolean;
  city: string;
  state: string;
  phone: string;
  responseRate: string;
  joinedYear: number;
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  category: 'Puppies' | 'Guard Dogs' | 'Family Dogs' | 'Small Dogs' | 'Large Dogs' | 'Rare Breeds' | 'Show Dogs';
  age: string; // e.g. "12 Weeks"
  ageMonths: number;
  gender: 'Male' | 'Female';
  price: number;
  originalPrice?: number;
  location: string;
  color: string;
  weightKg: number;
  images: string[];
  frames360: string[];
  videoUrl?: string;
  health: HealthRecord;
  seller: SellerInfo;
  traits: {
    affection: number; // 1-5
    energy: number;
    grooming: number;
    barking: number;
    trainability: number;
  };
  suitableFor: {
    apartment: boolean;
    kids: boolean;
    firstTimeOwner: boolean;
    climate: 'Hot' | 'Cold' | 'Moderate' | 'Any';
  };
  foodRecommendation: string;
  exerciseRecommendation: string;
  description: string;
  certified: boolean;
  availableNow: boolean;
  featured?: boolean;
  sellerInfo?: { name: string; phone: string; businessName?: string; city?: string; email?: string };
  availability?: boolean;
  status?: 'AVAILABLE' | 'PENDING' | 'SOLD' | 'IN_TRANSIT' | 'APPROVED';
  sellerName?: string;
  sellerPhone?: string;
  sellerEmail?: string;
}

export const INITIAL_DOGS: Dog[] = [
  {
    id: 'dog-tn-1',
    name: 'Veera - Royal Rajapalayam Champion',
    breed: 'Rajapalayam',
    category: 'Rare Breeds',
    age: '12 Weeks',
    ageMonths: 3.0,
    gender: 'Male',
    price: 35000,
    originalPrice: 42000,
    location: 'Rajapalayam, TN',
    color: 'Milky Ivory White',
    weightKg: 8.5,
    images: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-happy-golden-retriever-dog-running-41584-large.mp4',
    health: {
      vaccinationStatus: 'Fully Vaccinated',
      healthScore: 99,
      microchipId: 'KCI-TN-985141001',
      dnaVerified: true,
      vetInspectionDate: '2026-07-30',
      deWormed: true,
      medicalHistory: ['KCI Rabies Core', 'DHPP Vaccine 1 & 2', 'TN Native Pedigree Verification']
    },
    seller: {
      id: 'seller-tn-1',
      name: 'Raja Sundaram',
      businessName: 'Rajapalayam Royal Kennel Club',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 4.99,
      reviewsCount: 185,
      verifiedBreeder: true,
      city: 'Rajapalayam',
      state: 'Tamil Nadu',
      phone: '+91 98401 98765',
      responseRate: '99% (< 10 mins)',
      joinedYear: 2018
    },
    traits: {
      affection: 4,
      energy: 5,
      grooming: 1,
      barking: 2,
      trainability: 5
    },
    suitableFor: {
      apartment: false,
      kids: true,
      firstTimeOwner: false,
      climate: 'Hot'
    },
    foodRecommendation: 'Boiled Ragi porridge, fresh goat milk, and high-protein chicken/mutton kibble.',
    exerciseRecommendation: '60 mins running in open grounds or farm acreage daily.',
    description: 'Veera is a purebred Rajapalayam puppy featuring the iconic pink nose, golden eyes, and majestic white coat. Known historically as royal hunting hounds of Nayak Kings of Tamil Nadu.',
    certified: true,
    availableNow: true,
    featured: true
  },
  {
    id: 'dog-tn-2',
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
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cute-small-dog-sitting-on-the-grass-41585-large.mp4',
    health: {
      vaccinationStatus: 'Fully Vaccinated',
      healthScore: 98,
      microchipId: 'KCI-TN-985141002',
      dnaVerified: true,
      vetInspectionDate: '2026-08-01',
      deWormed: true,
      medicalHistory: ['DHPP Core Shots', 'Parvo Clearance', 'Southern TN Native Sight Hound Cert']
    },
    seller: {
      id: 'seller-tn-2',
      name: 'M. Palanivel',
      businessName: 'Madurai Heritage Hound Haven',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 4.95,
      reviewsCount: 140,
      verifiedBreeder: true,
      city: 'Madurai',
      state: 'Tamil Nadu',
      phone: '+91 94432 12345',
      responseRate: '98% (< 20 mins)',
      joinedYear: 2019
    },
    traits: {
      affection: 4,
      energy: 5,
      grooming: 1,
      barking: 1,
      trainability: 4
    },
    suitableFor: {
      apartment: false,
      kids: true,
      firstTimeOwner: false,
      climate: 'Hot'
    },
    foodRecommendation: 'Rice with chicken broth, ragi malt, and natural omega oils.',
    exerciseRecommendation: '45-60 mins sprint & agility drills in open outdoor space.',
    description: 'Madurai Velan is an extremely fast, loyal Chippiparai puppy bred near the Periyar river belt. Renowned for zero maintenance grooming and high disease immunity in tropical heat.',
    certified: true,
    availableNow: true,
    featured: true
  },
  {
    id: 'dog-tn-3',
    name: 'Karuppan - Royal Kanni',
    breed: 'Kanni',
    category: 'Guard Dogs',
    age: '11 Weeks',
    ageMonths: 2.7,
    gender: 'Male',
    price: 32000,
    originalPrice: 38000,
    location: 'Tirunelveli, TN',
    color: 'Deep Jet Black & Tan (Paal Kanni)',
    weightKg: 7.8,
    images: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1200&q=80'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80'
    ],
    health: {
      vaccinationStatus: 'Fully Vaccinated',
      healthScore: 99,
      microchipId: 'KCI-TN-985141003',
      dnaVerified: true,
      vetInspectionDate: '2026-07-28',
      deWormed: true,
      medicalHistory: ['KCI DNA Verified', 'Rabies & Distemper Clearance']
    },
    seller: {
      id: 'seller-tn-3',
      name: 'K. Subbiah',
      businessName: 'Tirunelveli Kanni Preservation Society',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      rating: 4.97,
      reviewsCount: 112,
      verifiedBreeder: true,
      city: 'Tirunelveli',
      state: 'Tamil Nadu',
      phone: '+91 97900 67890',
      responseRate: '100% (< 15 mins)',
      joinedYear: 2020
    },
    traits: {
      affection: 5,
      energy: 5,
      grooming: 1,
      barking: 2,
      trainability: 5
    },
    suitableFor: {
      apartment: false,
      kids: true,
      firstTimeOwner: true,
      climate: 'Hot'
    },
    foodRecommendation: 'Curd rice with boiled eggs, minced meat, and calcium supplements.',
    exerciseRecommendation: 'Daily long walks and open field fetch games.',
    description: 'Karuppan is a rare Paal Kanni pup (Black and Tan). Known in Tamil Nadu culture as a protective guardian gifted during auspicious occasions for eternal loyalty.',
    certified: true,
    availableNow: true,
    featured: true
  },
  {
    id: 'dog-tn-4',
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
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
    ],
    health: {
      vaccinationStatus: 'Fully Vaccinated',
      healthScore: 97,
      microchipId: 'KCI-TN-985141004',
      dnaVerified: true,
      vetInspectionDate: '2026-08-02',
      deWormed: true,
      medicalHistory: ['All Core Vaccines Complete', 'KCI Registration Card Active']
    },
    seller: {
      id: 'seller-tn-4',
      name: 'S. Karthik',
      businessName: 'Kovai Royal Guard Kennels',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 4.92,
      reviewsCount: 96,
      verifiedBreeder: true,
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      phone: '+91 98940 54321',
      responseRate: '97% (< 30 mins)',
      joinedYear: 2021
    },
    traits: {
      affection: 4,
      energy: 5,
      grooming: 1,
      barking: 3,
      trainability: 4
    },
    suitableFor: {
      apartment: false,
      kids: true,
      firstTimeOwner: false,
      climate: 'Hot'
    },
    foodRecommendation: 'High protein mutton/chicken meal with boiled carrots and rice.',
    exerciseRecommendation: '60 mins active exercise and guard training drills.',
    description: 'Singham is a muscular Kombai puppy with a classic black mask and dark ridged back. Unmatched territorial guard dog capability with deep affection for family members.',
    certified: true,
    availableNow: true,
    featured: true
  },
  {
    id: 'dog-tn-5',
    name: 'Aurelius - KCI Champion Golden Retriever',
    breed: 'Golden Retriever',
    category: 'Family Dogs',
    age: '10 Weeks',
    ageMonths: 2.5,
    gender: 'Male',
    price: 45000,
    originalPrice: 52000,
    location: 'Chennai, TN',
    color: 'Lustrous Cream Gold',
    weightKg: 6.8,
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-happy-golden-retriever-dog-running-41584-large.mp4',
    health: {
      vaccinationStatus: 'Fully Vaccinated',
      healthScore: 99,
      microchipId: 'KCI-IND-985141005',
      dnaVerified: true,
      vetInspectionDate: '2026-07-25',
      deWormed: true,
      medicalHistory: ['KCI Pedigree Certificate', 'DHPP Vaccine Dose 1 & 2', 'OFA Hip Check Clear']
    },
    seller: {
      id: 'seller-tn-5',
      name: 'Dr. Anand Kumar',
      businessName: 'Chennai Supreme Canines (Nandanam)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 4.98,
      reviewsCount: 210,
      verifiedBreeder: true,
      city: 'Chennai',
      state: 'Tamil Nadu',
      phone: '+91 98400 12345',
      responseRate: '99% (< 15 mins)',
      joinedYear: 2017
    },
    traits: {
      affection: 5,
      energy: 4,
      grooming: 3,
      barking: 2,
      trainability: 5
    },
    suitableFor: {
      apartment: false,
      kids: true,
      firstTimeOwner: true,
      climate: 'Moderate'
    },
    foodRecommendation: 'Royal Canin Golden Retriever Puppy Kibble + 200ml fresh milk daily.',
    exerciseRecommendation: '45 mins gentle play, swimming, and socializing walks.',
    description: 'Aurelius is an imported line KCI certified Golden Retriever puppy raised in an AC indoor environment in Chennai. Gentle demeanor and ultra-intelligent.',
    certified: true,
    availableNow: true,
    featured: true
  },
  {
    id: 'dog-tn-6',
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
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80'
    ],
    health: {
      vaccinationStatus: 'Fully Vaccinated',
      healthScore: 97,
      microchipId: 'KCI-IND-985141006',
      dnaVerified: true,
      vetInspectionDate: '2026-07-28',
      deWormed: true,
      medicalHistory: ['Pavo & Distemper Core Shots', 'DNA Coat Genotype Cert']
    },
    seller: {
      id: 'seller-tn-6',
      name: 'Vikram Reddy',
      businessName: 'Silicon Valley Pet Club',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 4.95,
      reviewsCount: 88,
      verifiedBreeder: true,
      city: 'Bengaluru',
      state: 'Karnataka',
      phone: '+91 99000 11223',
      responseRate: '98% (< 30 mins)',
      joinedYear: 2021
    },
    traits: {
      affection: 5,
      energy: 2,
      grooming: 1,
      barking: 1,
      trainability: 4
    },
    suitableFor: {
      apartment: true,
      kids: true,
      firstTimeOwner: true,
      climate: 'Moderate'
    },
    foodRecommendation: 'Grain-free organic salmon kibble with coconut oil.',
    exerciseRecommendation: 'Short 20-minute daily walks in cool temperatures.',
    description: 'Bella is a rare Lilac Fawn French Bulldog with expressively cute eyes and compact build. Ideal for modern apartment living with AC.',
    certified: true,
    availableNow: true,
    featured: true
  },
  {
    id: 'dog-tn-7',
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
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=1200&q=80'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80'
    ],
    health: {
      vaccinationStatus: 'Fully Vaccinated',
      healthScore: 99,
      microchipId: 'KCI-TN-985141007',
      dnaVerified: true,
      vetInspectionDate: '2026-08-03',
      deWormed: true,
      medicalHistory: ['KCI Double Line Champion DNA', 'Hip & Elbow Dysplasia Clearance']
    },
    seller: {
      id: 'seller-tn-7',
      name: 'R. Periasamy',
      businessName: 'Salem Royal German Shepherd Kennel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 4.96,
      reviewsCount: 160,
      verifiedBreeder: true,
      city: 'Salem',
      state: 'Tamil Nadu',
      phone: '+91 97890 12345',
      responseRate: '99% (< 15 mins)',
      joinedYear: 2016
    },
    traits: {
      affection: 4,
      energy: 5,
      grooming: 3,
      barking: 3,
      trainability: 5
    },
    suitableFor: {
      apartment: false,
      kids: true,
      firstTimeOwner: false,
      climate: 'Moderate'
    },
    foodRecommendation: 'High protein chicken & rice puppy formula with glucosamine.',
    exerciseRecommendation: '60 mins active obedience training and ball fetch daily.',
    description: 'Kaiser is a heavy-boned, double-coat German Shepherd puppy from champion KCI bloodlines in Salem, Tamil Nadu.',
    certified: true,
    availableNow: true,
    featured: false
  },
  {
    id: 'dog-tn-8',
    name: 'Coco - Cute Toy Pomeranian',
    breed: 'Pomeranian',
    category: 'Small Dogs',
    age: '9 Weeks',
    ageMonths: 2.2,
    gender: 'Female',
    price: 22000,
    originalPrice: 26000,
    location: 'Tiruchirappalli, TN',
    color: 'Snow White Fluff',
    weightKg: 1.2,
    images: [
      'https://images.unsplash.com/photo-1546975490-e8b92a360b24?auto=format&fit=crop&w=1200&q=80'
    ],
    frames360: [
      'https://images.unsplash.com/photo-1546975490-e8b92a360b24?auto=format&fit=crop&w=600&q=80'
    ],
    health: {
      vaccinationStatus: 'Fully Vaccinated',
      healthScore: 98,
      microchipId: 'KCI-TN-985141008',
      dnaVerified: true,
      vetInspectionDate: '2026-07-29',
      deWormed: true,
      medicalHistory: ['Pavo Core Inoculated', 'KCI Registration Microchip']
    },
    seller: {
      id: 'seller-tn-8',
      name: 'N. Senthamarai',
      businessName: 'Kaveri Valley Toy Breeds (Trichy)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      rating: 4.94,
      reviewsCount: 105,
      verifiedBreeder: true,
      city: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      phone: '+91 94420 98765',
      responseRate: '96% (< 25 mins)',
      joinedYear: 2020
    },
    traits: {
      affection: 5,
      energy: 3,
      grooming: 4,
      barking: 2,
      trainability: 4
    },
    suitableFor: {
      apartment: true,
      kids: true,
      firstTimeOwner: true,
      climate: 'Moderate'
    },
    foodRecommendation: 'Small breed puppy kibble mixed with warm milk.',
    exerciseRecommendation: '20 mins light indoor play with squeaky toys.',
    description: 'Coco is a pocket-sized Pomeranian puppy with a teddy bear face and thick coat, perfect for family homes in Trichy.',
    certified: true,
    availableNow: true,
    featured: false
  }
];

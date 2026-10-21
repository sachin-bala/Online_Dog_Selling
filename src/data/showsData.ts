export interface DogShow {
  id: string;
  eventName: string;
  title?: string;
  organizer: string;
  bannerImage: string;
  image?: string;
  venue: string;
  location?: string;
  city: string;
  state: string;
  country: string;
  date: string;
  time: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline: string;
  registrationDetails?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  categories: string[];
  prizeDetails: string;
  registrationFee: number;
  chiefGuest?: string;
  sponsors?: string[];
  description: string;
  rules?: string[];
  contactEmail?: string;
  contactPhone?: string;
  websiteLink?: string;
  winners?: { category: string; dogName: string; ownerName: string; rank: string }[];
  createdAt?: string;
}

export interface ShowParticipant {
  id: string;
  showId: string;
  ownerName: string;
  email: string;
  phone: string;
  dogName: string;
  breed: string;
  age: string;
  gender: string;
  category: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  paymentStatus: 'Paid' | 'Pending';
  registrationDate: string;
  photoUrl: string;
}

export const INITIAL_DOG_SHOWS: DogShow[] = [
  {
    id: 'show-tn-1',
    eventName: '2026 Tamil Nadu State KCI All Breed Championship',
    organizer: 'Kennel Club of India (KCI) & TN Canine Association',
    bannerImage: '/images/shows/kci-championship.jpg',
    venue: 'Chennai Trade Centre, Nandanam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    date: 'August 25, 2026',
    time: '09:00 AM - 06:00 PM',
    registrationDeadline: 'August 18, 2026',
    status: 'Upcoming',
    categories: ['Best in Show (KCI Title)', 'Native Breeds (Rajapalayam, Chippiparai, Kanni, Kombai)', 'Puppy Championship (3-12 Mos)', 'Guard Breeds Agility'],
    prizeDetails: '₹2,50,000 Grand Cash Prize + KCI Gold Crown Trophy',
    registrationFee: 1500,
    chiefGuest: 'Dr. K. Sundararajan, President Kennel Club of India',
    sponsors: ['Royal Canin India', 'Pedigree Professional', 'PawVerse India', 'Garmin K9 GPS'],
    description: 'The premier Tamil Nadu championship dog show of 2026. Featuring 500+ elite pedigree participants, special Native South Indian breeds ring, agility trials, and live streaming.',
    rules: [
      'Must possess valid KCI microchip and DNA pedigree registration.',
      'Rabies and DHPP vaccines must be up to date (Passbook check at venue).',
      'Handlers must wear official tournament vest provided at check-in.'
    ],
    contactEmail: 'shows@pawverse.in',
    contactPhone: '+91 98400 12345',
    websiteLink: 'https://pawverse.in/shows/2026-kci-chennai',
    winners: []
  },
  {
    id: 'show-tn-2',
    eventName: 'South India Native Breeds Expo & Rajapalayam Championship',
    organizer: 'Tamil Nadu Native Dog Preservation Society',
    bannerImage: '/images/shows/rajapalayam-expo.jpg',
    venue: 'Madurai Race Course Grounds',
    city: 'Madurai',
    state: 'Tamil Nadu',
    country: 'India',
    date: 'August 15, 2026',
    time: '10:00 AM - 05:00 PM',
    registrationDeadline: 'August 10, 2026',
    status: 'Upcoming',
    categories: ['Best Purebred Rajapalayam', 'Chippiparai Speed & Conformation', 'Kanni Agility & Instinct', 'Kombai Bear Hound Title'],
    prizeDetails: '₹1,50,000 Cash Award + Traditional Silver Shield',
    registrationFee: 1000,
    chiefGuest: 'M. Palanivel, Heritage Breed Conservation Board Director',
    sponsors: ['Madurai Kennel Federation', 'PawVerse India'],
    description: 'An exclusive state celebration celebrating the rich heritage of Tamil Nadu native dog breeds.',
    rules: ['Mandatory vet health check at entrance.'],
    contactEmail: 'madurai-expo@pawverse.in',
    contactPhone: '+91 94432 12345',
    websiteLink: 'https://pawverse.in/shows/madurai-native-expo',
    winners: []
  }
];

export const INITIAL_PARTICIPANTS: ShowParticipant[] = [
  {
    id: 'part-1',
    showId: 'show-tn-1',
    ownerName: 'Dr. Anand Kumar',
    email: 'anand@chennaicanines.in',
    phone: '+91 98400 12345',
    dogName: 'Aurelius Champion',
    breed: 'Golden Retriever',
    age: '10 Weeks',
    gender: 'Male',
    category: 'Puppy Championship (3-12 Mos)',
    status: 'Approved',
    paymentStatus: 'Paid',
    registrationDate: '2026-07-28',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80'
  }
];

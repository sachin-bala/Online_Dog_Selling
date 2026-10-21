export interface BreedInfo {
  name: string;
  category: string;
  origin: string;
  lifeExpectancy: string;
  avgWeight: string;
  energyLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  sheddingLevel: 'Low' | 'Moderate' | 'High';
  apartmentFriendly: boolean;
  kidFriendly: boolean;
  image: string;
  avgPriceRange: string;
  description: string;
}

export const BREEDS_LIST: BreedInfo[] = [
  {
    name: 'Rajapalayam',
    category: 'Rare Breeds',
    origin: 'Rajapalayam, Tamil Nadu, India',
    lifeExpectancy: '12-15 Years',
    avgWeight: '25 - 32 kg',
    energyLevel: 'High',
    sheddingLevel: 'Low',
    apartmentFriendly: false,
    kidFriendly: true,
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    avgPriceRange: '₹30,000 - ₹45,000',
    description: 'Royal sight hound of Nayak Dynasty. Pristine white coat, pink nose, courageous guardian & family protector.'
  },
  {
    name: 'Chippiparai',
    category: 'Rare Breeds',
    origin: 'Madurai & Virudhunagar, Tamil Nadu, India',
    lifeExpectancy: '13-16 Years',
    avgWeight: '18 - 25 kg',
    energyLevel: 'Very High',
    sheddingLevel: 'Low',
    apartmentFriendly: false,
    kidFriendly: true,
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
    avgPriceRange: '₹25,000 - ₹35,000',
    description: 'Swift, graceful Tamil Nadu hunting breed. Extremely hardy, disease-resistant, and intensely loyal.'
  },
  {
    name: 'Kanni',
    category: 'Guard Dogs',
    origin: 'Southern Tamil Nadu, India',
    lifeExpectancy: '14-16 Years',
    avgWeight: '16 - 22 kg',
    energyLevel: 'Very High',
    sheddingLevel: 'Low',
    apartmentFriendly: false,
    kidFriendly: true,
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
    avgPriceRange: '₹28,000 - ₹38,000',
    description: 'Distinctive black & tan hound of South TN. Revered for agility, alertness, and deep devotion to owners.'
  },
  {
    name: 'Kombai',
    category: 'Guard Dogs',
    origin: 'Western Ghats / Coimbatore, Tamil Nadu',
    lifeExpectancy: '12-15 Years',
    avgWeight: '22 - 30 kg',
    energyLevel: 'High',
    sheddingLevel: 'Low',
    apartmentFriendly: false,
    kidFriendly: true,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    avgPriceRange: '₹25,000 - ₹35,000',
    description: 'Ancient bear hound of South India. Muscular red-brown body with black mask, supreme estate guardian.'
  },
  {
    name: 'Golden Retriever',
    category: 'Family Dogs',
    origin: 'Scotland / KCI Registered',
    lifeExpectancy: '10-12 Years',
    avgWeight: '25 - 34 kg',
    energyLevel: 'High',
    sheddingLevel: 'High',
    apartmentFriendly: false,
    kidFriendly: true,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    avgPriceRange: '₹35,000 - ₹60,000',
    description: 'Renowned for gentle nature, high intelligence, and rich golden coat. The ultimate Indian family dog.'
  },
  {
    name: 'German Shepherd',
    category: 'Guard Dogs',
    origin: 'Germany / KCI Champion Line',
    lifeExpectancy: '9-13 Years',
    avgWeight: '22 - 40 kg',
    energyLevel: 'Very High',
    sheddingLevel: 'High',
    apartmentFriendly: false,
    kidFriendly: true,
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
    avgPriceRange: '₹30,000 - ₹50,000',
    description: 'Intelligent, courageous, and loyal. Heavy-boned protective companion favored across India.'
  },
  {
    name: 'French Bulldog',
    category: 'Small Dogs',
    origin: 'France / AC Apartment Breed',
    lifeExpectancy: '10-14 Years',
    avgWeight: '8 - 14 kg',
    energyLevel: 'Low',
    sheddingLevel: 'Low',
    apartmentFriendly: true,
    kidFriendly: true,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    avgPriceRange: '₹55,000 - ₹90,000',
    description: 'Charming, quiet, and low-maintenance. Popular luxury city apartment companion in metro India.'
  },
  {
    name: 'Pomeranian',
    category: 'Small Dogs',
    origin: 'Pomerania / Toy Breed',
    lifeExpectancy: '12-16 Years',
    avgWeight: '1.5 - 3.5 kg',
    energyLevel: 'Moderate',
    sheddingLevel: 'Moderate',
    apartmentFriendly: true,
    kidFriendly: true,
    image: 'https://images.unsplash.com/photo-1546975490-e8b92a360b24?auto=format&fit=crop&w=800&q=80',
    avgPriceRange: '₹18,000 - ₹30,000',
    description: 'Extroverted, lively, and compact. Double coat fluff with expressive face loved across South India.'
  }
];

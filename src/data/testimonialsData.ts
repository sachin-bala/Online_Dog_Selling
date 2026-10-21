export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  dogName: string;
  dogBreed: string;
  dogImage: string;
  rating: number;
  content: string;
  city: string;
  verifiedBuyer: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Karthik & Ananya Sundaram',
    role: 'Software Architect & Doctor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    dogName: 'Veera',
    dogBreed: 'Rajapalayam',
    dogImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    content: 'Adopting purebred Veera through PawVerse India was seamless! The KCI microchip certificate, live video verification, and door-to-door AC pet transport delivered him safely to our doorstep in Chennai.',
    city: 'Chennai, Tamil Nadu',
    verifiedBuyer: true
  },
  {
    id: 't-2',
    name: 'Dr. Vijaykumar Rajan',
    role: 'Senior Surgeon',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    dogName: 'Madurai Velan',
    dogBreed: 'Chippiparai',
    dogImage: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    content: 'As someone passionate about native South Indian hounds, finding an authentic Chippiparai pup with full DNA health screening in Coimbatore was amazing. Instant UPI payment made checkout super fast!',
    city: 'Coimbatore, Tamil Nadu',
    verifiedBuyer: true
  },
  {
    id: 't-3',
    name: 'Meenakshi Subramanian',
    role: 'Organic Farm Entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    dogName: 'Singham',
    dogBreed: 'Kombai',
    dogImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    content: 'Singham is the perfect loyal guard for our orchard near Madurai. PawVerse provided full veterinary clearance and 1-year health guarantee. Best platform in Tamil Nadu!',
    city: 'Madurai, Tamil Nadu',
    verifiedBuyer: true
  }
];

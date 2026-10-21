export interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Preserving Royal Tamil Nadu Breeds: Rajapalayam, Chippiparai, Kanni & Kombai',
    category: 'Heritage & Conservation',
    readTime: '5 min read',
    author: 'M. Palanivel, Native Hound Specialist',
    date: 'July 28, 2026',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Explore the history of South Indian royal hounds, their natural heat immunity, high intelligence, and essential care tips for home owners.'
  },
  {
    id: 'blog-2',
    title: 'Summer Pet Care in South India: Hydration & Heat Stroke Prevention',
    category: 'Nutrition & Health',
    readTime: '4 min read',
    author: 'Dr. Evelyn Reed, DVM India',
    date: 'July 20, 2026',
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Essential summer diet adjustments, ragi porridge benefits, hydration schedules, and shade exercise guidelines for dogs in Tamil Nadu.'
  },
  {
    id: 'blog-3',
    title: 'KCI Registration & Microchipping Guide for Indian Dog Owners',
    category: 'Legal & Certifications',
    readTime: '6 min read',
    author: 'Dr. Anand Kumar, KCI Official',
    date: 'July 15, 2026',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Step-by-step procedure to microchip your dog, register pedigree certificates with Kennel Club of India (KCI), and prevent pet loss.'
  }
];

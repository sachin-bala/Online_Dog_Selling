import mongoose from 'mongoose';
import { DogShow } from '../models/DogShow.js';
import { env } from '../config/environment.js';

async function main() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Update existing shows
  await DogShow.updateMany(
    { title: { $regex: /KCI All Breed/i } },
    { $set: { bannerImage: '/images/shows/kci-championship.jpg' } }
  );

  await DogShow.updateMany(
    { title: { $regex: /Native Breeds/i } },
    { $set: { bannerImage: '/images/shows/rajapalayam-expo.jpg' } }
  );

  // If there's only 1 show, let's also ensure the Native Breeds Expo is present if needed
  const count = await DogShow.countDocuments();
  if (count === 1) {
    await DogShow.create({
      title: 'South India Native Breeds Expo & Rajapalayam Championship',
      bannerImage: '/images/shows/rajapalayam-expo.jpg',
      description: 'An exclusive state celebration celebrating the rich heritage of Tamil Nadu native dog breeds with agility trials and championship rings.',
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
      categories: ['Best Purebred Rajapalayam', 'Chippiparai Speed & Conformation', 'Kanni Agility', 'Kombai Title'],
      prizes: '₹1,50,000 Cash Award + Traditional Silver Shield',
      registrationFee: 1000,
      contactEmail: 'madurai-expo@pawverse.ai',
      contactPhone: '+91 94432 12345',
    });
  }

  const allShows = await DogShow.find();
  console.log('Updated Dog Shows:');
  for (const s of allShows) {
    console.log(`- ${s.title}: ${s.bannerImage}`);
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error fixing dog show images:', err);
  process.exit(1);
});

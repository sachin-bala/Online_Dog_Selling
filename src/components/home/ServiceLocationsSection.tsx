import React from 'react';
import { MapPin, ArrowRight, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CityItem {
  id: string;
  name: string;
  state: string;
  count: string;
  transitTime: string;
  popularBreeds: string;
  image: string;
}

export const ServiceLocationsSection: React.FC = () => {
  const { setActiveTab, setSearchQuery, addNotification } = useApp();

  const cities: CityItem[] = [
    {
      id: 'chennai',
      name: 'Chennai',
      state: 'Tamil Nadu',
      count: '42+ Puppies',
      transitTime: 'Same Day / 24h AC Transport',
      popularBreeds: 'Golden Retriever, Rajapalayam, Shih Tzu',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'coimbatore',
      name: 'Coimbatore',
      state: 'Tamil Nadu',
      count: '28+ Puppies',
      transitTime: '24h AC Climate Transit',
      popularBreeds: 'Labrador, Kanni, Beagle',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'madurai',
      name: 'Madurai',
      state: 'Tamil Nadu',
      count: '24+ Puppies',
      transitTime: '24h AC Climate Transit',
      popularBreeds: 'Chippiparai, Combai, German Shepherd',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'rajapalayam',
      name: 'Rajapalayam',
      state: 'Tamil Nadu',
      count: '19+ Puppies',
      transitTime: 'Direct Kennel Hub / Pickup',
      popularBreeds: 'Royal Rajapalayam Hound Champion',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'bengaluru',
      name: 'Bengaluru',
      state: 'Karnataka',
      count: '36+ Puppies',
      transitTime: '24-36h Chaperoned AC Transport',
      popularBreeds: 'Siberian Husky, Poodle, Cane Corso',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'salem',
      name: 'Salem & Trichy',
      state: 'Tamil Nadu',
      count: '21+ Puppies',
      transitTime: '24h AC Climate Transit',
      popularBreeds: 'Beagle, Kanni, Golden Retriever',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleCityClick = (city: CityItem) => {
    setSearchQuery(city.name);
    setActiveTab('explore');
    addNotification(`Filtered puppies available for delivery in ${city.name}, ${city.state} 🐾`);
  };

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF9C3] dark:bg-[#18181B] text-[#713F12] dark:text-[#FACC15] border border-[#FDE047] dark:border-[#27272A] uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#EAB308]" /> Service Areas
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] dark:text-white mt-1 font-heading">
            Puppies Available Near You
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] font-normal mt-0.5">
            Safe, climate-controlled door-to-door delivery with certified veterinary handlers across all major cities.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="btn-outline px-4 py-2 text-xs font-bold flex items-center gap-1.5 shrink-0"
        >
          <span>View All Locations</span>
          <ArrowRight className="w-4 h-4 text-[#EAB308]" />
        </button>
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cities.map((city) => (
          <div
            key={city.id}
            onClick={() => handleCityClick(city)}
            className="p-5 rounded-3xl bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] hover:border-[#EAB308] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#CA8A04]" />
                  <h3 className="font-bold text-base text-[#0A0A0A] dark:text-[#0A0A0A] group-hover:text-[#854D0E] transition-colors font-heading">
                    {city.name}
                  </h3>
                  <span className="text-[11px] text-[#713F12] font-semibold">({city.state})</span>
                </div>
                <p className="text-[11px] text-[#713F12] line-clamp-1 font-medium">
                  Popular: <span className="text-[#0A0A0A] dark:text-[#0A0A0A] font-bold">{city.popularBreeds}</span>
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-[#0A0A0A] text-[#FACC15] border border-black text-[11px] font-bold shrink-0 shadow-xs">
                {city.count}
              </span>
            </div>

            {/* City Transit Pill & Action */}
            <div className="pt-3 border-t border-[#FDE047] dark:border-[#FDE047] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#854D0E] font-bold text-[11px]">
                <Truck className="w-3.5 h-3.5 text-[#CA8A04]" />
                <span>{city.transitTime}</span>
              </div>

              <span className="text-[#0A0A0A] dark:text-[#0A0A0A] font-extrabold text-xs flex items-center gap-1 group-hover:text-[#854D0E] group-hover:translate-x-1 transition-all">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

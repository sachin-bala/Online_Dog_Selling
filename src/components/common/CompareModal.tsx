import React from 'react';
import { X, Check, ShieldCheck, Sparkles, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CompareModal: React.FC = () => {
  const { compareList, toggleCompare, isCompareOpen, setIsCompareOpen, dogs, startCheckout } = useApp();

  if (!isCompareOpen) return null;

  const comparedDogs = dogs.filter(d => compareList.includes(d.id));

  return (
    <div className="fixed inset-0 z-50 bg-[#242424]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-white border border-[#E8DED3] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8DED3] flex items-center justify-between bg-[#FFF9F2]">
          <div>
            <h3 className="text-xl font-black text-[#5B3A29] flex items-center gap-2">
              <span>Companion Comparison</span>
              <span className="text-xs bg-[#D89B5B]/20 text-[#5B3A29] px-2.5 py-0.5 rounded-full border border-[#D89B5B]/30 font-bold shadow-xs">
                {comparedDogs.length} Selected
              </span>
            </h3>
            <p className="text-xs text-[#6B7280] font-medium">Side-by-side health scores, pedigree certifications, and seller attributes</p>
          </div>

          <button
            onClick={() => setIsCompareOpen(false)}
            className="p-2 rounded-xl bg-white border border-[#E8DED3] text-[#5B3A29] hover:bg-[#FFF9F2] transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Table / Matrix */}
        {comparedDogs.length === 0 ? (
          <div className="p-12 text-center space-y-4 bg-white">
            <Sparkles className="w-12 h-12 text-[#D89B5B] mx-auto animate-bounce" />
            <h4 className="text-lg font-black text-[#5B3A29]">No Dogs Selected for Comparison</h4>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-sm mx-auto font-normal">
              Click the "Compare" button on any dog card in the catalog to benchmark their health scores, prices, and pedigree certifications.
            </p>
            <button
              onClick={() => setIsCompareOpen(false)}
              className="btn-primary"
            >
              Browse Available Dogs
            </button>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-[#6B7280] font-bold uppercase tracking-wider w-36">Attribute</th>
                  {comparedDogs.map(dog => (
                    <th key={dog.id} className="p-3 min-w-[200px]">
                      <div className="relative group p-3 rounded-2xl bg-[#FFF9F2] border border-[#E8DED3]">
                        <button
                          onClick={() => toggleCompare(dog.id)}
                          className="absolute top-4 right-4 p-1.5 rounded-full bg-white text-[#D64545] shadow-xs hover:bg-[#D64545] hover:text-white transition-colors cursor-pointer border border-[#E8DED3]"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={dog.images[0]}
                          alt={dog.name}
                          className="w-full h-32 object-cover rounded-xl mb-2.5 border border-[#E8DED3]"
                        />
                        <h4 className="font-bold text-[#242424] text-sm truncate">{dog.name}</h4>
                        <p className="text-[11px] text-[#D89B5B] font-bold uppercase">{dog.breed}</p>
                        <div className="mt-1.5 text-base font-black text-[#D89B5B]">₹{dog.price.toLocaleString()}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED3] text-[#242424]">
                <tr>
                  <td className="p-3 font-bold text-[#6B7280]">Health Score</td>
                  {comparedDogs.map(dog => (
                    <td key={dog.id} className="p-3">
                      <span className="inline-flex items-center gap-1 font-bold text-[#2F7D68] bg-[#2F7D68]/10 px-2.5 py-1 rounded-full border border-[#2F7D68]/20">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2F7D68]" /> {dog.health.healthScore}/100
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#6B7280]">Age & Gender</td>
                  {comparedDogs.map(dog => (
                    <td key={dog.id} className="p-3 font-medium text-[#242424]">{dog.age} • {dog.gender}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#6B7280]">Vaccination Status</td>
                  {comparedDogs.map(dog => (
                    <td key={dog.id} className="p-3 text-[#2F7D68] font-bold">{dog.health.vaccinationStatus}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#6B7280]">Microchip & DNA</td>
                  {comparedDogs.map(dog => (
                    <td key={dog.id} className="p-3">
                      {dog.health.dnaVerified ? (
                        <span className="text-[#2F7D68] flex items-center gap-1 font-bold">
                          <Check className="w-3.5 h-3.5 text-[#2F7D68]" /> Verified DNA
                        </span>
                      ) : 'Standard'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#6B7280]">Seller & City</td>
                  {comparedDogs.map(dog => (
                    <td key={dog.id} className="p-3">
                      <div className="font-bold text-[#242424]">{dog.seller.businessName}</div>
                      <div className="text-[11px] text-[#6B7280]">{dog.location}</div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#6B7280]">Action</td>
                  {comparedDogs.map(dog => (
                    <td key={dog.id} className="p-3">
                      <button
                        onClick={() => {
                          setIsCompareOpen(false);
                          startCheckout(dog);
                        }}
                        className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Buy ₹{dog.price.toLocaleString()}</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

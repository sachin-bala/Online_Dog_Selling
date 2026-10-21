import React from 'react';
import { BLOG_POSTS } from '../../data/blogData';
import { Clock, ArrowRight, BookOpen, User } from 'lucide-react';

export const PetCareBlog: React.FC = () => {
  const getCategoryBadge = (category: string) => {
    if (category.toLowerCase().includes('nutrition') || category.toLowerCase().includes('diet')) {
      return 'bg-[#FEF08A] text-[#713F12] border border-[#FACC15] font-bold';
    }
    if (category.toLowerCase().includes('health') || category.toLowerCase().includes('care')) {
      return 'bg-[#0A0A0A] text-[#FACC15] border border-[#27272A] font-bold';
    }
    return 'bg-[#FEF9C3] text-[#713F12] border border-[#FDE047] font-bold';
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713F12] dark:text-[#FACC15] bg-[#FEF9C3] dark:bg-[#18181B] px-3.5 py-1 rounded-full border border-[#FDE047] dark:border-[#27272A] shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#EAB308]" />
            Veterinary Knowledge Base
          </span>
          <h2 className="text-3xl font-extrabold text-[#0A0A0A] dark:text-white mt-2 font-heading">
            Pet Care & Nutrition Tips
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] font-normal mt-0.5">
            Expert guidance from certified veterinarians on puppy vaccination schedules, nutrition, and training.
          </p>
        </div>

        <button className="btn-outline text-xs font-bold flex items-center gap-1.5 cursor-pointer">
          <span>Read All Guides</span>
          <ArrowRight className="w-4 h-4 text-[#EAB308]" />
        </button>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl overflow-hidden bg-[#FEF9C3] dark:bg-[#FEF9C3] border border-[#FDE047] hover:border-[#EAB308] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between shadow-sm"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#FAFAFA] dark:bg-[#18181B]">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-xs backdrop-blur-md ${getCategoryBadge(post.category)}`}>
                {post.category}
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[11px] text-[#713F12]">
                  <Clock className="w-3.5 h-3.5 text-[#CA8A04]" />
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="font-bold text-[#0A0A0A] dark:text-[#0A0A0A] text-base group-hover:text-[#854D0E] transition-colors line-clamp-2 font-heading">
                  {post.title}
                </h3>

                <p className="text-xs text-[#713F12] dark:text-[#713F12] line-clamp-2 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#FDE047] dark:border-[#FDE047] flex items-center justify-between text-xs">
                <span className="font-bold text-[#0A0A0A] dark:text-[#0A0A0A] text-[11px] flex items-center gap-1">
                  <User className="w-3 h-3 text-[#CA8A04]" /> {post.author}
                </span>
                <span className="text-[#854D0E] font-extrabold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 cursor-pointer hover:text-[#0A0A0A]">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

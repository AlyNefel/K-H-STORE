import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const { categories, language, activeCategoryFilter, setActiveCategoryFilter, products } = useStore();

  const handleSelect = (slug: string) => {
    setActiveCategoryFilter(slug);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-[#FFF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#B77D83] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'عالم K&H الفاخر' : 'Univers de la Boutique'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#292626]">
            {language === 'ar' ? 'تسوقي حسب القسم' : 'Explorez Nos Catégories'}
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A477] mx-auto mt-3 rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.slug).length;
            const isSelected = activeCategoryFilter === cat.slug;

            return (
              <div
                key={cat.slug || cat._id}
                onClick={() => handleSelect(cat.slug)}
                className={`group cursor-pointer rounded-2xl p-3 bg-white border transition-all duration-300 text-center flex flex-col items-center hover:shadow-md ${
                  isSelected 
                    ? 'border-[#B77D83] ring-2 ring-[#B77D83]/20 shadow-md' 
                    : 'border-[#F5E7E5] hover:border-[#C5A477]/50'
                }`}
              >
                {/* Image Container with zoom */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-[#F5E7E5] group-hover:border-[#B77D83] transition-colors relative">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#292626]/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Category Title */}
                <h3 className="text-xs sm:text-sm font-bold text-[#292626] group-hover:text-[#B77D83] transition-colors line-clamp-2 min-h-[36px] flex items-center justify-center">
                  {language === 'ar' ? cat.nameAr : (language === 'fr' ? (cat.nameFr || cat.name) : cat.name)}
                </h3>

                {/* Count Badge */}
                <span className="text-[11px] text-[#8A7E7C] mt-1 font-medium">
                  {count} {language === 'ar' ? 'منتجات' : 'articles'}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Filter, SlidersHorizontal, ArrowUpDown, X, Check, Star, Sparkles, 
  Tag, RefreshCw, LayoutGrid, Grid3X3, Grid2X2, PackageCheck 
} from 'lucide-react';
import { useStore, ProductItem } from '../context/StoreContext.tsx';
import { ProductCard } from './ProductCard.tsx';

export const StoreCatalog: React.FC = () => {
  const { 
    products, 
    categories, 
    loading, 
    language, 
    t, 
    formatPrice,
    activeCategoryFilter, 
    setActiveCategoryFilter,
    searchQuery,
    setSearchQuery,
    wishlist
  } = useStore();

  // Local filter states
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(300);
  const [stockOnly, setStockOnly] = useState(false);
  const [saleOnly, setSaleOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);

  // Compute subcategories for active category
  const currentCategoryObj = categories.find(c => c.slug === activeCategoryFilter);
  const availableSubcategories = currentCategoryObj?.subcategories || [
    'فساتين سهرة', 'قفاطين عصرية', 'حقائب يد جلدية', 'عطور شرقية وفواحة', 
    'أواني تقديم رخامية', 'شموع عطرية وفواحات'
  ];

  const handleSubcategoryToggle = (sub: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleResetFilters = () => {
    setActiveCategoryFilter('all');
    setSelectedSubcategories([]);
    setPriceRange(300);
    setStockOnly(false);
    setSaleOnly(false);
    setMinRating(0);
    setSearchQuery('');
  };

  // Filtered & Sorted Products computation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Wishlist / Category
    if (activeCategoryFilter === 'wishlist') {
      result = result.filter(p => wishlist.includes(p._id));
    } else if (activeCategoryFilter && activeCategoryFilter !== 'all') {
      result = result.filter(p => p.category === activeCategoryFilter);
    }

    // 2. Subcategories
    if (selectedSubcategories.length > 0) {
      result = result.filter(p => p.subcategory && selectedSubcategories.includes(p.subcategory));
    }

    // 3. Price Filter (<= priceRange)
    result = result.filter(p => (p.salePrice || p.price) <= priceRange);

    // 4. Stock Only
    if (stockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // 5. Sale Only
    if (saleOnly) {
      result = result.filter(p => p.salePrice && p.salePrice < p.price);
    }

    // 6. Rating
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // 7. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.titleAr.includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // 8. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, activeCategoryFilter, selectedSubcategories, priceRange, stockOnly, saleOnly, minRating, searchQuery, sortBy, wishlist]);

  const activeFiltersCount = (activeCategoryFilter !== 'all' ? 1 : 0) +
    selectedSubcategories.length +
    (stockOnly ? 1 : 0) +
    (saleOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceRange < 300 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Filter Sidebar Content Component
  const FilterSidebarContent = (
    <div className="space-y-6 text-xs select-none">
      
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F5E7E5]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#B77D83]" />
          <h3 className="font-bold text-sm text-[#292626] uppercase tracking-wider">
            {language === 'ar' ? 'تصفية المنتجات' : 'Filtres Boutique'}
          </h3>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#B77D83] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] text-[#B77D83] hover:underline font-semibold"
          >
            {language === 'ar' ? 'إعادة ضبط' : 'Réinitialiser'}
          </button>
        )}
      </div>

      {/* 1. Category Selector */}
      <div>
        <h4 className="font-bold text-[#292626] mb-2.5 uppercase tracking-wider text-[11px]">
          {t('categories')}
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('all')}
            className={`w-full text-start px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
              activeCategoryFilter === 'all'
                ? 'bg-[#B77D83] text-white font-bold shadow-xs'
                : 'text-[#292626] hover:bg-white'
            }`}
          >
            <span>{t('allCategories')}</span>
            <span className="text-[10px] opacity-80">({products.length})</span>
          </button>

          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.slug).length;
            const isSelected = activeCategoryFilter === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategoryFilter(cat.slug)}
                className={`w-full text-start px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#B77D83] text-white font-bold shadow-xs'
                    : 'text-[#292626] hover:bg-white'
                }`}
              >
                <span>{language === 'ar' ? cat.nameAr : cat.name}</span>
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-[#292626] uppercase tracking-wider text-[11px]">
            {language === 'ar' ? 'السعر الأقصى' : 'Prix maximum'}
          </h4>
          <span className="font-bold text-[#B77D83] bg-white px-2 py-0.5 rounded-md border border-[#EADCD8]">
            {formatPrice(priceRange)}
          </span>
        </div>
        <input
          type="range"
          min="30"
          max="300"
          step="5"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-[#B77D83] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>30 د.ت</span>
          <span>150 د.ت</span>
          <span>300 د.ت</span>
        </div>
      </div>

      {/* 3. Availability & Deals Toggle */}
      <div>
        <h4 className="font-bold text-[#292626] mb-2.5 uppercase tracking-wider text-[11px]">
          {language === 'ar' ? 'حالة التوفر والعروض' : 'Disponibilité & Promos'}
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl bg-white hover:bg-[#FFF9F5] border border-[#F5E7E5] transition-all">
            <input
              type="checkbox"
              checked={stockOnly}
              onChange={(e) => setStockOnly(e.target.checked)}
              className="rounded text-[#B77D83] focus:ring-[#B77D83]"
            />
            <span className="font-medium text-[#292626]">
              {language === 'ar' ? 'متوفر في المخزون فقط' : 'En stock uniquement'}
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl bg-white hover:bg-[#FFF9F5] border border-[#F5E7E5] transition-all">
            <input
              type="checkbox"
              checked={saleOnly}
              onChange={(e) => setSaleOnly(e.target.checked)}
              className="rounded text-[#B77D83] focus:ring-[#B77D83]"
            />
            <span className="font-medium text-[#B77D83] font-bold">
              {language === 'ar' ? 'عروض وتخفيضات خاصة %' : 'Articles en promotion %'}
            </span>
          </label>
        </div>
      </div>

      {/* 4. Customer Rating Filter */}
      <div>
        <h4 className="font-bold text-[#292626] mb-2 uppercase tracking-wider text-[11px]">
          {language === 'ar' ? 'تقييم الزبونات' : 'Évaluation'}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {[0, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 ${
                minRating === rating
                  ? 'bg-[#292626] text-white border-[#292626]'
                  : 'bg-white text-[#292626] border-[#EADCD8] hover:border-[#B77D83]'
              }`}
            >
              {rating === 0 ? (
                <span>{language === 'ar' ? 'كافة التقييمات' : 'Tous'}</span>
              ) : (
                <>
                  <Star className="w-3 h-3 fill-[#C5A477] text-[#C5A477]" />
                  <span>{rating}★ {language === 'ar' ? 'فما فوق' : '+'}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Subcategories Tags */}
      {availableSubcategories.length > 0 && (
        <div>
          <h4 className="font-bold text-[#292626] mb-2 uppercase tracking-wider text-[11px]">
            {language === 'ar' ? 'الأقسام الفرعية' : 'Sous-catégories'}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {availableSubcategories.map((sub: string) => {
              const active = selectedSubcategories.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSubcategoryToggle(sub)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    active
                      ? 'bg-[#B77D83] text-white shadow-xs'
                      : 'bg-white text-[#292626] border border-[#EADCD8] hover:border-[#B77D83]'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );

  return (
    <section id="catalog-section" className="py-12 bg-gradient-to-b from-[#FFF9F5] via-[#FFF6F2] to-[#FFF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B77D83] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A477]" />
              <span>{language === 'ar' ? 'متجر K&H الحصري' : 'Boutique K&H Exclusive'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#292626]">
              {activeCategoryFilter === 'wishlist' 
                ? t('wishlist') 
                : (activeCategoryFilter === 'all' 
                    ? (language === 'ar' ? 'كافة المجموعات والتشكيلات' : 'Toutes les collections') 
                    : (categories.find(c => c.slug === activeCategoryFilter)?.nameAr || activeCategoryFilter))}
            </h2>
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EADCD8] rounded-xl text-xs font-bold text-[#292626] shadow-xs hover:border-[#B77D83]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#B77D83]" />
            <span>{language === 'ar' ? 'تصفية المنتجات' : 'Filtrer les articles'}</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#B77D83] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Catalog Control Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-[#F5E7E5] mb-8 shadow-xs">
          
          <div className="flex items-center gap-2 text-xs text-[#8A7E7C]">
            <span className="font-bold text-[#292626] text-sm">{filteredProducts.length}</span>
            <span>{language === 'ar' ? 'منتجات مطابقة' : 'articles trouvés'}</span>

            {/* Active Tag Pills */}
            {activeCategoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F5E7E5] text-[#B77D83] font-bold text-[11px] ms-2">
                <span>{categories.find(c => c.slug === activeCategoryFilter)?.nameAr || activeCategoryFilter}</span>
                <button type="button" onClick={() => setActiveCategoryFilter('all')} className="hover:text-black">✕</button>
              </span>
            )}
            {selectedSubcategories.map(sub => (
              <span key={sub} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F5E7E5] text-[#292626] font-medium text-[11px]">
                <span>{sub}</span>
                <button type="button" onClick={() => handleSubcategoryToggle(sub)} className="hover:text-red-600">✕</button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Grid density toggle for desktop */}
            <div className="hidden sm:flex items-center gap-1 bg-[#FFF9F5] p-1 rounded-lg border border-[#EADCD8]">
              <button
                type="button"
                onClick={() => setGridColumns(3)}
                className={`p-1.5 rounded-md transition-colors ${gridColumns === 3 ? 'bg-white text-[#B77D83] shadow-xs' : 'text-gray-400 hover:text-black'}`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setGridColumns(4)}
                className={`p-1.5 rounded-md transition-colors ${gridColumns === 4 ? 'bg-white text-[#B77D83] shadow-xs' : 'text-gray-400 hover:text-black'}`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">{t('sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FFF9F5] border border-[#EADCD8] rounded-xl px-3 py-1.5 font-bold text-xs text-[#292626] outline-none focus:border-[#B77D83] cursor-pointer"
              >
                <option value="newest">{t('sortNewest')}</option>
                <option value="price-asc">{t('sortPriceAsc')}</option>
                <option value="price-desc">{t('sortPriceDesc')}</option>
                <option value="rating">{language === 'ar' ? 'الأعلى تقييماً' : 'Mieux notés'}</option>
              </select>
            </div>
          </div>

        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Left/Right Sticky Glassmorphic Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-28 p-5 bg-white/70 backdrop-blur-xl rounded-2xl border border-[#F5E7E5] shadow-xs">
            {FilterSidebarContent}
          </aside>

          {/* Product Grid Pane */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-24 text-center text-xs text-[#8A7E7C]">
                <Sparkles className="w-8 h-8 text-[#C5A477] animate-spin mx-auto mb-3" />
                <p>{language === 'ar' ? 'جارٍ تحميل تشكيلة K&H الفاخرة...' : 'Chargement de la boutique...'}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white/80 backdrop-blur-md rounded-2xl border border-[#F5E7E5] p-8 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#F5E7E5] text-[#B77D83] flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <p className="font-bold text-base text-[#292626] mb-1">
                  {language === 'ar' ? 'لم يتم العثور على منتجات مطابقة لتصفياتكِ' : 'Aucun produit ne correspond à vos filtres'}
                </p>
                <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
                  {language === 'ar' ? 'جربي تعديل نطاق السعر أو إزالة بعض معايير التصفية.' : 'Essayez d\'ajuster vos critères ou de réinitialiser vos filtres.'}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#B77D83] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#a66a71] transition-all"
                >
                  {language === 'ar' ? 'إعادة ضبط كافة الفلاتر' : 'Réinitialiser les filtres'}
                </button>
              </div>
            ) : (
              <div className={`grid grid-cols-2 ${gridColumns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 xl:grid-cols-4'} gap-4 sm:gap-6`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="fixed inset-y-0 start-0 max-w-full flex">
            <div className="w-screen max-w-xs sm:max-w-sm bg-[#FFF9F5] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#F5E7E5] mb-6">
                  <h3 className="font-bold text-base text-[#292626] font-serif">
                    {language === 'ar' ? 'تصفية المنتجات' : 'Filtres'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1.5 rounded-full hover:bg-[#F5E7E5] text-gray-400 hover:text-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {FilterSidebarContent}
              </div>

              <div className="pt-6 border-t border-[#F5E7E5] mt-6">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3.5 bg-[#B77D83] hover:bg-[#a66a71] text-white rounded-xl font-bold text-xs shadow-md transition-all text-center"
                >
                  {language === 'ar' ? `عرض النتائج (${filteredProducts.length})` : `Afficher les résultats (${filteredProducts.length})`}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
};

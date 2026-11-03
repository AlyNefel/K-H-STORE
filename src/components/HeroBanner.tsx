import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, ArrowRight, Sparkles, Star, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const HeroBanner: React.FC = () => {
  const { banners, language, t, setActiveCategoryFilter, products, setQuickViewProduct } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement | null>(null);

  const heroBanners = banners.filter(b => b.position === 'hero' && b.isActive);
  const activeBanners = heroBanners.length > 0 ? heroBanners : [
    {
      titleAr: "تشكيلة ربيع 2026: أنوثة راقية وألوان دافئة",
      titleFr: "Élégance Printemps 2026 : Féminité & Couleurs Douces",
      title: "Spring Elegance 2026: Modern Femininity",
      subtitleAr: "اكتشفي أحدث إبداعات الأزياء النسائية، العبايات الراقية ومستلزمات البيت التونسي الأنيق مع متجر K&H.",
      subtitleFr: "Découvrez nos nouvelles créations exclusives pour femme et maison avec livraison express en Tunisie.",
      subtitle: "Discover modern women's fashion and artisanal home decor with express delivery across Tunisia.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85",
      link: "womens-fashion",
      featuredProductId: "p1"
    },
    {
      titleAr: "فن الضيافة ومائدة البيت الأنيق",
      titleFr: "Art de la Table & Maison Raffinée",
      title: "Artisanal Table & Living Collection",
      subtitleAr: "أطقم تقديم رخامية، بورسلان مذهب ومستلزمات مطبخ تمنح منزلكِ دفئاً استثنائياً وفخامة تليق بضيوفكِ.",
      subtitleFr: "Sublimez votre intérieur avec nos collections de vaisselle prestigieuse et décorations intemporelles.",
      subtitle: "Handcrafted marble trays, porcelain and kitchen essentials designed for prestigious hosting.",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=85",
      link: "kitchen-tableware",
      featuredProductId: "p3"
    }
  ];

  // Auto-advance slider
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Parallax mouse movement calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const slide = activeBanners[currentSlide];
  const featuredProduct = products.find(p => p._id === (slide as any).featuredProductId) || products[0];

  const handleCta = () => {
    if (slide.link) {
      const cleanSlug = slide.link.replace('/shop?category=', '').replace('/shop', '');
      setActiveCategoryFilter(cleanSlug || 'all');
    } else {
      setActiveCategoryFilter('all');
    }
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] overflow-hidden bg-[#292626] flex items-center"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic Background Image with Depth Scaling & Parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: `scale(1.08) translate3d(${mouseOffset.x * -20}px, ${mouseOffset.y * -20}px, 0)`
        }}
      >
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover object-center animate-in fade-in duration-1000"
        />
        {/* Luxury multi-layer editorial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35 rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#292626]/40 to-black/80" />
        <div className="absolute inset-0 bg-[#B77D83]/15 mix-blend-multiply" />
      </div>

      {/* Floating Ambient Glow Orbs */}
      <div 
        className="absolute top-1/4 start-1/3 w-96 h-96 rounded-full bg-[#C5A477]/15 blur-3xl pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 40}px, ${mouseOffset.y * 40}px, 0)`
        }}
      />
      <div 
        className="absolute bottom-1/4 end-1/4 w-80 h-80 rounded-full bg-[#B77D83]/20 blur-3xl pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * -35}px, ${mouseOffset.y * -35}px, 0)`
        }}
      />

      {/* Hero Main Content Container */}
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & Interactive CTA (7 cols) */}
          <div 
            className="lg:col-span-7 text-white space-y-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 12}px, 0)`
            }}
          >
            {/* Luxury Badge with Pulsing Gold Dot */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-[#C5A477]/50 text-[#C5A477] text-xs font-bold tracking-widest uppercase shadow-lg shadow-black/30">
              <span className="w-2 h-2 rounded-full bg-[#C5A477] animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-[#C5A477]" />
              <span>K&amp;H BOUTIQUE EXCLUSIVE • تونس</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white font-serif drop-shadow-md">
              {language === 'ar' ? slide.titleAr : (language === 'fr' ? (slide.titleFr || slide.title) : slide.title)}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-[#F5E7E5]/90 font-light leading-relaxed max-w-xl">
              {language === 'ar' ? slide.subtitleAr : (language === 'fr' ? (slide.subtitleFr || slide.subtitle) : slide.subtitle)}
            </p>

            {/* Action Buttons with Glowing Holographic Border */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleCta}
                className="relative group overflow-hidden bg-gradient-to-r from-[#B77D83] to-[#995c63] hover:from-[#a66a71] hover:to-[#8a5057] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-[#B77D83]/25 hover:shadow-2xl hover:shadow-[#B77D83]/40 transition-all duration-300 flex items-center gap-3"
              >
                <span className="relative z-10">
                  {language === 'ar' ? 'تسوقي التشكيلة الآن' : (language === 'fr' ? 'Découvrir la collection' : 'Shop Collection')}
                </span>
                <ArrowRight className="w-4 h-4 relative z-10 rtl:rotate-180 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 transition-transform duration-300" />
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveCategoryFilter('seasonal-collections');
                  const catalogEl = document.getElementById('catalog-section');
                  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-[#FFF9F5] font-semibold text-sm transition-all duration-300 hover:border-[#C5A477]/60"
              >
                {language === 'ar' ? 'العروض الموسمية ✦' : (language === 'fr' ? 'Offres de saison ✦' : 'Seasonal Deals ✦')}
              </button>
            </div>

            {/* Micro Feature Highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#FFF9F5]/80 font-medium">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C5A477]" />
                <span>{language === 'ar' ? 'توصيل 24-48 ساعة كامل تونس' : 'Livraison express 24-48h'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A477]" />
                <span>{language === 'ar' ? 'الدفع نقداً عند الاستلام' : 'Paiement à la livraison'}</span>
              </div>
            </div>

          </div>

          {/* Right 3D Floating Showcase Card (5 cols - hidden on small mobile) */}
          {featuredProduct && (
            <div 
              className="hidden lg:block lg:col-span-5 transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `perspective(1000px) rotateY(${mouseOffset.x * -14}deg) rotateX(${mouseOffset.y * 14}deg) translate3d(${mouseOffset.x * -16}px, ${mouseOffset.y * -16}px, 30px)`
              }}
            >
              <div 
                onClick={() => setQuickViewProduct(featuredProduct)}
                className="group relative cursor-pointer rounded-3xl p-4 bg-white/10 backdrop-blur-2xl border border-white/20 hover:border-[#C5A477]/80 shadow-2xl shadow-black/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* Iridescent glass shine on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-[#C5A477]/10 pointer-events-none" />

                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#1E1C1C]">
                  <img
                    src={featuredProduct.images[0]}
                    alt={featuredProduct.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Badges inside card */}
                  <div className="absolute top-3 start-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#B77D83] text-white shadow-md">
                      {language === 'ar' ? 'مختارات الموسم' : 'Coup de Cœur'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 start-3 end-3 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold truncate max-w-[170px]">
                        {language === 'ar' ? featuredProduct.titleAr : featuredProduct.title}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-[#C5A477]">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{featuredProduct.rating || 5.0}</span>
                      </div>
                    </div>

                    <div className="text-end">
                      <span className="text-xs text-white/70 block">
                        {language === 'ar' ? 'السعر' : 'Prix'}
                      </span>
                      <span className="text-sm font-bold text-[#C5A477]">
                        {(featuredProduct.salePrice || featuredProduct.price).toFixed(2)} د.ت
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 px-1 flex items-center justify-between text-xs text-[#FFF9F5]/70">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C5A477]" />
                    {language === 'ar' ? 'انقري للمعاينة السريعة' : 'Aperçu rapide'}
                  </span>
                  <span className="font-semibold text-[#C5A477] group-hover:underline">
                    {language === 'ar' ? 'عرض التفاصيل ←' : 'Détails →'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Slider Indicator Controls */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 start-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <button
            type="button"
            onClick={() => setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length)}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>

          <div className="flex items-center gap-1.5">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  idx === currentSlide ? 'w-6 bg-[#C5A477]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentSlide(prev => (prev + 1) % activeBanners.length)}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      )}
    </section>
  );
};

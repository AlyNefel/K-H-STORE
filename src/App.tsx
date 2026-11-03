/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { CategoryShowcase } from './components/CategoryShowcase.tsx';
import { StoreCatalog } from './components/StoreCatalog.tsx';
import { InteractiveAura } from './components/InteractiveAura.tsx';
import { WhatsAppBulb } from './components/WhatsAppBulb.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderSuccessModal } from './components/OrderSuccessModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CustomerAccountModal } from './components/CustomerAccountModal.tsx';
import { InfoModal } from './components/InfoModal.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { 
  Sparkles, ShieldCheck, Star, Truck, RefreshCw 
} from 'lucide-react';

function StorefrontContent() {
  const { 
    language, 
    quickViewProduct,
    setQuickViewProduct,
    setActiveCategoryFilter
  } = useStore();

  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
  });

  useEffect(() => {
    const handleHash = () => {
      setIsAdminView(window.location.hash === '#admin' || window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (isAdminView) {
    return (
      <AdminDashboard 
        onBackToShop={() => {
          setIsAdminView(false);
          window.location.hash = '';
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Interactive Micro-particles & Mouse Aura Glow */}
      <InteractiveAura />

      {/* 1. Main Header */}
      <Header 
        onNavigateToAdmin={() => {
          setIsAdminView(true);
          window.location.hash = 'admin';
        }} 
        isAdminView={false}
      />

      {/* 2. Hero Carousel with 3D Parallax & Depth */}
      <HeroBanner />

      {/* 3. Reassurance Value Strip */}
      <section className="bg-white border-y border-[#F5E7E5] py-4 relative z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="flex items-center justify-center gap-2 p-2">
              <Truck className="w-4 h-4 text-[#C5A477] shrink-0" />
              <div className="text-start">
                <p className="text-xs font-bold text-[#292626]">
                  {language === 'ar' ? 'توصيل كامل تونس' : 'Livraison Toute Tunisie'}
                </p>
                <p className="text-[10px] text-[#8A7E7C]">
                  {language === 'ar' ? '24 - 48 ساعة حتى باب بيتكِ' : 'Sous 24h à 48h express'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A477] shrink-0" />
              <div className="text-start">
                <p className="text-xs font-bold text-[#292626]">
                  {language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}
                </p>
                <p className="text-[10px] text-[#8A7E7C]">
                  {language === 'ar' ? 'افحصي الطرد وادفعي نقداً' : 'Vérifiez et payez en espèces'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-2">
              <Sparkles className="w-4 h-4 text-[#C5A477] shrink-0" />
              <div className="text-start">
                <p className="text-xs font-bold text-[#292626]">
                  {language === 'ar' ? 'جودة فاخرة مضمونة' : 'Qualité Premium'}
                </p>
                <p className="text-[10px] text-[#8A7E7C]">
                  {language === 'ar' ? 'منتجات أصلية مختارة بعناية' : 'Articles exclusifs sélectionnés'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-2">
              <RefreshCw className="w-4 h-4 text-[#C5A477] shrink-0" />
              <div className="text-start">
                <p className="text-xs font-bold text-[#292626]">
                  {language === 'ar' ? 'إمكانية الاستبدال' : 'Échange garanti'}
                </p>
                <p className="text-[10px] text-[#8A7E7C]">
                  {language === 'ar' ? 'خدمة عملاء طيلة الأسبوع' : 'Service client 7j/7'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Category Showcase Section */}
      <CategoryShowcase />

      {/* 5. Complete Store Catalog with Rich Filter Sidebar */}
      <div id="catalog-section">
        <StoreCatalog />
      </div>

      {/* 6. Promotional Editorial Banner */}
      <section className="py-16 bg-[#F5E7E5] border-t border-[#EADCD8] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl border border-[#EADCD8] group">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&q=80"
                alt="Home living"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="space-y-4 text-[#292626]">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#B77D83]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>K&amp;H HOME LIVING</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#292626]">
                {language === 'ar' ? 'أضيفي لمسة من الفخامة والسكينة إلى تفاصيل بيتكِ' : 'L\'art de vivre raffiné pour votre intérieur'}
              </h3>
              <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
                {language === 'ar'
                  ? 'من أطقم الشاي والقهوة البورسلان المذهبة إلى المباخر والصواني الرخامية العصرية، نختار لكِ كل قطعة لتعكس الذوق الرفيع وحسن الضيافة التونسية الأصيلة.'
                  : 'Des services de table prestigieux aux bougies parfumées artisanales, découvrez des pièces uniques pensées pour sublimer votre quotidien.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategoryFilter('kitchen-tableware');
                    const el = document.getElementById('catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-[#292626] hover:bg-black text-[#FFF9F5] rounded-xl font-bold text-xs shadow-md transition-all hover:shadow-lg"
                >
                  {language === 'ar' ? 'اكتشفي تشكيلة المنزل والمائدة' : 'Découvrir la collection Maison'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Verified Customer Testimonials */}
      <section className="py-16 bg-[#FFF9F5] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B77D83] block mb-1">
              {language === 'ar' ? 'ثقة العميلات' : 'Témoignages'}
            </span>
            <h3 className="text-2xl font-bold font-serif text-[#292626]">
              {language === 'ar' ? 'ماذا تقول عميلاتنا في تونس؟' : 'Ce que nos clientes disent de nous'}
            </h3>
            <div className="w-12 h-0.5 bg-[#C5A477] mx-auto mt-2 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-white rounded-2xl border border-[#F5E7E5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center text-[#C5A477] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#555] leading-relaxed mb-4">
                  "وصلتني طلبيتي في المرسى خلال 24 ساعة فقط! الفستان في الحقيقة أجمل بكثير من الصور، والخامة راقية ومريحة جداً. شكراً K&H على المصداقية."
                </p>
              </div>
              <div className="flex items-center gap-2 border-t border-[#F5E7E5] pt-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-[#F5E7E5] text-[#B77D83] font-bold flex items-center justify-center">
                  أ
                </div>
                <div>
                  <p className="font-bold text-[#292626]">أميرة ب.</p>
                  <p className="text-[10px] text-gray-400">تونس العاصمة • Marsa</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#F5E7E5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center text-[#C5A477] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#555] leading-relaxed mb-4">
                  "Service impeccable ! J'ai commandé le coffret thé en porcelaine pour offrir. Emballage très soigné et livraison rapide à Sousse avec paiement à la livraison."
                </p>
              </div>
              <div className="flex items-center gap-2 border-t border-[#F5E7E5] pt-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-[#F5E7E5] text-[#B77D83] font-bold flex items-center justify-center">
                  S
                </div>
                <div>
                  <p className="font-bold text-[#292626]">Syrine M.</p>
                  <p className="text-[10px] text-gray-400">سوسة • Sousse</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#F5E7E5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center text-[#C5A477] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#555] leading-relaxed mb-4">
                  "عطر العود الملكي رائع وثباته مذهل طوال اليوم. الصينية الرخامية أيضاً أضافت لمسة فخامة على طاولة الصالون. سعيدة جداً بتجربتي الأولى."
                </p>
              </div>
              <div className="flex items-center gap-2 border-t border-[#F5E7E5] pt-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-[#F5E7E5] text-[#B77D83] font-bold flex items-center justify-center">
                  ن
                </div>
                <div>
                  <p className="font-bold text-[#292626]">نادية خ.</p>
                  <p className="text-[10px] text-gray-400">صفاقس • Sfax</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. Comprehensive Luxury Footer */}
      <Footer />

      {/* 9. Interactive WhatsApp Concierge Bulb */}
      <WhatsAppBulb />

      {/* 10. Interactive Modals & Drawers */}
      <ProductDetailModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <AuthModal />
      <CustomerAccountModal />
      <InfoModal />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}

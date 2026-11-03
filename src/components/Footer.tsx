import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Instagram, Facebook, Send, ShieldCheck, Truck, RefreshCw, Check 
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { BrandLogo } from './BrandLogo.tsx';

export const Footer: React.FC = () => {
  const { language, t, categories, setActiveCategoryFilter, setInfoModal } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#292626] text-white pt-16 pb-12 border-t border-[#C5A477]/30">
      
      {/* 1. Value Proposition Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-start">
          
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#B77D83]/20 flex items-center justify-center text-[#C5A477] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FFF9F5]">{language === 'ar' ? 'توصيل كامل ولايات تونس' : 'Livraison Toute Tunisie'}</h4>
              <p className="text-xs text-[#F5E7E5]/70 mt-0.5">{language === 'ar' ? 'خلال 24 إلى 48 ساعة فقط' : 'Délai rapide 24h à 48h'}</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#B77D83]/20 flex items-center justify-center text-[#C5A477] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FFF9F5]">{language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la Livraison'}</h4>
              <p className="text-xs text-[#F5E7E5]/70 mt-0.5">{language === 'ar' ? 'افحصي طلبيتكِ وادفعي نقداً' : 'Vérifiez et payez en espèces'}</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#B77D83]/20 flex items-center justify-center text-[#C5A477] shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FFF9F5]">{language === 'ar' ? 'ضمان الجودة والاستبدال' : 'Garantie & Échange'}</h4>
              <p className="text-xs text-[#F5E7E5]/70 mt-0.5">{language === 'ar' ? 'خدمة زبائن متميزة وسريعة' : 'Service client réactif à votre écoute'}</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="md" showSlogan={true} />
            <p className="text-xs text-[#F5E7E5]/80 leading-relaxed max-w-sm mt-3">
              {t('boutiqueBio')}
            </p>
            
            <div className="space-y-2 text-xs text-[#F5E7E5]/90 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A477] shrink-0" />
                <span>{t('contactAddress')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A477] shrink-0" />
                <span>{t('contactPhone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A477] shrink-0" />
                <span>ali.nefel2020@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A477] mb-4">
              {t('categories')}
            </h4>
            <ul className="space-y-2 text-xs text-[#F5E7E5]/70">
              {categories.map((cat) => (
                <li key={cat.slug || cat._id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategoryFilter(cat.slug);
                      const el = document.getElementById('catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white hover:underline transition-colors text-start"
                  >
                    {language === 'ar' ? cat.nameAr : cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A477] mb-4">
              {t('customerService')}
            </h4>
            <ul className="space-y-2 text-xs text-[#F5E7E5]/70">
              <li>
                <button 
                  type="button" 
                  onClick={() => setInfoModal('about')}
                  className="hover:text-white transition-colors"
                >
                  {t('aboutUs')}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setInfoModal('shipping')}
                  className="hover:text-white transition-colors"
                >
                  {t('shippingPolicy')}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setInfoModal('faq')}
                  className="hover:text-white transition-colors"
                >
                  {t('faq')}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setInfoModal('contact')}
                  className="hover:text-white transition-colors"
                >
                  {t('contactUs')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A477] mb-4">
              {t('newsletterTitle')}
            </h4>
            <p className="text-xs text-[#F5E7E5]/70 mb-3 leading-relaxed">
              {t('newsletterDesc')}
            </p>

            <form onSubmit={handleNewsletter} className="space-y-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-white/50 outline-none focus:border-[#C5A477]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#B77D83] hover:bg-[#a66a71] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تم الاشتراك بنجاح!' : 'Inscrit !'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                    <span>{t('subscribe')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* 3. Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F5E7E5]/60 gap-4">
        <p>© {new Date().getFullYear()} {t('brandName')}. {t('allRightsReserved')}.</p>
        <p className="flex items-center gap-2">
          <span>{language === 'ar' ? 'متجر إلكتروني تونسي معتمد' : 'Boutique en ligne tunisienne certifiée'}</span>
          <span>•</span>
          <span className="text-[#C5A477]">كل ما يهم المرأة و المنزل</span>
        </p>
      </div>

    </footer>
  );
};

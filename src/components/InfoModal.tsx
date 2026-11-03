import React, { useState } from 'react';
import { X, HelpCircle, Info, Truck, MessageSquare, Send, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { BrandLogo } from './BrandLogo.tsx';

export const InfoModal: React.FC = () => {
  const { infoModal, setInfoModal, language, t } = useStore();
  const [contactSent, setContactSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setInfoModal(null);
    }, 2500);
  };

  if (!infoModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#F5E7E5] overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#FFF9F5] border-b border-[#F5E7E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {infoModal === 'about' && <Info className="w-5 h-5 text-[#B77D83]" />}
            {infoModal === 'faq' && <HelpCircle className="w-5 h-5 text-[#B77D83]" />}
            {infoModal === 'shipping' && <Truck className="w-5 h-5 text-[#B77D83]" />}
            {infoModal === 'contact' && <MessageSquare className="w-5 h-5 text-[#B77D83]" />}
            <h3 className="font-bold text-base text-[#292626] font-serif">
              {infoModal === 'about' && t('aboutUs')}
              {infoModal === 'faq' && t('faq')}
              {infoModal === 'shipping' && t('shippingPolicy')}
              {infoModal === 'contact' && t('contactUs')}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setInfoModal(null)}
            className="p-1.5 rounded-full hover:bg-[#F5E7E5] text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 sm:p-8 text-xs text-[#555] leading-relaxed space-y-4">
          
          {infoModal === 'about' && (
            <div className="space-y-4">
              <div className="flex justify-center mb-2">
                <BrandLogo variant="dark" size="sm" showSlogan={true} />
              </div>
              <h4 className="text-base font-bold text-[#292626]">
                {language === 'ar' ? 'قصة متجر K&H ورؤيتنا' : 'Notre Histoire & Vision'}
              </h4>
              <p>
                {language === 'ar' 
                  ? 'انطلق متجر K&H برؤية واضحة: تقديم تجربة تسوق استثنائية للمرأة التونسية العصرية تجمع بين الرقي والراحة وجودة المنتجات المختارة بعناية فائقة. شعارنا "كل ما يهم المرأة و المنزل" يعكس التزامنا بأن نكون وجهتكِ الشاملة لأرقى الأزياء، الحقائب الجلدية، العطور الخلابة، وأفخر مستلزمات وديكور المنزل.'
                  : 'K&H est née d\'une volonté : offrir une expérience d\'achat haut de gamme alliant élégance, modernité et confort. Notre devise "Tout ce qui importe pour la femme et la maison" guide notre sélection exclusive de vêtements, maroquinerie, parfums et objets d\'art de la table.'}
              </p>
              <div className="p-4 bg-[#FFF9F5] rounded-xl border border-[#F5E7E5]">
                <h5 className="font-bold text-[#292626] mb-1">{language === 'ar' ? 'قيمنا الأساسية:' : 'Nos valeurs fondamentales :'}</h5>
                <ul className="list-disc list-inside space-y-1">
                  <li>{language === 'ar' ? 'الأصالة والجودة الرفيعة في كل تفصيل' : 'Authenticité et raffinement sans compromis'}</li>
                  <li>{language === 'ar' ? 'شفافية تامة والدفع الآمن عند الاستلام' : 'Transparence totale et paiement sécurisé à la livraison'}</li>
                  <li>{language === 'ar' ? 'خدمة زبائن شخصية وسريعة في كامل تونس' : 'Service client réactif partout en Tunisie'}</li>
                </ul>
              </div>
            </div>
          )}

          {infoModal === 'faq' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#FFF9F5] rounded-xl border border-[#F5E7E5]">
                <h5 className="font-bold text-[#292626] mb-1">
                  {language === 'ar' ? '1. ما هي طرق الدفع المتوفرة؟' : '1. Quels sont les modes de paiement ?'}
                </h5>
                <p>
                  {language === 'ar' 
                    ? 'نوفر الدفع نقداً عند الاستلام (COD) مع إمكانية فتح ومعاينة الطرد عند وصول المندوب قبل الدفع.'
                    : 'Nous proposons le paiement en espèces à la livraison (COD) avec possibilité d\'inspecter le colis avant le paiement.'}
                </p>
              </div>

              <div className="p-3 bg-[#FFF9F5] rounded-xl border border-[#F5E7E5]">
                <h5 className="font-bold text-[#292626] mb-1">
                  {language === 'ar' ? '2. ما هي مدة وتكلفة التوصيل في تونس؟' : '2. Quels sont les délais et frais de livraison ?'}
                </h5>
                <p>
                  {language === 'ar' 
                    ? 'التوصيل يتم خلال 24 - 48 ساعة لكامل ولايات تونس بسعر ثابت 7 د.ت، ومجاناً تماماً لأي طلبية تفوق 150 د.ت.'
                    : 'Livraison en 24h à 48h partout en Tunisie pour 7 DT, et gratuite dès 150 DT de commande.'}
                </p>
              </div>

              <div className="p-3 bg-[#FFF9F5] rounded-xl border border-[#F5E7E5]">
                <h5 className="font-bold text-[#292626] mb-1">
                  {language === 'ar' ? '3. هل يمكنني استبدال المقاس أو المنتج؟' : '3. Puis-je échanger un article ?'}
                </h5>
                <p>
                  {language === 'ar' 
                    ? 'نعم، بإمكانكِ طلب استبدال المقاس أو المنتج خلال 7 أيام من تاريخ الاستلام بشرط بقاء المنتج في حالته وتغليفه الأصلي.'
                    : 'Oui, l\'échange est garanti sous 7 jours après réception si l\'article est dans son état d\'origine.'}
                </p>
              </div>
            </div>
          )}

          {infoModal === 'shipping' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#292626]">{language === 'ar' ? 'سياسة الشحن والتسليم في تونس' : 'Politique de Livraison en Tunisie'}</h4>
              <p>{language === 'ar' ? 'تغطي خدمات التوصيل لدينا كافة ولايات الجمهورية التونسية الأربع والعشرين (تونس الكبرى، الساحل، الشمال، الوسط والجنوب التونسي).' : 'Nos services de livraison couvrent l\'ensemble des 24 gouvernorats tunisiens.'}</p>
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-xs">
                ✓ {language === 'ar' ? 'توصيل مجاني للطلبات أكثر من 150 د.ت' : 'Livraison gratuite à partir de 150 DT'}
              </div>
              <div className="p-3 bg-[#FFF9F5] rounded-lg border border-[#F5E7E5] text-xs">
                ✓ {language === 'ar' ? 'تكلفة التوصيل القياسي: 7 د.ت' : 'Frais de livraison standard : 7 DT'}
              </div>
            </div>
          )}

          {infoModal === 'contact' && (
            <div>
              {contactSent ? (
                <div className="p-6 bg-emerald-50 text-emerald-800 rounded-xl text-center space-y-2">
                  <Check className="w-8 h-8 mx-auto text-emerald-600" />
                  <p className="font-bold">{language === 'ar' ? 'شكراً لتواصلكِ معنا! سنرد على رسالتكِ في أقرب وقت.' : 'Merci pour votre message ! Notre équipe vous répondra rapidement.'}</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#292626] mb-1">{t('fullName')}</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#B77D83]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#292626] mb-1">{t('email')}</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#B77D83]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#292626] mb-1">{language === 'ar' ? 'رسالتكِ' : 'Votre message'}</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#B77D83]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#B77D83] hover:bg-[#a66a71] text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                    <span>{language === 'ar' ? 'إرسال الرسالة' : 'Envoyer'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

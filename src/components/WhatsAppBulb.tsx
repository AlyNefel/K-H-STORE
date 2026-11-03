import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const WhatsAppBulb: React.FC = () => {
  const { language } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phone = '21655123456'; // Official K&H store WhatsApp line in Tunisia

  const promptMap: Record<'ar' | 'fr' | 'en', string[]> = {
    ar: [
      'مرحباً متجر K&H، أود الاستفسار عن توفر منتج ومقاسه.',
      'كم يستغرق التوصيل لولايتي مع الدفع عند الاستلام؟',
      'أرغب في المساعدة لاختيار هدية فاخرة.',
      'هل يمكنني تأكيد طلبي مباشرة عبر واتساب؟'
    ],
    fr: [
      'Bonjour K&H, je souhaite me renseigner sur la disponibilité d\'un article.',
      'Quels sont les délais de livraison pour ma région en Tunisie ?',
      'J\'ai besoin d\'aide pour choisir un cadeau raffiné.',
      'Puis-je passer ma commande directement sur WhatsApp ?'
    ],
    en: [
      'Hello K&H, I would like to inquire about product sizing and availability.',
      'What are the delivery times for my governorate in Tunisia?',
      'I need assistance choosing an exclusive boutique gift.',
      'Can I place an order directly via WhatsApp?'
    ]
  };

  const activeLangKey = (language === 'ar' || language === 'fr' || language === 'en') ? language : 'ar';
  const quickMessages = promptMap[activeLangKey] || promptMap.ar;

  const handleSend = (msgText: string) => {
    const textToSend = msgText || customMsg || (language === 'ar' ? 'مرحباً متجر K&H، أود الاستفسار عن مشترياتي' : 'Bonjour K&H');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 start-6 z-50 flex flex-col items-start select-none font-sans">
      
      {/* Floating Popup Card */}
      {isOpen && (
        <div 
          className="mb-4 w-[330px] sm:w-[360px] rounded-2xl bg-white/95 backdrop-blur-xl border border-[#C5A477]/40 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="bg-[#292626] text-white p-4 flex items-center justify-between border-b border-[#C5A477]/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <span className="absolute bottom-0 end-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-[#292626] animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#FFF9F5] flex items-center gap-1.5 font-serif">
                  <span>K&amp;H Boutique Concierge</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A477]" />
                </h4>
                <p className="text-[11px] text-[#C5A477] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>{language === 'ar' ? 'متواجدون لخدمتكِ الآن' : 'En ligne • Réponse rapide'}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#FFF9F5]/90 space-y-3 max-h-[340px] overflow-y-auto text-xs">
            
            {/* Assistant Welcome Bubble */}
            <div className="bg-white p-3 rounded-2xl rounded-ss-xs border border-[#F5E7E5] shadow-xs text-[#292626] leading-relaxed">
              <p className="font-semibold text-[#B77D83] mb-1">
                {language === 'ar' ? 'أهلاً بكِ في خدمة كونسيرج K&H 🌹' : 'Bienvenue chez K&H Concierge 🌹'}
              </p>
              <p className="text-gray-600 text-[11px]">
                {language === 'ar' 
                  ? 'يسعدنا الرد على استفساراتكِ ومساعدتكِ في تفاصيل المقاسات، الشحن السريع في تونس، أو تأكيد طلبيتكِ.'
                  : 'Comment pouvons-nous vous aider aujourd\'hui pour votre commande ou vos questions ?'}
              </p>
              <span className="text-[9px] text-gray-400 block text-end mt-1 flex items-center justify-end gap-1">
                <span>{language === 'ar' ? 'الآن' : 'Maintenant'}</span>
                <CheckCheck className="w-3 h-3 text-emerald-600" />
              </span>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold text-[#8A7E7C] uppercase tracking-wider">
                {language === 'ar' ? 'أسئلة شائعة بنقرة واحدة:' : 'Questions fréquentes :'}
              </p>
              {quickMessages.map((msg: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(msg)}
                  className="w-full text-start p-2 rounded-xl bg-white hover:bg-[#F5E7E5] border border-[#EADCD8] hover:border-[#B77D83] text-[#292626] text-[11px] font-medium transition-all duration-200 flex items-center justify-between group shadow-2xs"
                >
                  <span className="line-clamp-1">{msg}</span>
                  <Send className="w-3 h-3 text-[#B77D83] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 rtl:rotate-180" />
                </button>
              ))}
            </div>

          </div>

          {/* Input & Send */}
          <div className="p-3 bg-white border-t border-[#F5E7E5] flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(customMsg); }}
              placeholder={language === 'ar' ? 'اكتبي رسالتكِ هنا...' : 'Écrivez votre message...'}
              className="flex-1 bg-[#FFF9F5] border border-[#EADCD8] rounded-xl px-3 py-2 text-xs text-[#292626] outline-none focus:border-[#25D366] transition-all"
            />
            <button
              type="button"
              onClick={() => handleSend(customMsg)}
              className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              aria-label="Send WhatsApp"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Main WhatsApp Trigger Bulb Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/40"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulsing Ripple Rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
        <span className="absolute -inset-2 rounded-full bg-[#25D366]/20 animate-pulse pointer-events-none" />

        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 fill-current transition-transform group-hover:rotate-12" />
        </div>

        <span className="text-xs font-bold tracking-wide hidden sm:inline whitespace-nowrap drop-shadow-xs">
          {language === 'ar' ? 'تحدثي معنا عبر واتساب' : 'WhatsApp K&H'}
        </span>

        {/* Status Dot */}
        <span className="w-2.5 h-2.5 rounded-full bg-white ring-2 ring-emerald-300 animate-pulse" />
      </button>

    </div>
  );
};

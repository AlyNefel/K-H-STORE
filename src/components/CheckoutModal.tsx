import React, { useState } from 'react';
import { 
  X, ShieldCheck, Truck, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext.tsx';
import { tunisianGovernorates } from '../i18n/translations.ts';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    subtotal, 
    deliveryFee, 
    discount, 
    appliedCoupon, 
    total, 
    formatPrice, 
    language, 
    t, 
    clearCart,
    setCompletedOrder,
    user
  } = useStore();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [governorate, setGovernorate] = useState('Tunis');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !governorate || !city.trim() || !address.trim()) {
      setErrorMsg(language === 'ar' ? 'الرجاء ملء كافة بيانات التوصيل الإلزامية' : 'Veuillez remplir tous les champs de livraison obligatoires');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg(language === 'ar' ? 'سلة التسوق فارغة' : 'Votre panier est vide');
      return;
    }

    if (paymentMethod === 'online') {
      setErrorMsg(
        language === 'ar' 
          ? 'بوابة الدفع الإلكتروني بالبطاقة البنكية قيد التهيئة حالياً. يرجى اختيار الدفع عند الاستلام (COD).' 
          : 'Le paiement en ligne par carte est en cours de configuration. Veuillez choisir le paiement à la livraison.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerDetails: {
          fullName,
          email,
          phone,
          governorate,
          city,
          address,
          notes
        },
        items: cart.map(item => ({
          productId: item.id,
          title: item.title,
          titleAr: item.titleAr,
          price: item.salePrice || item.price,
          quantity: item.quantity,
          image: item.image,
          variant: item.variant
        })),
        subtotal,
        deliveryFee,
        discount,
        couponCode: appliedCoupon?.code || '',
        total,
        paymentMethod: 'cod'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Success confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // non-blocking
      }

      clearCart();
      setIsCheckoutOpen(false);
      setCompletedOrder(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-3xl bg-[#FFF9F5] rounded-2xl shadow-2xl border border-[#F5E7E5] overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#F5E7E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#B77D83]" />
            <h2 className="font-bold text-lg text-[#292626] font-serif">
              {language === 'ar' ? 'إتمام الطلب والشحن' : 'Finaliser la Commande'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#F5E7E5] text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1">
          
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer & Address Fields */}
          <div>
            <h3 className="text-sm font-bold text-[#292626] uppercase tracking-wider mb-3">
              {t('deliveryDetails')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-semibold text-[#292626] mb-1">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: مريم التونسي / Mariem Trabelsi"
                  className="w-full bg-white border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83] focus:ring-1 focus:ring-[#B77D83]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292626] mb-1">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mariem@example.com"
                  className="w-full bg-white border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83] focus:ring-1 focus:ring-[#B77D83]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292626] mb-1">
                  {t('phoneNumber')} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+216 55 123 456"
                  className="w-full bg-white border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83] focus:ring-1 focus:ring-[#B77D83]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292626] mb-1">
                  {t('governorate')} *
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full bg-white border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83]"
                >
                  {tunisianGovernorates.map((g) => (
                    <option key={g.id} value={g.id}>
                      {language === 'ar' ? g.ar : g.fr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292626] mb-1">
                  {t('city')} *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: La Marsa, Ennasr, Sousse Ville..."
                  className="w-full bg-white border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83] focus:ring-1 focus:ring-[#B77D83]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292626] mb-1">
                  {language === 'ar' ? 'البلد' : 'Pays'}
                </label>
                <input
                  type="text"
                  disabled
                  value={language === 'ar' ? 'تونس (Tunisie)' : 'Tunisie'}
                  className="w-full bg-gray-100 border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#292626] mb-1">
                  {t('address')} *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: 14 Rue Habib Bourguiba, Résidence Les Fleurs, Appt 3B"
                  className="w-full bg-white border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#292626] mb-1">
                  {t('deliveryNotes')}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: الاتصال قبل الوصول بنصف ساعة..."
                  className="w-full bg-white border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83]"
                />
              </div>

            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <h3 className="text-sm font-bold text-[#292626] uppercase tracking-wider mb-3">
              {t('paymentMethod')}
            </h3>

            <div className="space-y-3">
              
              {/* Option 1: Cash on Delivery (Active) */}
              <label 
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod' 
                    ? 'bg-white border-[#B77D83] ring-2 ring-[#B77D83]/20 shadow-xs' 
                    : 'bg-white border-[#EADCD8]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-[#B77D83] focus:ring-[#B77D83]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#292626]">
                      {t('cashOnDelivery')}
                    </span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
                      {language === 'ar' ? 'موصى به في تونس' : 'Recommandé'}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A7E7C] mt-1 leading-relaxed">
                    {t('cashOnDeliveryDesc')}
                  </p>
                </div>
              </label>

              {/* Option 2: Online Payment (Ready for integration) */}
              <label 
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer opacity-70 transition-all ${
                  paymentMethod === 'online' ? 'border-[#B77D83] bg-white' : 'bg-gray-50 border-[#EADCD8]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="mt-1 text-[#B77D83] focus:ring-[#B77D83]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-700">
                      {language === 'ar' ? 'الدفع الإلكتروني بالبطاقة البنكية (Carte Bancaire / ClicToPay)' : 'Paiement en ligne par Carte Bancaire'}
                    </span>
                    <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      {language === 'ar' ? 'قريباً' : 'Bientôt disponible'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'ar' ? 'سيتوفر قريباً عبر الشبكة النقدية التونسية ClicToPay.' : 'Bientôt disponible pour les cartes bancaires nationales et internationales.'}
                  </p>
                </div>
              </label>

            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="bg-white p-4 rounded-xl border border-[#F5E7E5] space-y-2">
            <h4 className="text-xs font-bold text-[#8A7E7C] uppercase tracking-wider mb-2">
              {language === 'ar' ? 'ملخص الطلب' : 'Récapitulatif de commande'}
            </h4>
            
            <div className="divide-y divide-[#F5E7E5] text-xs">
              {cart.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <span className="text-[#292626]">
                    {item.quantity}x {language === 'ar' ? item.titleAr : item.title}
                  </span>
                  <span className="font-bold text-[#292626]">
                    {formatPrice((item.salePrice || item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#F5E7E5] pt-3 space-y-1.5 text-xs text-[#555]">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-[#292626]">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#B77D83]">
                  <span>{t('discount')}</span>
                  <span className="font-bold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('deliveryFee')}</span>
                <span className="font-semibold text-[#292626]">
                  {deliveryFee === 0 ? t('freeDelivery') : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#292626] border-t border-[#F5E7E5] pt-2">
                <span>{t('total')}</span>
                <span className="text-[#B77D83]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#B77D83] hover:bg-[#a66a71] text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>{t('orderProcessing')}</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{t('confirmOrder')} ({formatPrice(total)})</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

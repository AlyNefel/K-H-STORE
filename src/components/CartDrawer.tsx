import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    deliveryFee, 
    discount, 
    appliedCoupon, 
    total, 
    applyCoupon, 
    removeCoupon, 
    formatPrice, 
    language, 
    t,
    setIsCheckoutOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponFeedback(null);

    const res = await applyCoupon(couponInput.trim());
    setCouponLoading(false);

    if (res.success) {
      setCouponFeedback({ type: 'success', msg: t('couponApplied') });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', msg: res.message });
    }
  };

  const freeDeliveryThreshold = 150;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 end-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#FFF9F5] shadow-2xl border-s border-[#F5E7E5] flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#F5E7E5] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B77D83]" />
              <h3 className="font-bold text-base text-[#292626]">{t('cart')} ({cart.length})</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#F5E7E5] text-gray-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FFF9F5] px-5 py-3 border-b border-[#F5E7E5]">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-[#292626]">
                {amountNeededForFree === 0 ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A477]" />
                    {language === 'ar' ? 'مبروك! حصلتِ على توصيل مجاني' : 'Félicitations ! Livraison gratuite offerte'}
                  </span>
                ) : (
                  <span>
                    {language === 'ar' 
                      ? `أضيفي ${amountNeededForFree.toFixed(2)} د.ت للحصول على توصيل مجاني`
                      : `Ajoutez ${amountNeededForFree.toFixed(2)} DT pour la livraison offerte`}
                  </span>
                )}
              </span>
              <span className="text-xs text-[#B77D83] font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#EADCD8] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#B77D83] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#F5E7E5]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-[#F5E7E5] flex items-center justify-center text-[#B77D83] mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-base text-[#292626] mb-1">{t('cartEmpty')}</h4>
                <p className="text-xs text-[#8A7E7C] max-w-xs mb-6">{t('cartEmptyDesc')}</p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#B77D83] text-white rounded-xl text-xs font-bold hover:bg-[#a66a71] transition-all shadow-sm"
                >
                  {t('continueShopping')}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => {
                const variantKey = item.variant?.sku || `${item.variant?.size || ''}-${item.variant?.color || ''}`;
                const itemTotal = (item.salePrice || item.price) * item.quantity;

                return (
                  <div key={`${item.id}-${variantKey}-${idx}`} className="py-4 flex gap-3">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-20 h-24 object-cover rounded-lg border border-[#F5E7E5] shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-xs text-[#292626] line-clamp-2">
                            {language === 'ar' ? item.titleAr : item.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, variantKey)}
                            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.variant && (item.variant.size || item.variant.color) && (
                          <p className="text-[11px] text-[#8A7E7C] mt-0.5">
                            {item.variant.size && `${t('size')} ${item.variant.size} `}
                            {item.variant.color && `• ${t('color')} ${item.variant.color}`}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#EADCD8] bg-white rounded-md">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, variantKey, -1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#292626] hover:bg-[#F5E7E5]"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-[#292626]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, variantKey, 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#292626] hover:bg-[#F5E7E5]"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[#292626]">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#F5E7E5] space-y-4">
              
              {/* Coupon Box */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <span>(-{formatPrice(discount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-500 font-bold hover:underline"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t('couponCode')}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 text-xs uppercase outline-none focus:border-[#B77D83]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-4 py-2 bg-[#292626] text-white rounded-lg text-xs font-semibold hover:bg-black transition-all"
                    >
                      {couponLoading ? '...' : t('applyCoupon')}
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p className={`text-[11px] mt-1.5 ${couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {couponFeedback.msg}
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-[#555] border-t border-[#F5E7E5] pt-3">
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
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">{t('freeDelivery')}</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#292626] border-t border-[#F5E7E5] pt-2">
                  <span>{t('total')}</span>
                  <span className="text-[#B77D83]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* COD Assurance */}
              <div className="p-2.5 bg-[#FFF9F5] rounded-lg border border-[#F5E7E5] flex items-center gap-2 text-[11px] text-[#292626]">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{language === 'ar' ? 'الدفع نقداً عند استلام ومعاينة الطلب في تونس' : 'Paiement en espèces à la livraison en Tunisie'}</span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 bg-[#B77D83] hover:bg-[#a66a71] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

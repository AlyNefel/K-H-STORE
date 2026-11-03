import React from 'react';
import { CheckCircle2, Printer, Home, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { BrandLogo } from './BrandLogo.tsx';

export const OrderSuccessModal: React.FC = () => {
  const { completedOrder, setCompletedOrder, formatPrice, language, t } = useStore();

  if (!completedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in zoom-in-95 duration-200">
      
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#F5E7E5] overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Printable Receipt Container */}
        <div id="printable-order-receipt" className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Header */}
          <div className="text-center pb-6 border-b border-[#F5E7E5]">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="flex justify-center mb-2">
              <BrandLogo variant="dark" size="sm" showSlogan={false} />
            </div>

            <h2 className="text-xl font-bold text-[#292626] font-serif mb-1">
              {t('orderSuccessTitle')}
            </h2>
            <p className="text-xs text-[#8A7E7C] max-w-md mx-auto">
              {t('orderSuccessDesc')}
            </p>

            <div className="mt-4 inline-block bg-[#FFF9F5] border border-[#F5E7E5] px-4 py-2 rounded-xl">
              <span className="text-xs text-[#8A7E7C] block">{t('orderNumber')}</span>
              <span className="font-mono text-base font-bold text-[#B77D83]">
                #{completedOrder.orderNumber}
              </span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FFF9F5] p-4 rounded-xl border border-[#F5E7E5] text-xs">
            <div>
              <p className="font-bold text-[#292626] mb-1">{language === 'ar' ? 'معلومات العميل:' : 'Client :'}</p>
              <p className="text-[#555]">{completedOrder.customerDetails?.fullName}</p>
              <p className="text-[#555]">{completedOrder.customerDetails?.phone}</p>
              <p className="text-[#555]">{completedOrder.customerDetails?.email}</p>
            </div>
            <div>
              <p className="font-bold text-[#292626] mb-1">{language === 'ar' ? 'عنوان التوصيل (تونس):' : 'Adresse de livraison :'}</p>
              <p className="text-[#555]">
                {completedOrder.customerDetails?.governorate}، {completedOrder.customerDetails?.city}
              </p>
              <p className="text-[#555]">{completedOrder.customerDetails?.address}</p>
              <p className="font-semibold text-emerald-700 mt-1">
                {language === 'ar' ? 'الدفع نقداً عند الاستلام' : 'Paiement à la livraison'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#292626] uppercase tracking-wider">
              {language === 'ar' ? 'المنتجات المطلوبة' : 'Articles commandés'}
            </h4>

            <div className="divide-y divide-[#F5E7E5] border border-[#F5E7E5] rounded-xl overflow-hidden">
              {completedOrder.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt="" 
                      className="w-10 h-12 object-cover rounded-md border border-[#F5E7E5]" 
                    />
                    <div>
                      <p className="font-bold text-[#292626]">{language === 'ar' ? item.titleAr : item.title}</p>
                      <p className="text-[11px] text-gray-500">
                        {item.quantity} x {formatPrice(item.price)}
                        {item.variant?.size ? ` • ${item.variant.size}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#292626]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              {/* Price Calculations */}
              <div className="p-3 bg-[#FFF9F5] space-y-1 text-xs">
                <div className="flex justify-between text-[#555]">
                  <span>{t('subtotal')}</span>
                  <span>{formatPrice(completedOrder.subtotal)}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#B77D83]">
                    <span>{t('discount')}</span>
                    <span>-{formatPrice(completedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#555]">
                  <span>{t('deliveryFee')}</span>
                  <span>{completedOrder.deliveryFee === 0 ? t('freeDelivery') : formatPrice(completedOrder.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#292626] pt-1 border-t border-[#F5E7E5]">
                  <span>{t('total')}</span>
                  <span className="text-[#B77D83]">{formatPrice(completedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F5E7E5]">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-[#FFF9F5] hover:bg-[#F5E7E5] border border-[#EADCD8] text-[#292626] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4 text-[#8A7E7C]" />
              <span>{t('printInvoice')}</span>
            </button>

            <button
              type="button"
              onClick={() => setCompletedOrder(null)}
              className="px-6 py-2.5 bg-[#B77D83] hover:bg-[#a66a71] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>{t('backToHome')}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

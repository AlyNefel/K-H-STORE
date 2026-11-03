import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle2, Truck, User, MapPin, Heart, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const CustomerAccountModal: React.FC = () => {
  const { isAccountOpen, setIsAccountOpen, user, formatPrice, language, t } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (isAccountOpen) {
      setLoadingOrders(true);
      fetch(`/api/orders${user?.email ? `?email=${encodeURIComponent(user.email)}` : ''}`)
        .then(res => res.json())
        .then(data => {
          setOrders(Array.isArray(data) ? data : []);
        })
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    }
  }, [isAccountOpen, user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-xs">{t('statusDelivered')}</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold text-xs">{t('statusShipped')}</span>;
      case 'processing':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold text-xs">{t('statusProcessing')}</span>;
      case 'confirmed':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold text-xs">{t('statusConfirmed')}</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full font-bold text-xs">{t('statusPending')}</span>;
    }
  };

  if (!isAccountOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#F5E7E5] overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#FFF9F5] border-b border-[#F5E7E5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B77D83] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#292626] font-serif">{user?.name}</h3>
              <p className="text-xs text-[#8A7E7C]">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAccountOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#F5E7E5] text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="overflow-y-auto p-5 sm:p-8 flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#292626] uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#B77D83]" />
              <span>{t('myOrders')} ({orders.length})</span>
            </h4>
          </div>

          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-gray-400">{t('orderProcessing')}</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">{t('noOrdersYet')}</div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div 
                  key={ord._id || ord.orderNumber} 
                  className="p-4 rounded-xl border border-[#F5E7E5] bg-[#FFF9F5] hover:border-[#C5A477]/50 transition-all cursor-pointer"
                  onClick={() => setSelectedOrder(selectedOrder?.orderNumber === ord.orderNumber ? null : ord)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#292626]">#{ord.orderNumber}</span>
                      <span className="text-xs text-gray-400 ms-3">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {getStatusBadge(ord.orderStatus)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#555] border-t border-[#F5E7E5] pt-2">
                    <span>
                      {ord.items?.length || 0} {language === 'ar' ? 'منتجات' : 'articles'}
                    </span>
                    <span className="font-bold text-[#B77D83] text-sm">
                      {formatPrice(ord.total)}
                    </span>
                  </div>

                  {/* Expanded Detail Accordion */}
                  {selectedOrder?.orderNumber === ord.orderNumber && (
                    <div className="mt-4 pt-3 border-t border-[#F5E7E5] text-xs space-y-2 animate-in fade-in">
                      <p className="font-bold text-[#292626]">{language === 'ar' ? 'تفاصيل التوصيل:' : 'Adresse de livraison :'}</p>
                      <p className="text-gray-600">{ord.customerDetails?.governorate}، {ord.customerDetails?.city} — {ord.customerDetails?.address}</p>
                      
                      <div className="divide-y divide-[#F5E7E5] pt-2">
                        {ord.items?.map((it: any, i: number) => (
                          <div key={i} className="py-1.5 flex justify-between">
                            <span>{it.quantity}x {language === 'ar' ? it.titleAr : it.title}</span>
                            <span className="font-semibold">{formatPrice(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

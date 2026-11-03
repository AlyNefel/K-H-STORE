import React, { useState, useEffect } from 'react';
import { 
  X, Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, Sparkles, Send 
} from 'lucide-react';
import { useStore, ProductItem } from '../context/StoreContext.tsx';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { language, formatPrice, addToCart, wishlist, toggleWishlist, setIsCartOpen, setIsCheckoutOpen } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'shipping' | 'reviews'>('desc');
  const [isAdded, setIsAdded] = useState(false);

  // Reviews local state
  const [reviewsList, setReviewsList] = useState<any[]>([
    {
      id: 'rev_1',
      userName: 'ريم الماجري',
      rating: 5,
      comment: 'المنتج رائع جداً وفاخر أكثر مما توقعت، والتوصيل كان سريعاً في تونس العاصمة.',
      date: 'منذ يومين'
    },
    {
      id: 'rev_2',
      userName: 'Syrine G.',
      rating: 5,
      comment: 'Superbe qualité, tissu doux et finitions impeccables. Je recommande K&H les yeux fermés !',
      date: 'منذ أسبوع'
    }
  ]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Reset selected variant whenever product changes
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setActiveImageIdx(0);
    setQuantity(1);
    setIsAdded(false);
  }, [product]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'];

  const isFavorited = wishlist.includes(product._id);
  const currentPrice = product.salePrice || product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText) return;

    const newRev = {
      id: `rev_${Date.now()}`,
      userName: newReviewAuthor,
      rating: newReviewRating,
      comment: newReviewText,
      date: language === 'ar' ? 'الآن' : 'À l\'instant'
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);

    // Call backend API in background
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product._id,
        userName: newReviewAuthor,
        rating: newReviewRating,
        comment: newReviewText
      })
    }).catch(console.error);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-4xl bg-[#FFF9F5] rounded-2xl shadow-2xl border border-[#F5E7E5] overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#292626] shadow-sm transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-white border border-[#F5E7E5] shadow-xs">
                <img
                  src={images[activeImageIdx]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.salePrice && product.salePrice < product.price && (
                  <span className="absolute top-3 start-3 bg-[#B77D83] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIdx === idx ? 'border-[#B77D83] ring-1 ring-[#B77D83]' : 'border-[#F5E7E5] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Actions & Variants */}
            <div className="flex flex-col justify-between">
              <div>
                
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-xs text-[#8A7E7C] mb-2">
                  <span className="font-semibold text-[#B77D83] uppercase tracking-wider">
                    {product.subcategory || product.category}
                  </span>
                  <span className="font-mono">{product.sku}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-[#292626] font-serif mb-3 leading-snug">
                  {language === 'ar' ? product.titleAr : (language === 'fr' ? (product.titleFr || product.title) : product.title)}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-[#C5A477]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#292626]">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-[#8A7E7C]">({reviewsList.length} {language === 'ar' ? 'تقييم' : 'avis'})</span>
                </div>

                {/* Price Display */}
                <div className="p-4 bg-white rounded-xl border border-[#F5E7E5] mb-6 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#292626]">
                    {formatPrice(currentPrice)}
                  </span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span className="text-sm text-[#8A7E7C] line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-700 font-semibold ms-auto bg-emerald-50 px-2.5 py-1 rounded-md">
                    {language === 'ar' ? 'دفع عند الاستلام في تونس' : 'Paiement à la livraison'}
                  </span>
                </div>

                {/* Variants (Sizes and Colors) */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-[#292626] uppercase tracking-wider mb-2">
                        {language === 'ar' ? 'الخيارات المتاحة (المقاس / اللون):' : 'Options & Tailles :'}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v: any, idx: number) => {
                          const isSelected = selectedVariant?.sku === v.sku;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedVariant(v)}
                              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-[#292626] text-white border-[#292626] shadow-sm'
                                  : 'bg-white text-[#292626] border-[#EADCD8] hover:border-[#B77D83]'
                              }`}
                            >
                              {v.colorCode && (
                                <span 
                                  className="w-3 h-3 rounded-full border border-gray-300" 
                                  style={{ backgroundColor: v.colorCode }}
                                />
                              )}
                              <span>{v.size || v.color || `Option ${idx + 1}`}</span>
                              {v.stock !== undefined && (
                                <span className={`text-[10px] ${isSelected ? 'text-[#C5A477]' : 'text-gray-400'}`}>
                                  ({v.stock})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity and Actions */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#EADCD8] bg-white rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#292626] hover:bg-[#F5E7E5] rounded-sm transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-[#292626]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#292626] hover:bg-[#F5E7E5] rounded-sm transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Wishlist button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product._id)}
                    className={`p-3 rounded-lg border transition-all ${
                      isFavorited
                        ? 'bg-[#F5E7E5] border-[#B77D83] text-[#B77D83]'
                        : 'bg-white border-[#EADCD8] text-[#292626] hover:text-[#B77D83]'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Primary CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#B77D83] hover:bg-[#a66a71] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تمت الإضافة إلى الحقيبة' : 'Ajouté au Panier'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{language === 'ar' ? 'إضافة إلى الحقيبة' : 'Ajouter au Panier'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#292626] hover:bg-black text-[#FFF9F5] shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#C5A477]" />
                    <span>{language === 'ar' ? 'شراء مباشر بالدفع عند الاستلام' : 'Commander Directement'}</span>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-white/70 rounded-xl border border-[#F5E7E5] text-center text-[11px] text-[#292626]">
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-[#C5A477]" />
                    <span className="font-semibold">{language === 'ar' ? 'توصيل كامل تونس' : 'Livraison Tunisie'}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#C5A477]" />
                    <span className="font-semibold">{language === 'ar' ? 'معاينة عند الاستلام' : 'Vérification colis'}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RefreshCw className="w-4 h-4 text-[#C5A477]" />
                    <span className="font-semibold">{language === 'ar' ? 'إرجاع واستبدال' : 'Échange garanti'}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Tabs: Description / Shipping / Customer Reviews */}
          <div className="mt-10 border-t border-[#F5E7E5] pt-6">
            <div className="flex gap-4 border-b border-[#F5E7E5] pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('desc')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'desc' ? 'border-[#B77D83] text-[#B77D83]' : 'border-transparent text-[#8A7E7C] hover:text-[#292626]'
                }`}
              >
                {language === 'ar' ? 'تفاصيل المنتج' : 'Description'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('shipping')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'shipping' ? 'border-[#B77D83] text-[#B77D83]' : 'border-transparent text-[#8A7E7C] hover:text-[#292626]'
                }`}
              >
                {language === 'ar' ? 'الشحن والتوصيل في تونس' : 'Livraison & Retours'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'reviews' ? 'border-[#B77D83] text-[#B77D83]' : 'border-transparent text-[#8A7E7C] hover:text-[#292626]'
                }`}
              >
                {language === 'ar' ? `آراء العميلات (${reviewsList.length})` : `Avis Clientes (${reviewsList.length})`}
              </button>
            </div>

            <div className="py-6">
              {activeTab === 'desc' && (
                <div className="prose text-sm text-[#555] leading-relaxed space-y-3">
                  <p className="text-base text-[#292626] font-medium">
                    {language === 'ar' ? product.descriptionAr : (language === 'fr' ? (product.descriptionFr || product.description) : product.description)}
                  </p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {product.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-[#F5E7E5] text-[#292626] px-2.5 py-0.5 rounded-full font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="bg-white p-5 rounded-xl border border-[#F5E7E5] text-sm text-[#555] space-y-3">
                  <h4 className="font-bold text-[#292626]">{language === 'ar' ? 'توصيل آمن لجميع الولايات التونسية (24 ولاية)' : 'Livraison sur toute la Tunisie'}</h4>
                  <p>{language === 'ar' ? 'يتم توصيل طلبيات تونس الكبرى ونابل وسوسة وصفاقس خلال 24 إلى 48 ساعة كحد أقصى. باقي الولايات خلال 48 إلى 72 ساعة عبر أفضل شركات الشحن السريع.' : 'Livraison assurée dans un délai de 24h à 48h sur le Grand Tunis, et 48h à 72h sur les autres régions.'}</p>
                  <p className="font-semibold text-[#B77D83]">{language === 'ar' ? '• الدفع عند الاستلام نقداً مع إمكانية فتح ومعاينة الطرد مع الموزع.' : '• Paiement en espèces à la livraison avec vérification du colis.'}</p>
                  <p>{language === 'ar' ? '• رسوم الشحن: 7 د.ت فقط لكامل تراب الجمهورية، ومجاناً للطلبيات التي تفوق 150 د.ت.' : '• Frais de livraison : 7 DT fixes, offerts dès 150 DT d\'achats.'}</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="p-4 bg-white rounded-xl border border-[#F5E7E5]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-[#292626]">{rev.userName}</span>
                          <span className="text-xs text-gray-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-[#C5A477] mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-[#555] leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Submit Review Form */}
                  <form onSubmit={handleAddReview} className="bg-white p-5 rounded-xl border border-[#F5E7E5] space-y-4">
                    <h4 className="text-sm font-bold text-[#292626]">{language === 'ar' ? 'أضيفي تقييمكِ الصادق' : 'Laisser un avis'}</h4>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{language === 'ar' ? 'تقييمكِ:' : 'Votre note :'}</span>
                      <div className="flex gap-1 text-[#C5A477]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-current text-[#C5A477]' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'اسمكِ الكريم' : 'Votre Nom'}
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      required
                      className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs outline-none focus:border-[#B77D83]"
                    />

                    <textarea
                      placeholder={language === 'ar' ? 'شاركينا رأيكِ في جودة المنتج والخامة والتوصيل...' : 'Votre avis sur ce produit...'}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      required
                      rows={3}
                      className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs outline-none focus:border-[#B77D83]"
                    />

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#B77D83] text-white rounded-lg text-xs font-semibold hover:bg-[#a66a71] transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                      <span>{language === 'ar' ? 'نشر التقييم' : 'Envoyer l\'avis'}</span>
                    </button>

                    {reviewSubmitted && (
                      <p className="text-xs text-emerald-600 font-semibold">{language === 'ar' ? 'شكراً لكِ! تم نشر تقييمكِ بنجاح.' : 'Merci ! Votre avis a été enregistré.'}</p>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

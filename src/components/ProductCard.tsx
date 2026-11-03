import React, { useState, useRef } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check, Sparkles } from 'lucide-react';
import { useStore, ProductItem } from '../context/StoreContext.tsx';

interface ProductCardProps {
  product: ProductItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, formatPrice, addToCart, wishlist, toggleWishlist, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  
  // 3D Perspective Tilt state
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });

  const isFavorited = wishlist.includes(product._id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)
    : 0;

  const currentPrice = product.salePrice || product.price;
  const originalPrice = product.price;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized [-1, 1]
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8; // tilt up/down
    const rotateY = ((x - centerX) / centerX) * 8;  // tilt left/right
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, shineX, shineY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      setQuickViewProduct(product);
      return;
    }

    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80';
  const secondaryImage = product.images?.[1] || primaryImage;

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.3s ease' : 'transform 0.5s ease-out, box-shadow 0.5s ease',
      }}
      className="group relative bg-white/90 backdrop-blur-md rounded-2xl border border-[#F5E7E5] hover:border-[#C5A477]/60 shadow-xs hover:shadow-2xl flex flex-col overflow-hidden will-change-transform select-none"
    >
      {/* Dynamic Iridescent Glass Highlight */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{
          background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.4) 0%, rgba(197, 164, 119, 0.08) 40%, transparent 70%)`
        }}
      />

      {/* 1. Image Viewport with 3D Depth */}
      <div 
        onClick={() => setQuickViewProduct(product)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#FDF7F6] to-[#FFF9F5] cursor-pointer"
      >
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-all duration-700 ease-out"
          loading="lazy"
        />

        {/* Subtle Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges Overlay */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="bg-gradient-to-r from-[#B77D83] to-[#8f4f56] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C5A477]" />
              <span>-{discountPercent}%</span>
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#292626]/90 backdrop-blur-md text-[#C5A477] border border-[#C5A477]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              {language === 'ar' ? 'الأكثر طلباً' : 'Best Seller'}
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="bg-amber-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {language === 'ar' ? 'كمية محدودة' : 'Stock limité'}
            </span>
          )}
        </div>

        {/* Wishlist Button with Magnetic Scale */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          className={`absolute top-3 end-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 hover:scale-115 active:scale-90 ${
            isFavorited
              ? 'bg-[#B77D83] text-white shadow-lg'
              : 'bg-white/85 text-[#292626] hover:bg-white hover:text-[#B77D83] shadow-xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 bg-white/95 backdrop-blur-md text-[#292626] hover:bg-[#292626] hover:text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap hover:scale-105 active:scale-95"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'معاينة سريعة' : 'Aperçu Rapide'}</span>
        </button>
      </div>

      {/* 2. Product Meta & Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white/95">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#8A7E7C] mb-1.5">
            <span className="uppercase tracking-widest font-semibold text-[10px] text-[#B77D83]">
              {product.subcategory || product.category}
            </span>
            <div className="flex items-center gap-1 text-[#C5A477]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-bold text-xs text-[#292626]">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="text-sm font-semibold text-[#292626] hover:text-[#B77D83] transition-colors cursor-pointer line-clamp-2 leading-snug mb-2 font-serif"
          >
            {language === 'ar' ? product.titleAr : (language === 'fr' ? (product.titleFr || product.title) : product.title)}
          </h3>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-[#F5E7E5] flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-[#292626] tracking-tight">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-[#8A7E7C] line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>{language === 'ar' ? 'دفع عند الاستلام' : 'Paiement à la livraison'}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center hover:scale-108 active:scale-95 ${
              product.stock <= 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gradient-to-r from-[#F5E7E5] to-[#ebd5d2] text-[#292626] hover:from-[#B77D83] hover:to-[#a66a71] hover:text-white shadow-xs'
            }`}
            title="Add to Cart"
          >
            {justAdded ? (
              <Check className="w-4 h-4 animate-in zoom-in" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

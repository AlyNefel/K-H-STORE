export interface CartItemMath {
  price: number;
  salePrice?: number;
  quantity: number;
}

export interface CouponMath {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrder?: number;
  maxDiscount?: number;
}

export interface DeliveryConfig {
  fee: number;
  threshold: number;
}

export function calculateSubtotal(items: CartItemMath[]): number {
  const sum = items.reduce((acc, item) => {
    const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    return acc + unitPrice * item.quantity;
  }, 0);
  return Math.round(sum * 100) / 100;
}

export function calculateDiscount(subtotal: number, coupon?: CouponMath | null): number {
  if (!coupon) return 0;
  if (coupon.minOrder && subtotal < coupon.minOrder) return 0;

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === 'fixed') {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, subtotal);
  return Math.round(discount * 100) / 100;
}

export function calculateDeliveryFee(
  subtotal: number,
  config: DeliveryConfig = { fee: 7, threshold: 150 },
  coupon?: CouponMath | null
): number {
  if (subtotal === 0) return 0;
  if (coupon && coupon.discountType === 'free_shipping') return 0;
  if (subtotal >= config.threshold) return 0;
  return config.fee;
}

export function calculateGrandTotal(
  items: CartItemMath[],
  coupon?: CouponMath | null,
  config: DeliveryConfig = { fee: 7, threshold: 150 }
): {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
} {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, coupon);
  const deliveryFee = calculateDeliveryFee(subtotal, config, coupon);
  const total = Math.max(0, Math.round((subtotal - discount + deliveryFee) * 100) / 100);

  return { subtotal, discount, deliveryFee, total };
}

export function formatPriceTND(amount: number, language: 'ar' | 'fr' | 'en' = 'ar'): string {
  const formatted = (amount || 0).toFixed(2);
  if (language === 'ar') {
    return `${formatted} د.ت`;
  }
  return `${formatted} TND`;
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateSubtotal, 
  calculateDiscount, 
  calculateDeliveryFee, 
  calculateGrandTotal, 
  formatPriceTND 
} from './pricing.ts';

test('calculateSubtotal sums standard and sale prices correctly', () => {
  const items = [
    { price: 100, salePrice: 80, quantity: 2 }, // 160
    { price: 50, quantity: 1 }                  // 50
  ];
  assert.equal(calculateSubtotal(items), 210);
});

test('calculateDiscount applies percentage coupons correctly', () => {
  const coupon = {
    code: 'KH10',
    discountType: 'percentage' as const,
    discountValue: 10,
    minOrder: 50
  };
  assert.equal(calculateDiscount(200, coupon), 20);
  assert.equal(calculateDiscount(40, coupon), 0); // below minOrder
});

test('calculateDiscount enforces maxDiscount cap', () => {
  const coupon = {
    code: 'BIGDISCOUNT',
    discountType: 'percentage' as const,
    discountValue: 50,
    maxDiscount: 30
  };
  assert.equal(calculateDiscount(200, coupon), 30);
});

test('calculateDeliveryFee waives delivery above 150 TND threshold', () => {
  const config = { fee: 7, threshold: 150 };
  assert.equal(calculateDeliveryFee(100, config), 7);
  assert.equal(calculateDeliveryFee(150, config), 0);
  assert.equal(calculateDeliveryFee(200, config), 0);
  assert.equal(calculateDeliveryFee(0, config), 0);
});

test('calculateDeliveryFee waives delivery with free_shipping coupon', () => {
  const coupon = {
    code: 'LIVRAISON',
    discountType: 'free_shipping' as const,
    discountValue: 7
  };
  assert.equal(calculateDeliveryFee(80, { fee: 7, threshold: 150 }, coupon), 0);
});

test('calculateGrandTotal calculates final price accurately', () => {
  const items = [
    { price: 100, quantity: 1 }
  ];
  const coupon = {
    code: 'KH10',
    discountType: 'percentage' as const,
    discountValue: 10
  };
  const result = calculateGrandTotal(items, coupon, { fee: 7, threshold: 150 });
  assert.equal(result.subtotal, 100);
  assert.equal(result.discount, 10);
  assert.equal(result.deliveryFee, 7);
  assert.equal(result.total, 97);
});

test('formatPriceTND outputs correct currency symbol for Arabic and Latin', () => {
  assert.equal(formatPriceTND(89.5, 'ar'), '89.50 د.ت');
  assert.equal(formatPriceTND(89.5, 'fr'), '89.50 TND');
  assert.equal(formatPriceTND(89.5, 'en'), '89.50 TND');
});

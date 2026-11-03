import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'admin' | 'store_manager' | 'order_manager' | 'customer';
  phone?: string;
  addresses?: Array<{
    title: string;
    governorate: string;
    city: string;
    address: string;
    isDefault?: boolean;
  }>;
  wishlist?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'store_manager', 'order_manager', 'customer'], 
    default: 'customer' 
  },
  phone: { type: String, default: '' },
  addresses: [{
    title: { type: String, default: 'Home' },
    governorate: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  wishlist: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Product Schema
export interface IProductVariant {
  sku: string;
  color?: string;
  colorCode?: string;
  size?: string;
  stock: number;
  priceModifier?: number;
}

export interface IProduct extends Document {
  title: string;
  titleAr: string;
  titleFr?: string;
  description: string;
  descriptionAr: string;
  descriptionFr?: string;
  price: number; // in TND
  salePrice?: number;
  sku: string;
  category: string; // Category slug or ID
  subcategory?: string;
  images: string[];
  stock: number;
  variants?: IProductVariant[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  tags?: string[];
  rating: number;
  reviewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true, trim: true },
  titleAr: { type: String, required: true, trim: true },
  titleFr: { type: String, default: '' },
  description: { type: String, default: '' },
  descriptionAr: { type: String, default: '' },
  descriptionFr: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, default: 0 },
  sku: { type: String, required: true, unique: true, uppercase: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, default: '' },
  images: [{ type: String }],
  stock: { type: Number, required: true, min: 0, default: 10 },
  variants: [{
    sku: { type: String },
    color: { type: String },
    colorCode: { type: String },
    size: { type: String },
    stock: { type: Number, default: 0 },
    priceModifier: { type: Number, default: 0 }
  }],
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
  rating: { type: Number, default: 5 },
  reviewCount: { type: Number, default: 1 },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' }
}, { timestamps: true });

ProductSchema.index({ title: 'text', titleAr: 'text', description: 'text', descriptionAr: 'text', sku: 'text' });

// Category Schema
export interface ICategory extends Document {
  name: string;
  nameAr: string;
  nameFr?: string;
  slug: string;
  image?: string;
  subcategories?: string[];
  order: number;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  nameAr: { type: String, required: true },
  nameFr: { type: String, default: '' },
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  subcategories: [{ type: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Order Schema
export interface IOrderItem {
  productId: string;
  title: string;
  titleAr: string;
  price: number;
  quantity: number;
  image: string;
  variant?: {
    size?: string;
    color?: string;
    sku?: string;
  };
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
    governorate: string;
    city: string;
    address: string;
    notes?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  customerDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    governorate: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String, default: '' }
  },
  items: [{
    productId: { type: String, required: true },
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
    variant: {
      size: { type: String },
      color: { type: String },
      sku: { type: String }
    }
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 7 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
    index: true
  },
  internalNotes: { type: String, default: '' }
}, { timestamps: true });

// Coupon Schema
export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrder?: number;
  maxDiscount?: number;
  startDate?: Date;
  expirationDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed', 'free_shipping'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  expirationDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Review Schema
export interface IReview extends Document {
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  productId: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

// Banner Schema
export interface IBanner extends Document {
  title: string;
  titleAr: string;
  titleFr?: string;
  subtitle?: string;
  subtitleAr?: string;
  subtitleFr?: string;
  link: string;
  image: string;
  position: 'hero' | 'promo' | 'seasonal';
  order: number;
  isActive: boolean;
}

const BannerSchema = new Schema<IBanner>({
  title: { type: String, required: true },
  titleAr: { type: String, required: true },
  titleFr: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  subtitleAr: { type: String, default: '' },
  subtitleFr: { type: String, default: '' },
  link: { type: String, default: '/shop' },
  image: { type: String, required: true },
  position: { type: String, enum: ['hero', 'promo', 'seasonal'], default: 'hero' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Store Settings Schema
export interface IStoreSettings extends Document {
  storeName: string;
  sloganAr: string;
  sloganFr: string;
  sloganEn: string;
  contactEmail: string;
  phone: string;
  address: string;
  currency: string;
  deliveryFee: number;
  freeShippingThreshold: number;
  orderNumberPrefix: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
}

const StoreSettingsSchema = new Schema<IStoreSettings>({
  storeName: { type: String, default: 'K&H Online Store' },
  sloganAr: { type: String, default: 'كل ما يهم المرأة و المنزل' },
  sloganFr: { type: String, default: 'Tout ce qui importe pour la femme et la maison' },
  sloganEn: { type: String, default: 'Everything that matters to woman & home' },
  contactEmail: { type: String, default: 'ali.nefel2020@gmail.com' },
  phone: { type: String, default: '+216 55 123 456' },
  address: { type: String, default: 'Les Berges du Lac 2, Tunis, Tunisia' },
  currency: { type: String, default: 'TND' },
  deliveryFee: { type: Number, default: 7 }, // 7 TND standard delivery in Tunisia
  freeShippingThreshold: { type: Number, default: 150 }, // Free delivery over 150 TND
  orderNumberPrefix: { type: String, default: 'KH-' },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com/kh_onlinestore' },
    facebook: { type: String, default: 'https://facebook.com/khonlinestore' },
    tiktok: { type: String, default: 'https://tiktok.com/@kh_onlinestore' }
  }
}, { timestamps: true });

// Email Log Schema
export interface IEmailLog extends Document {
  to: string;
  subject: string;
  type: string;
  status: 'sent' | 'failed';
  error?: string;
  createdAt: Date;
}

const EmailLogSchema = new Schema<IEmailLog>({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  error: { type: String }
}, { timestamps: true });

// Export Models (preventing OverwriteModelError)
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const Coupon = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export const Banner = mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
export const StoreSettings = mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
export const EmailLog = mongoose.models.EmailLog || mongoose.model<IEmailLog>('EmailLog', EmailLogSchema);

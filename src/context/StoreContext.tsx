import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../i18n/translations.ts';

export interface CartItem {
  id: string; // product ID
  title: string;
  titleAr: string;
  price: number;
  salePrice?: number;
  quantity: number;
  image: string;
  sku: string;
  variant?: {
    size?: string;
    color?: string;
    sku?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'store_manager' | 'order_manager' | 'customer';
  phone?: string;
  addresses?: any[];
}

export interface ProductItem {
  _id: string;
  title: string;
  titleAr: string;
  titleFr?: string;
  description: string;
  descriptionAr: string;
  descriptionFr?: string;
  price: number;
  salePrice?: number;
  sku: string;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  variants?: any[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  tags?: string[];
  rating: number;
  reviewCount: number;
  seoTitle?: string;
  seoDescription?: string;
}

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.ar) => string;
  formatPrice: (amount: number) => string;
  
  // Data
  products: ProductItem[];
  categories: any[];
  banners: any[];
  settings: any;
  loading: boolean;
  refreshProducts: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: ProductItem, quantity?: number, variant?: any) => void;
  updateQuantity: (id: string, variantSku: string | undefined, delta: number) => void;
  removeFromCart: (id: string, variantSku?: string) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  appliedCoupon: any;
  total: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Auth
  user: UserProfile | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isManager: boolean;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;

  // Modals & Navigation
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  quickViewProduct: ProductItem | null;
  setQuickViewProduct: (product: ProductItem | null) => void;
  completedOrder: any;
  setCompletedOrder: (order: any) => void;
  infoModal: string | null; // 'about' | 'faq' | 'shipping' | 'contact'
  setInfoModal: (modal: string | null) => void;
  activeCategoryFilter: string;
  setActiveCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language & RTL
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('kh_language') as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kh_language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: keyof typeof translations.ar): string => {
    const table = translations[language] || translations.ar;
    return (table as any)[key] || (translations.ar as any)[key] || String(key);
  };

  const formatPrice = (amount: number): string => {
    const formatted = (amount || 0).toFixed(2);
    if (language === 'ar') {
      return `${formatted} د.ت`;
    }
    return `${formatted} TND`;
  };

  // 2. Data states
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStoreData = async () => {
    try {
      const [prodRes, catRes, banRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/banners'),
        fetch('/api/settings')
      ]);

      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data || []);
      }
      if (banRes.ok) {
        const data = await banRes.json();
        setBanners(data || []);
      }
      if (setRes.ok) {
        const data = await setRes.json();
        setSettings(data || null);
      }
    } catch (err) {
      console.error('Failed to fetch initial store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const refreshProducts = async () => {
    await fetchStoreData();
  };

  // 3. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('kh_cart', JSON.stringify(cart));
  }, [cart]);

  const [appliedCoupon, setAppliedCoupon] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('kh_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
  
  // Free delivery threshold: 150 TND
  const freeThreshold = settings?.freeShippingThreshold ?? 150;
  const baseDeliveryFee = settings?.deliveryFee ?? 7;
  const deliveryFee = subtotal >= freeThreshold || (appliedCoupon?.discountType === 'free_shipping') || subtotal === 0 
    ? 0 
    : baseDeliveryFee;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.discountValue;
    }
  }
  discount = Math.min(discount, subtotal);
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const addToCart = (product: ProductItem, quantity = 1, variant?: any) => {
    setCart(prev => {
      const variantSku = variant?.sku || `${variant?.size || ''}-${variant?.color || ''}`;
      const existingIdx = prev.findIndex(item => {
        const itemVarSku = item.variant?.sku || `${item.variant?.size || ''}-${item.variant?.color || ''}`;
        return item.id === product._id && itemVarSku === variantSku;
      });

      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          id: product._id,
          title: product.title,
          titleAr: product.titleAr,
          price: product.price,
          salePrice: product.salePrice,
          quantity,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
          sku: product.sku,
          variant: variant ? { size: variant.size, color: variant.color, sku: variant.sku } : undefined
        }
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, variantSku: string | undefined, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          const itemVarSku = item.variant?.sku || `${item.variant?.size || ''}-${item.variant?.color || ''}`;
          if (item.id === id && (variantSku === undefined || itemVarSku === variantSku)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: string, variantSku?: string) => {
    setCart(prev => prev.filter(item => {
      const itemVarSku = item.variant?.sku || `${item.variant?.size || ''}-${item.variant?.color || ''}`;
      if (variantSku) {
        return !(item.id === id && itemVarSku === variantSku);
      }
      return item.id !== id;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem('kh_coupon');
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal: subtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Invalid coupon' };
      }
      setAppliedCoupon(data.coupon);
      localStorage.setItem('kh_coupon', JSON.stringify(data.coupon));
      return { success: true, message: 'Coupon applied successfully' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error validating coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('kh_coupon');
  };

  // 4. Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kh_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('kh_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // 5. Auth State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kh_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('kh_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Connexion échouée' };
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('kh_token', data.token);
      localStorage.setItem('kh_user', JSON.stringify(data.user));
      setIsAuthOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, phone })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Inscription échouée' };
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('kh_token', data.token);
      localStorage.setItem('kh_user', JSON.stringify(data.user));
      setIsAuthOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kh_token');
    localStorage.removeItem('kh_user');
  };

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const isManager = isAdmin || user?.role === 'store_manager' || user?.role === 'order_manager';

  // 6. Navigation and Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [infoModal, setInfoModal] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatPrice,
        products,
        categories,
        banners,
        settings,
        loading,
        refreshProducts,
        cart,
        addToCart,
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
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        user,
        token,
        login,
        register,
        logout,
        isAdmin,
        isManager,
        isAuthOpen,
        setIsAuthOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        quickViewProduct,
        setQuickViewProduct,
        completedOrder,
        setCompletedOrder,
        infoModal,
        setInfoModal,
        activeCategoryFilter,
        setActiveCategoryFilter,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

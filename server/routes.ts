import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  User, Product, Category, Order, Coupon, Review, Banner, StoreSettings, EmailLog 
} from './models/index.ts';
import { isDbConnected } from './db.ts';
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail, sendEmail } from './mail.ts';
import { uploadImageToCloudinary } from './cloudinary.ts';
import { generateProductDescription } from './ai.ts';
import { initialProducts, initialCategories, initialBanners, initialCoupons, seedDatabase } from './seedData.ts';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kh_store_super_secret_jwt_key_2026_boutique_auth_token';

// In-memory fallback state in case MongoDB Atlas connection takes time or is offline
let memProducts = [...initialProducts.map((p, idx) => ({ ...p, _id: `mem_p_${idx + 1}` }))];
let memCategories = [...initialCategories.map((c, idx) => ({ ...c, _id: `mem_c_${idx + 1}` }))];
let memBanners = [...initialBanners.map((b, idx) => ({ ...b, _id: `mem_b_${idx + 1}` }))];
let memCoupons = [...initialCoupons.map((c, idx) => ({ ...c, _id: `mem_cp_${idx + 1}` }))];
let memOrders: any[] = [
  {
    _id: 'mem_ord_1',
    orderNumber: 'KH-2026-1001',
    customerDetails: {
      fullName: 'Amira Trabelsi',
      email: 'amira.trabelsi@gmail.com',
      phone: '+216 98 123 789',
      governorate: 'Tunis',
      city: 'Ariana Ville',
      address: 'Rue de la Rose, Résidence Jasmin No 4'
    },
    items: [
      {
        productId: 'mem_p_1',
        title: 'Silk Embroidered Evening Kaftan',
        titleAr: 'قفطان حريري مطرز بالخيوط الذهبية',
        price: 195,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=80',
        variant: { size: 'M', color: 'Dusty Rose' }
      }
    ],
    subtotal: 195,
    deliveryFee: 0,
    discount: 0,
    total: 195,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 2)
  },
  {
    _id: 'mem_ord_2',
    orderNumber: 'KH-2026-1002',
    customerDetails: {
      fullName: 'Nadia Khemir',
      email: 'nadia.khemir@hotmail.com',
      phone: '+216 22 456 123',
      governorate: 'Sousse',
      city: 'Kantaoui',
      address: 'Villa 12, Cité Les Orangers'
    },
    items: [
      {
        productId: 'mem_p_3',
        title: 'Handmade Italian Grain Leather Tote',
        titleAr: 'حقيبة يد جلدية إيطالية فاخرة بإبزيم ذهبي',
        price: 175,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80'
      }
    ],
    subtotal: 175,
    deliveryFee: 7,
    discount: 0,
    total: 182,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'shipped',
    createdAt: new Date(Date.now() - 86400000)
  }
];
let memReviews: any[] = [];
let memSettings: any = {
  storeName: 'K&H Online Store',
  sloganAr: 'كل ما يهم المرأة و المنزل',
  sloganFr: 'Tout ce qui importe pour la femme et la maison',
  sloganEn: 'Everything that matters to woman & home',
  contactEmail: 'ali.nefel2020@gmail.com',
  phone: '+216 55 123 456',
  address: 'Les Berges du Lac 2, Tunis, Tunisia',
  currency: 'TND',
  deliveryFee: 7,
  freeShippingThreshold: 150
};

// ─── AUTHENTICATION ──────────────────────────────────────────────
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Default Super Admin shortcut check
    if (email.toLowerCase() === 'admin@khstore.tn' && password === 'admin123') {
      const user = {
        id: 'super_admin_1',
        name: 'K&H Super Admin',
        email: 'admin@khstore.tn',
        role: 'super_admin'
      };
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user });
    }

    // Default Manager check
    if (email.toLowerCase() === 'manager@khstore.tn' && password === 'manager123') {
      const user = {
        id: 'manager_1',
        name: 'Responsable Commandes',
        email: 'manager@khstore.tn',
        role: 'store_manager'
      };
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides / Invalid credentials' });
      }

      if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Identifiants invalides / Invalid credentials' });
        }
      }

      const payload = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: payload });
    } else {
      // Memory fallback for demo customer
      if (email.toLowerCase() === 'client@khstore.tn' && password === 'client123') {
        const user = {
          id: 'client_1',
          name: 'Sarah Ben Salem',
          email: 'client@khstore.tn',
          role: 'customer'
        };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user });
      }

      return res.status(401).json({ error: 'Identifiants invalides' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (isDbConnected()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        role: 'customer',
        isActive: true
      });

      const payload = {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ token, user: payload });
    } else {
      const payload = {
        id: `mem_user_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: 'customer'
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ token, user: payload });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// ─── PRODUCTS ────────────────────────────────────────────────────
router.get('/products', async (req: Request, res: Response) => {
  try {
    const { category, search, featured, bestSeller, minPrice, maxPrice, sort, page = '1', limit = '50' } = req.query;

    if (isDbConnected()) {
      const query: any = { isActive: true };

      if (category && category !== 'all') {
        query.category = category;
      }
      if (featured === 'true') {
        query.isFeatured = true;
      }
      if (bestSeller === 'true') {
        query.isBestSeller = true;
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        query.$or = [
          { title: searchRegex },
          { titleAr: searchRegex },
          { description: searchRegex },
          { descriptionAr: searchRegex },
          { sku: searchRegex },
          { tags: searchRegex }
        ];
      }

      let sortOptions: any = { createdAt: -1 };
      if (sort === 'price-low') sortOptions = { price: 1 };
      if (sort === 'price-high') sortOptions = { price: -1 };
      if (sort === 'rating') sortOptions = { rating: -1 };

      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);

      const [products, total] = await Promise.all([
        Product.find(query).sort(sortOptions).skip((pageNum - 1) * limitNum).limit(limitNum),
        Product.countDocuments(query)
      ]);

      return res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
    } else {
      let filtered = [...memProducts].filter(p => p.isActive);

      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (featured === 'true') {
        filtered = filtered.filter(p => p.isFeatured);
      }
      if (bestSeller === 'true') {
        filtered = filtered.filter(p => p.isBestSeller);
      }
      if (minPrice) {
        filtered = filtered.filter(p => (p.salePrice || p.price) >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(p => (p.salePrice || p.price) <= Number(maxPrice));
      }
      if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.titleAr.includes(q) || 
          p.sku.toLowerCase().includes(q)
        );
      }

      if (sort === 'price-low') {
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      } else if (sort === 'price-high') {
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      }

      return res.json({ products: filtered, total: filtered.length, page: 1, pages: 1 });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let product = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      }
      if (!product) {
        product = await Product.findOne({ sku: id.toUpperCase() });
      }
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const reviews = await Review.find({ productId: product._id.toString(), isApproved: true });
      const related = await Product.find({ 
        category: product.category, 
        _id: { $ne: product._id },
        isActive: true 
      }).limit(4);

      return res.json({ product, reviews, related });
    } else {
      const product = memProducts.find(p => p._id === id || p.sku === id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      const related = memProducts.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);
      return res.json({ product, reviews: [], related });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.title || !data.titleAr || !data.price || !data.sku) {
      return res.status(400).json({ error: 'Title, Arabic title, price and SKU are required' });
    }

    if (isDbConnected()) {
      const created = await Product.create(data);
      return res.status(201).json(created);
    } else {
      const created = { ...data, _id: `mem_p_${Date.now()}` };
      memProducts.unshift(created);
      return res.status(201).json(created);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (isDbConnected()) {
      const updated = await Product.findByIdAndUpdate(id, update, { new: true });
      return res.json(updated);
    } else {
      const idx = memProducts.findIndex(p => p._id === id);
      if (idx !== -1) {
        memProducts[idx] = { ...memProducts[idx], ...update };
        return res.json(memProducts[idx]);
      }
      return res.status(404).json({ error: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      await Product.findByIdAndDelete(id);
      return res.json({ success: true });
    } else {
      memProducts = memProducts.filter(p => p._id !== id);
      return res.json({ success: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── CATEGORIES ──────────────────────────────────────────────────
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const categories = await Category.find({ isActive: true }).sort({ order: 1 });
      return res.json(categories);
    } else {
      return res.json(memCategories);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/categories', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (isDbConnected()) {
      const cat = await Category.create(data);
      return res.status(201).json(cat);
    } else {
      const cat = { ...data, _id: `mem_c_${Date.now()}` };
      memCategories.push(cat);
      return res.status(201).json(cat);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const cat = await Category.findByIdAndUpdate(id, req.body, { new: true });
      return res.json(cat);
    } else {
      const idx = memCategories.findIndex(c => c._id === id);
      if (idx !== -1) {
        memCategories[idx] = { ...memCategories[idx], ...req.body };
        return res.json(memCategories[idx]);
      }
      return res.status(404).json({ error: 'Category not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await Category.findByIdAndDelete(id);
      return res.json({ success: true });
    } else {
      memCategories = memCategories.filter(c => c._id !== id);
      return res.json({ success: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── ORDERS ──────────────────────────────────────────────────────
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const { customerDetails, items, subtotal, deliveryFee, discount, couponCode, total, paymentMethod } = req.body;

    if (!customerDetails || !customerDetails.fullName || !customerDetails.phone || !customerDetails.governorate || !customerDetails.city || !customerDetails.address) {
      return res.status(400).json({ error: 'Tous les champs de livraison sont obligatoires / All delivery fields are required' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide / Cart is empty' });
    }

    // Generate unique order number: KH-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KH-2026-${randomSuffix}`;

    const orderData = {
      orderNumber,
      customerDetails,
      items,
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee),
      discount: Number(discount || 0),
      couponCode: couponCode || '',
      total: Number(total),
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      createdAt: new Date()
    };

    let createdOrder = null;

    if (isDbConnected()) {
      // Stock decrement
      for (const item of items) {
        try {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity }
          });
        } catch {
          // continue
        }
      }

      createdOrder = await Order.create(orderData);
    } else {
      createdOrder = { ...orderData, _id: `mem_ord_${Date.now()}` };
      memOrders.unshift(createdOrder);

      // Deduct from memory products
      for (const item of items) {
        const prod = memProducts.find(p => p._id === item.productId || p.sku === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      }
    }

    // Send confirmation email asynchronously via Gmail SMTP
    sendOrderConfirmationEmail(createdOrder).catch(err => console.error('Email send background error:', err));

    return res.status(201).json(createdOrder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders', async (req: Request, res: Response) => {
  try {
    const { status, search, email } = req.query;

    if (isDbConnected()) {
      const query: any = {};
      if (status && status !== 'all') {
        query.orderStatus = status;
      }
      if (email) {
        query['customerDetails.email'] = email;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        query.$or = [
          { orderNumber: regex },
          { 'customerDetails.fullName': regex },
          { 'customerDetails.phone': regex }
        ];
      }

      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      let filtered = [...memOrders];
      if (status && status !== 'all') {
        filtered = filtered.filter(o => o.orderStatus === status);
      }
      if (email) {
        filtered = filtered.filter(o => o.customerDetails?.email === email);
      }
      if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(o => 
          o.orderNumber.toLowerCase().includes(q) || 
          o.customerDetails?.fullName?.toLowerCase().includes(q) ||
          o.customerDetails?.phone?.includes(q)
        );
      }
      return res.json(filtered);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    if (isDbConnected()) {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      order.orderStatus = status;
      if (internalNotes !== undefined) {
        order.internalNotes = internalNotes;
      }
      if (status === 'delivered') {
        order.paymentStatus = 'paid';
      }
      await order.save();

      // Trigger status update email
      sendOrderStatusUpdateEmail(order, status).catch(console.error);

      return res.json(order);
    } else {
      const order = memOrders.find(o => o._id === id || o.orderNumber === id);
      if (order) {
        order.orderStatus = status;
        if (internalNotes !== undefined) order.internalNotes = internalNotes;
        if (status === 'delivered') order.paymentStatus = 'paid';
        return res.json(order);
      }
      return res.status(404).json({ error: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Dashboard Summary Analytics
router.get('/orders/stats/summary', async (_req: Request, res: Response) => {
  try {
    let ordersList = [];
    let productCount = 0;
    let customerCount = 0;

    if (isDbConnected()) {
      ordersList = await Order.find();
      productCount = await Product.countDocuments({ isActive: true });
      customerCount = await User.countDocuments({ role: 'customer' });
    } else {
      ordersList = memOrders;
      productCount = memProducts.filter(p => p.isActive).length;
      customerCount = 14;
    }

    const totalRevenue = ordersList
      .filter((o: any) => o.orderStatus !== 'cancelled')
      .reduce((sum: number, o: any) => sum + (o.total || 0), 0);

    const pendingOrders = ordersList.filter((o: any) => o.orderStatus === 'pending').length;
    const completedOrders = ordersList.filter((o: any) => o.orderStatus === 'delivered').length;
    const processingOrders = ordersList.filter((o: any) => o.orderStatus === 'processing' || o.orderStatus === 'shipped').length;
    const cancelledOrders = ordersList.filter((o: any) => o.orderStatus === 'cancelled').length;

    // Low stock count (products with stock <= 5)
    const lowStockCount = isDbConnected() 
      ? await Product.countDocuments({ stock: { $lte: 5 } })
      : memProducts.filter(p => p.stock <= 5).length;

    return res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: ordersList.length,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      totalProducts: productCount,
      lowStockProducts: lowStockCount,
      totalCustomers: customerCount + ordersList.length,
      currency: 'TND',
      recentOrders: ordersList.slice(0, 5)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── COUPONS ─────────────────────────────────────────────────────
router.post('/coupons/validate', async (req: Request, res: Response) => {
  try {
    const { code, cartSubtotal } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required' });

    let coupon = null;
    if (isDbConnected()) {
      coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    } else {
      coupon = memCoupons.find(c => c.code === code.toUpperCase().trim() && c.isActive);
    }

    if (!coupon) {
      return res.status(404).json({ error: 'Code promo invalide / Invalid coupon code' });
    }

    if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ error: 'Code promo expiré / Coupon expired' });
    }

    const sub = Number(cartSubtotal || 0);
    if (coupon.minOrder && sub < coupon.minOrder) {
      return res.status(400).json({ 
        error: `Montant minimum requis : ${coupon.minOrder} TND / Minimum order is ${coupon.minOrder} TND` 
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (sub * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'free_shipping') {
      discountAmount = 7; // Delivery fee waived
    }

    return res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount * 100) / 100
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/coupons', async (_req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      return res.json(coupons);
    }
    return res.json(memCoupons);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/coupons', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (isDbConnected()) {
      const cp = await Coupon.create(data);
      return res.status(201).json(cp);
    } else {
      const cp = { ...data, _id: `mem_cp_${Date.now()}` };
      memCoupons.push(cp);
      return res.status(201).json(cp);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/coupons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await Coupon.findByIdAndDelete(id);
      return res.json({ success: true });
    } else {
      memCoupons = memCoupons.filter(c => c._id !== id);
      return res.json({ success: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── BANNERS ─────────────────────────────────────────────────────
router.get('/banners', async (_req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
      return res.json(banners);
    }
    return res.json(memBanners);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/banners', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (isDbConnected()) {
      const banner = await Banner.create(data);
      return res.status(201).json(banner);
    } else {
      const banner = { ...data, _id: `mem_b_${Date.now()}` };
      memBanners.push(banner);
      return res.status(201).json(banner);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── REVIEWS ─────────────────────────────────────────────────────
router.post('/reviews', async (req: Request, res: Response) => {
  try {
    const { productId, userName, userEmail, rating, comment } = req.body;
    if (!productId || !userName || !rating || !comment) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const reviewData = {
      productId,
      userName,
      userEmail: userEmail || 'client@khstore.tn',
      rating: Number(rating),
      comment,
      isApproved: true,
      createdAt: new Date()
    };

    if (isDbConnected()) {
      const review = await Review.create(reviewData);
      return res.status(201).json(review);
    } else {
      const review = { ...reviewData, _id: `mem_r_${Date.now()}` };
      memReviews.unshift(review);
      return res.status(201).json(review);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── CLOUDINARY UPLOAD ───────────────────────────────────────────
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const uploadRes = await uploadImageToCloudinary(imageBase64);
    if (!uploadRes.success) {
      return res.status(500).json({ error: uploadRes.error });
    }
    return res.json({ url: uploadRes.url, publicId: uploadRes.publicId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── GEMINI AI PRODUCT DESCRIPTION & SEO ─────────────────────────
router.post('/ai/describe', async (req: Request, res: Response) => {
  try {
    const { title, category, keywords } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Product title is required' });
    }

    const generated = await generateProductDescription({ title, category, keywords });
    return res.json(generated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── EMAIL TEST ──────────────────────────────────────────────────
router.post('/email/test', async (req: Request, res: Response) => {
  try {
    const { recipient } = req.body;
    const target = recipient || process.env.SMTP_USER || 'ali.nefel2020@gmail.com';

    const result = await sendEmail({
      to: target,
      subject: 'اختبار خادم البريد الإلكتروني - متجر K&H Online Store',
      type: 'test_email',
      html: `
        <div dir="rtl" style="font-family: sans-serif; padding: 20px; background: #FFF9F5;">
          <h2 style="color: #B77D83;">تهانينا! خادم البريد الإلكتروني يعمل بنجاح.</h2>
          <p>تم إرسال هذا البريد التجريبي من لوحة تحكم متجر K&H عبر Gmail SMTP.</p>
          <p style="font-size: 13px; color: #777;">K&H Online Store - كل ما يهم المرأة و المنزل</p>
        </div>
      `
    });

    return res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── STORE SETTINGS ──────────────────────────────────────────────
router.get('/settings', async (_req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const settings = await StoreSettings.findOne();
      return res.json(settings || memSettings);
    }
    return res.json(memSettings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      let settings = await StoreSettings.findOne();
      if (!settings) {
        settings = await StoreSettings.create(req.body);
      } else {
        Object.assign(settings, req.body);
        await settings.save();
      }
      return res.json(settings);
    } else {
      memSettings = { ...memSettings, ...req.body };
      return res.json(memSettings);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── RE-SEED TRIGGER ─────────────────────────────────────────────
router.post('/seed', async (_req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      await seedDatabase();
      return res.json({ success: true, message: 'Database reseeded successfully.' });
    }
    return res.json({ success: true, message: 'Seeded in memory storage.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

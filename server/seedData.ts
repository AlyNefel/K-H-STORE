import bcrypt from 'bcryptjs';
import { User, Product, Category, Banner, Coupon, StoreSettings, Order } from './models/index.ts';

export const initialCategories = [
  {
    name: "Women's Fashion",
    nameAr: "أزياء نسائية فاخرة",
    nameFr: "Mode Féminine",
    slug: "womens-fashion",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    subcategories: ["فساتين سهرة", "قفاطين عصرية", "أطقم عملية", "عبايات راقية"],
    order: 1,
    isActive: true,
  },
  {
    name: "Handbags & Accessories",
    nameAr: "حقائب وإكسسوارات",
    nameFr: "Sacs & Accessoires",
    slug: "handbags-accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    subcategories: ["حقائب يد جلدية", "حقائب كتف", "محافظ نسائية", "أوشحة حريرية"],
    order: 2,
    isActive: true,
  },
  {
    name: "Perfumes & Beauty",
    nameAr: "عطور وتجميل",
    nameFr: "Parfums & Beauté",
    slug: "perfumes-beauty",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    subcategories: ["عطور شرقية وفواحة", "عطور فرنسية نسائية", "عناية بالبشرة", "بخور ومعطرات"],
    order: 3,
    isActive: true,
  },
  {
    name: "Kitchen & Tableware",
    nameAr: "مستلزمات ومائدة المطبخ",
    nameFr: "Cuisine & Art de la Table",
    slug: "kitchen-tableware",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    subcategories: ["أطقم شاي وقهوة فاخرة", "أواني تقديم رخامية", "أدوات مائدة مذهبة", "أجهزة تحضير حديثة"],
    order: 4,
    isActive: true,
  },
  {
    name: "Home Decor & Living",
    nameAr: "ديكور وأناقة المنزل",
    nameFr: "Décoration & Maison",
    slug: "home-decor",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
    subcategories: ["مزهريات وتحف فنية", "وسائد ومفارش فاخرة", "شموع عطرية وفواحات", "مرايا وإضاءة"],
    order: 5,
    isActive: true,
  },
  {
    name: "Seasonal Collections",
    nameAr: "تشكيلات موسمية حصرية",
    nameFr: "Collections Saisonnières",
    slug: "seasonal-collections",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    subcategories: ["مجموعة الربيع الزهرية", "أناقة العيد ورمضان", "تشكيلة الصيف المنعشة"],
    order: 6,
    isActive: true,
  }
];

export const initialProducts = [
  {
    title: "Silk Embroidered Evening Kaftan",
    titleAr: "قفطان حريري مطرز بالخيوط الذهبية",
    titleFr: "Caftan en Soie Brodé d'Or",
    description: "An exceptional handcrafted evening kaftan woven from royal silk and delicately embroidered with golden thread work. Perfect for festive celebrations and intimate galas.",
    descriptionAr: "قفطان فاخر مصنوع يدوياً من أفخر أنواع الحرير الملكي مع تطريز دقيق بالخيوط الذهبية الراقية. تصميم انسيابي يمنحكِ حضوراً ملكياً في أرقى المناسبات والاحتفالات.",
    descriptionFr: "Caftan d'exception confectionné en soie royale avec de sublimes broderies au fil d'or. Silhouette fluide et majestueuse pour vos plus belles soirées.",
    price: 240,
    salePrice: 195,
    sku: "KH-KAF-01",
    category: "womens-fashion",
    subcategory: "قفاطين عصرية",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80"
    ],
    stock: 18,
    variants: [
      { sku: "KH-KAF-01-S", size: "S", color: "Dusty Rose", colorCode: "#B77D83", stock: 5 },
      { sku: "KH-KAF-01-M", size: "M", color: "Dusty Rose", colorCode: "#B77D83", stock: 8 },
      { sku: "KH-KAF-01-L", size: "L", color: "Dusty Rose", colorCode: "#B77D83", stock: 5 }
    ],
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    tags: ["قفطان", "حرير", "سهرة", "تطريز ذهبي", "أزياء نسائية"],
    rating: 4.9,
    reviewCount: 14,
    seoTitle: "قفطان حريري مطرز فاخر - متجر K&H تونس",
    seoDescription: "تسوقي قفطان حريري مطرز بالخيوط الذهبية من متجر K&H. توصيل سريع في كامل تراب الجمهورية التونسية والدفع عند الاستلام."
  },
  {
    title: "Pleated Powder Pink Maxi Dress",
    titleAr: "فستان ماكسي وردي بليسيه أنيق",
    titleFr: "Robe Maxi Plissée Rose Poudré",
    description: "Graceful fluid pleated dress featuring a delicate cinched waist and flutter sleeves. Designed with soft breathable chiffon for effortless daytime luxury.",
    descriptionAr: "فستان ماكسي من الشيفون الانسيابي المكسر (بليسيه) بلون وردي بودري ناعم وحزام خصر رقيق، يعكس رقة الأنوثة وأناقة الإطلالات الصيفية والربيعية.",
    descriptionFr: "Robe longue plissée en mousseline vaporeuse rose poudré. Ceinture délicate pour une allure féminine et romantique en toutes occasions.",
    price: 165,
    salePrice: 139,
    sku: "KH-DRS-02",
    category: "womens-fashion",
    subcategory: "فساتين سهرة",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80"
    ],
    stock: 22,
    variants: [
      { sku: "KH-DRS-02-38", size: "38", color: "Blush Pink", colorCode: "#F5E7E5", stock: 7 },
      { sku: "KH-DRS-02-40", size: "40", color: "Blush Pink", colorCode: "#F5E7E5", stock: 9 },
      { sku: "KH-DRS-02-42", size: "42", color: "Blush Pink", colorCode: "#F5E7E5", stock: 6 }
    ],
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    tags: ["فستان", "وردي", "بليسيه", "أناقة", "K&H"],
    rating: 4.8,
    reviewCount: 9
  },
  {
    title: "Handmade Italian Grain Leather Tote",
    titleAr: "حقيبة يد جلدية إيطالية فاخرة بإبزيم ذهبي",
    titleFr: "Sac Cabas Cuir Grainé Italien",
    description: "Mastercrafted full grain leather tote with champagne gold plated hardware and velvet lined compartments. Includes an adjustable leather shoulder strap.",
    descriptionAr: "حقيبة يد فاخرة مصنوعة من الجلد الطبيعي الحبيبي المقاوم للخدوش مع حليات معدنية مطلية بلون الذهب الشامباني وبطانة مخملية ناعمة. سعة رحبة وأناقة تدوم طويلاً.",
    descriptionFr: "Sac cabas structuré en cuir grainé de première qualité avec bouclerie dorée raffinée. Élégance intemporelle pour la femme moderne.",
    price: 195,
    salePrice: 175,
    sku: "KH-BAG-01",
    category: "handbags-accessories",
    subcategory: "حقائب يد جلدية",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&q=80"
    ],
    stock: 14,
    variants: [
      { sku: "KH-BAG-01-CAR", color: "Caramel Gold", colorCode: "#C5A477", stock: 8 },
      { sku: "KH-BAG-01-ROSE", color: "Dusty Rose", colorCode: "#B77D83", stock: 6 }
    ],
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    tags: ["حقيبة جلدية", "حقائب يد", "جلد طبيعي", "إيطالي", "إكسسوارات"],
    rating: 5.0,
    reviewCount: 18
  },
  {
    title: "Royal Oud & Damask Rose Eau de Parfum",
    titleAr: "عطر عود ملكي وورد دمشقي 100 مل",
    titleFr: "Eau de Parfum Oud Royal & Rose Damascena",
    description: "An intoxicating blend of Turkish Damask rose, velvety amber, and aged royal Cambodian oud. High concentration Eau de Parfum with lasting sillage.",
    descriptionAr: "توليفة عطرية آسرة تمزج بين قطرات الورد الجوري النادر ونفحات العود الملكي المعتق والعنبر الدافئ. ثبات يدوم أكثر من 24 ساعة ليعبق بحضور لا يُنسى.",
    descriptionFr: "Une symphonie olfactive prestigieuse mêlant la rose de Damas, l'ambre chaleureux et l'oud royal le plus précieux.",
    price: 180,
    salePrice: 149,
    sku: "KH-PRF-01",
    category: "perfumes-beauty",
    subcategory: "عطور شرقية وفواحة",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=80"
    ],
    stock: 25,
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    tags: ["عطر", "عود", "ورد دمشقي", "عطور نسائية", "تونس"],
    rating: 4.9,
    reviewCount: 22
  },
  {
    title: "Turkish 12-Piece Porcelain Tea & Coffee Set",
    titleAr: "طقم شاي وقهوة تركي فاخر من البورسلان مع لمسات ذهبية",
    titleFr: "Service à Thé & Café Porcelaine Dorée 12 Pièces",
    description: "12-piece fine bone porcelain hospitality set with 24k gold rim detailing. Designed for memorable Arab hospitality and refined teatime moments.",
    descriptionAr: "طقم ضيافة ملكي مكون من 12 قطعة من البورسلان النقي مع حواف وزخارف مذهبة عيار 24. يضفي لمسة من الفخامة العريقة على جلسات الشاي والقهوة واستقبال الضيوف.",
    descriptionFr: "Sublime service à thé et café composé de 12 pièces en fine porcelaine rehaussée de délicats liserés dorés.",
    price: 185,
    salePrice: 155,
    sku: "KH-KIT-01",
    category: "kitchen-tableware",
    subcategory: "أطقم شاي وقهوة فاخرة",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80",
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=900&q=80"
    ],
    stock: 12,
    isFeatured: true,
    isBestSeller: false,
    isActive: true,
    tags: ["مطبخ", "طقم شاي", "بورسلان", "ضيافة", "ديكور مائدة"],
    rating: 4.9,
    reviewCount: 8
  },
  {
    title: "Handcrafted Ceramic Marble Tray with Brass Handles",
    titleAr: "صينية تقديم رخامية فاخرة بمقابض نحاسية ذهبية",
    titleFr: "Plateau de Service Marbré Poignées Laiton",
    description: "Natural marble composite serving tray with brushed champagne brass handles. Ideal for perfume display, bedside aesthetics or tea service.",
    descriptionAr: "صينية تقديم فاخرة بتأثير الرخام الإيطالي الفاتح مع مقابض متينة من النحاس المذهب المصقول. مثالية لتقديم المشروبات أو لتنظيم العطور والمجوهرات على منضدة التزيين.",
    descriptionFr: "Magnifique plateau en céramique aspect marbre orné de poignées en laiton champagne brossé. Idéal pour vos réceptions ou décoration coiffeuse.",
    price: 89,
    salePrice: 75,
    sku: "KH-DEC-01",
    category: "home-decor",
    subcategory: "أواني تقديم رخامية",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&q=80",
      "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=900&q=80"
    ],
    stock: 20,
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    tags: ["ديكور", "صينية رخام", "نحاس", "منزل", "إكسسوارات"],
    rating: 4.7,
    reviewCount: 11
  },
  {
    title: "Nordic Amber Glass Scented Soy Candle Set",
    titleAr: "طقم شموع عطرية عضوية برائحة الفانيليا والمسك",
    titleFr: "Coffret Bougies Parfumées Cire de Soja & Musc",
    description: "Three eco-friendly scented candles poured in amber apothecary jars, blending Madagascar vanilla, warm cashmere, and white musk with wooden wicks.",
    descriptionAr: "ثلاث شموع عطرية مصنوعة من شمع الصويا الطبيعي النقي 100% في أوانٍ زجاجية كهرمانية فاخرة، مع فتائل خشبية تحدث صوتاً هادئاً كالموقد وتغمر المنزل بعبير الفانيليا والمسك الأبيض.",
    descriptionFr: "Set de trois bougies artisanales en cire végétale de soja, parfumées à la vanille de Madagascar et musc soyeux.",
    price: 58,
    salePrice: 48,
    sku: "KH-CND-01",
    category: "home-decor",
    subcategory: "شموع عطرية وفواحات",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80",
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=900&q=80"
    ],
    stock: 35,
    isFeatured: false,
    isBestSeller: true,
    isActive: true,
    tags: ["شموع", "فواحات", "مسك", "عطر المنزل", "ديكور"],
    rating: 4.9,
    reviewCount: 16
  },
  {
    title: "Linen Embroidered Cushions Set of 2",
    titleAr: "طقم وسائد كتان طبيعي مطرزة بلمسات البلاش روز",
    titleFr: "Duo de Coussins en Lin Brodé Rose Poudré",
    description: "Pair of plush 45x45cm decorative cushions woven from washed pure flax linen with subtle tone-on-tone embroidery and feather fill.",
    descriptionAr: "طقم وسادتين ديكوريتين من الكتان الطبيعي الفاخر بتطريزات هندسية ناعمة بلون الورد المغبر (Dusty Rose). تضفي دفئاً ورونقاً استثنائياً على غرفة المعيشة أو النوم.",
    descriptionFr: "Duo de coussins raffinés en pur lin lavé orné de délicates broderies ton sur ton.",
    price: 72,
    salePrice: 62,
    sku: "KH-CSH-01",
    category: "home-decor",
    subcategory: "وسائد ومفارش فاخرة",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&q=80"
    ],
    stock: 19,
    isFeatured: false,
    isBestSeller: false,
    isActive: true,
    tags: ["وسائد", "كتان", "مفارش", "ديكور راقي"],
    rating: 4.6,
    reviewCount: 5
  }
];

export const initialBanners = [
  {
    title: "New Spring Elegance 2026",
    titleAr: "تشكيلة ربيع 2026: أنوثة راقية وألوان دافئة",
    titleFr: "Élégance Printemps 2026 : Féminité & Couleurs Douces",
    subtitle: "Discover the newest arrivals in women's fashion and artisanal home living",
    subtitleAr: "اكتشفي أحدث إبداعات الأزياء النسائية والديكور المنزلي مع متجر K&H في تونس",
    subtitleFr: "Découvrez nos nouvelles créations exclusives pour femme et maison",
    link: "/shop",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85",
    position: "hero",
    order: 1,
    isActive: true
  },
  {
    title: "Artisanal Table & Living Collection",
    titleAr: "فن الضيافة ومائدة البيت الأنيق",
    titleFr: "Art de la Table & Maison Raffinée",
    subtitle: "Elevate everyday moments with handcrafted ceramics and brass tabletop items",
    subtitleAr: "أطقم تقديم رخامية، بورسلان مذهب ومستلزمات مطبخ تمنح منزلكِ دفئاً استثنائياً",
    subtitleFr: "Sublimez votre intérieur avec nos collections de vaisselle et décorations",
    link: "/shop?category=kitchen-tableware",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=85",
    position: "hero",
    order: 2,
    isActive: true
  }
];

export const initialCoupons = [
  {
    code: "KH10",
    discountType: "percentage",
    discountValue: 10,
    minOrder: 50,
    maxDiscount: 30,
    expirationDate: new Date('2027-12-31'),
    usageLimit: 500,
    usedCount: 14,
    isActive: true
  },
  {
    code: "WELCOME15",
    discountType: "percentage",
    discountValue: 15,
    minOrder: 80,
    maxDiscount: 45,
    expirationDate: new Date('2027-12-31'),
    usageLimit: 300,
    usedCount: 28,
    isActive: true
  },
  {
    code: "LIVRAISON",
    discountType: "free_shipping",
    discountValue: 7,
    minOrder: 60,
    expirationDate: new Date('2027-12-31'),
    usageLimit: 1000,
    usedCount: 42,
    isActive: true
  }
];

export async function seedDatabase() {
  try {
    // 1. Settings
    const existingSettings = await StoreSettings.findOne();
    if (!existingSettings) {
      await StoreSettings.create({
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
      });
      console.log('✅ Seeded StoreSettings');
    }

    // 2. Admin Users
    const adminCount = await User.countDocuments({ role: 'super_admin' });
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.create([
        {
          name: 'K&H Super Admin',
          email: 'admin@khstore.tn',
          password: hashedPassword,
          role: 'super_admin',
          phone: '+216 55 123 456',
          isActive: true
        },
        {
          name: 'Responsable Commandes',
          email: 'manager@khstore.tn',
          password: hashedPassword,
          role: 'store_manager',
          phone: '+216 55 654 321',
          isActive: true
        },
        {
          name: 'Sarah Ben Salem',
          email: 'client@khstore.tn',
          password: hashedPassword,
          role: 'customer',
          phone: '+216 98 765 432',
          addresses: [
            {
              title: 'المنزل - تونس',
              governorate: 'Tunis',
              city: 'La Marsa',
              address: 'Avenue Habib Bourguiba, Résidence Les Palmiers',
              isDefault: true
            }
          ],
          isActive: true
        }
      ]);
      console.log('✅ Seeded Admin and Customer users');
    }

    // 3. Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(initialCategories);
      console.log('✅ Seeded Categories');
    }

    // 4. Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(initialProducts);
      console.log('✅ Seeded Products');
    }

    // 5. Banners
    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      await Banner.insertMany(initialBanners);
      console.log('✅ Seeded Banners');
    }

    // 6. Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.insertMany(initialCoupons);
      console.log('✅ Seeded Coupons');
    }

    // 7. Initial Sample Orders for live Analytics
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.create([
        {
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
              productId: 'seed-1',
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
          internalNotes: 'Client VIP - Livraison rapide effectuée'
        },
        {
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
              productId: 'seed-2',
              title: 'Handmade Italian Grain Leather Tote',
              titleAr: 'حقيبة يد جلدية إيطالية فاخرة بإبزيم ذهبي',
              price: 175,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80'
            },
            {
              productId: 'seed-3',
              title: 'Royal Oud & Damask Rose Eau de Parfum',
              titleAr: 'عطر عود ملكي وورد دمشقي 100 مل',
              price: 149,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80'
            }
          ],
          subtotal: 324,
          deliveryFee: 0,
          discount: 32.4,
          couponCode: 'KH10',
          total: 291.6,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          orderStatus: 'shipped',
          internalNotes: 'Expédié avec Aramex Tunisie'
        },
        {
          orderNumber: 'KH-2026-1003',
          customerDetails: {
            fullName: 'Yasmine Mansour',
            email: 'yasmine.m@yahoo.fr',
            phone: '+216 50 888 999',
            governorate: 'Sfax',
            city: 'Sfax Ville',
            address: 'Route de Téniour Km 2'
          },
          items: [
            {
              productId: 'seed-4',
              title: 'Turkish 12-Piece Porcelain Tea & Coffee Set',
              titleAr: 'طقم شاي وقهوة تركي فاخر من البورسلان مع لمسات ذهبية',
              price: 155,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80'
            }
          ],
          subtotal: 155,
          deliveryFee: 0,
          discount: 0,
          total: 155,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          orderStatus: 'processing',
          internalNotes: 'Vérifier emballage fragile pour livraison Sfax'
        }
      ]);
      console.log('✅ Seeded Orders');
    }
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

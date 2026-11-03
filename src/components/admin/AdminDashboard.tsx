import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, FolderTree, ClipboardList, AlertTriangle, 
  Tag, Star, Mail, Settings, Plus, Search, Edit3, Trash2, CheckCircle2, 
  XCircle, Filter, Download, Printer, Sparkles, Upload, RefreshCw, Eye, ArrowLeft, Send
} from 'lucide-react';
import { useStore, ProductItem } from '../../context/StoreContext.tsx';
import { BrandLogo } from '../BrandLogo.tsx';

interface AdminDashboardProps {
  onBackToShop: () => void;
}

type AdminTab = 'overview' | 'products' | 'categories' | 'orders' | 'inventory' | 'coupons' | 'reviews' | 'email' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToShop }) => {
  const { user, language, setLanguage, formatPrice, categories, products, refreshProducts } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminLang, setAdminLang] = useState<'ar' | 'fr'>('ar');

  // Stats state from MongoDB
  const [stats, setStats] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalCustomers: 0,
    currency: 'TND',
    recentOrders: []
  });

  // Orders list state
  const [orders, setOrders] = useState<any[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Coupons state
  const [coupons, setCoupons] = useState<any[]>([]);

  // Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    titleAr: '',
    titleFr: '',
    description: '',
    descriptionAr: '',
    descriptionFr: '',
    price: 0,
    salePrice: 0,
    sku: '',
    category: 'womens-fashion',
    subcategory: '',
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'],
    stock: 10,
    isFeatured: false,
    isBestSeller: false,
    tags: [] as string[]
  });
  const [aiGenerating, setAiGenerating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Email test tool state
  const [testEmailRecipient, setTestEmailRecipient] = useState('ali.nefel2020@gmail.com');
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Store settings state
  const [storeSettings, setStoreSettings] = useState<any>({
    storeName: 'K&H Online Store',
    contactEmail: 'ali.nefel2020@gmail.com',
    phone: '+216 55 123 456',
    address: 'Les Berges du Lac 2, Tunis, Tunisia',
    deliveryFee: 7,
    freeShippingThreshold: 150
  });

  // Fetch initial admin data
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/orders/stats/summary');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const url = `/api/orders?status=${orderStatusFilter}&search=${encodeURIComponent(orderSearch)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setStoreSettings(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchOrders();
    fetchCoupons();
    fetchSettings();
  }, [orderStatusFilter]);

  // Handle Order Status Update (which automatically sends email)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchOrders();
        await fetchStats();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Gemini AI Product Description Generator
  const handleGenerateAiDescription = async () => {
    if (!productForm.title) {
      alert(adminLang === 'ar' ? 'يرجى كتابة اسم المنتج أولاً لتوليد الوصف بالذكاء الاصطناعي' : 'Veuillez saisir le titre du produit en premier');
      return;
    }

    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: productForm.title,
          category: productForm.category,
          keywords: productForm.subcategory || 'أزياء فاخرة وجودة عالية'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProductForm(prev => ({
          ...prev,
          titleAr: data.titleAr || prev.titleAr || prev.title,
          titleFr: data.titleFr || prev.titleFr || prev.title,
          descriptionAr: data.descriptionAr || prev.descriptionAr,
          descriptionFr: data.descriptionFr || prev.descriptionFr,
          description: data.descriptionEn || prev.description,
          tags: data.tags || prev.tags
        }));
      }
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  // Save / Update Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });

      if (res.ok) {
        await refreshProducts();
        await fetchStats();
        setIsProductModalOpen(false);
        setEditingProduct(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm(adminLang === 'ar' ? 'هل أنتِ متأكدة من حذف هذا المنتج؟' : 'Supprimer ce produit ?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshProducts();
        await fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Export for Orders
  const exportOrdersToCSV = () => {
    const headers = ['OrderNumber', 'Customer', 'Phone', 'Governorate', 'Total (TND)', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.orderNumber,
      `"${o.customerDetails?.fullName || ''}"`,
      `"${o.customerDetails?.phone || ''}"`,
      `"${o.customerDetails?.governorate || ''}"`,
      o.total,
      o.orderStatus,
      new Date(o.createdAt).toISOString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KH_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send Test Email
  const handleSendTestEmail = async () => {
    setEmailSending(true);
    setEmailStatusMsg(null);
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: testEmailRecipient })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStatusMsg({
          success: true,
          text: adminLang === 'ar' ? 'تم إرسال البريد التجريبي بنجاح عبر Gmail SMTP!' : 'E-mail de test envoyé avec succès via Gmail SMTP !'
        });
      } else {
        setEmailStatusMsg({
          success: false,
          text: data.error || 'Erreur lors de l\'envoi de l\'e-mail'
        });
      }
    } catch (err: any) {
      setEmailStatusMsg({ success: false, text: err.message });
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#292626] flex flex-col font-sans" dir={adminLang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* 1. Admin Header Bar */}
      <header className="bg-[#292626] text-white border-b border-[#C5A477]/40 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToShop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#FFF9F5] transition-all"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{adminLang === 'ar' ? 'العودة للمتجر' : 'Boutique'}</span>
          </button>

          <BrandLogo variant="light" size="sm" showSlogan={false} />
          
          <span className="hidden sm:inline-block text-xs font-mono bg-[#B77D83] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
            {adminLang === 'ar' ? 'لوحة تحكم الإدارة' : 'Administration'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin Language Switcher */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setAdminLang('ar')}
              className={`px-2.5 py-1 rounded-md transition-all ${adminLang === 'ar' ? 'bg-[#C5A477] text-[#292626] font-bold' : 'text-gray-300'}`}
            >
              العربية
            </button>
            <button
              onClick={() => setAdminLang('fr')}
              className={`px-2.5 py-1 rounded-md transition-all ${adminLang === 'fr' ? 'bg-[#C5A477] text-[#292626] font-bold' : 'text-gray-300'}`}
            >
              Français
            </button>
          </div>

          <div className="text-end hidden sm:block">
            <p className="text-xs font-bold text-white">{user?.name || 'K&H Admin'}</p>
            <p className="text-[10px] text-[#C5A477] uppercase font-mono">{user?.role || 'Super Admin'}</p>
          </div>
        </div>
      </header>

      {/* 2. Admin Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Nav */}
        <aside className="w-64 bg-white border-e border-[#F5E7E5] flex flex-col justify-between py-6 shrink-0 hidden md:flex shadow-xs">
          <nav className="px-3 space-y-1">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'bg-[#B77D83] text-white shadow-xs' : 'text-[#292626] hover:bg-[#FFF9F5]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{adminLang === 'ar' ? 'نظرة عامة وإحصائيات' : 'Tableau de Bord'}</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products' ? 'bg-[#B77D83] text-white shadow-xs' : 'text-[#292626] hover:bg-[#FFF9F5]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{adminLang === 'ar' ? 'إدارة المنتجات' : 'Produits'} ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders' ? 'bg-[#B77D83] text-white shadow-xs' : 'text-[#292626] hover:bg-[#FFF9F5]'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>{adminLang === 'ar' ? 'الطلبيات والمبيعات' : 'Commandes'}</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'inventory' ? 'bg-[#B77D83] text-white shadow-xs' : 'text-[#292626] hover:bg-[#FFF9F5]'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{adminLang === 'ar' ? 'المخزون والتنبيهات' : 'Inventaire'}</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'coupons' ? 'bg-[#B77D83] text-white shadow-xs' : 'text-[#292626] hover:bg-[#FFF9F5]'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>{adminLang === 'ar' ? 'كوبونات الخصم' : 'Codes Promo'}</span>
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'email' ? 'bg-[#B77D83] text-white shadow-xs' : 'text-[#292626] hover:bg-[#FFF9F5]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{adminLang === 'ar' ? 'إدارة البريد الإلكتروني' : 'Messagerie SMTP'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings' ? 'bg-[#B77D83] text-white shadow-xs' : 'text-[#292626] hover:bg-[#FFF9F5]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{adminLang === 'ar' ? 'إعدادات المتجر' : 'Paramètres'}</span>
            </button>

          </nav>

          <div className="px-5 text-xs text-gray-400">
            <p className="font-bold text-[#292626]">K&amp;H Store v2.0</p>
            <p className="text-[11px] mt-0.5">MongoDB Atlas • Express • Vite</p>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#292626]">
                    {adminLang === 'ar' ? 'ملخص أداء المتجر في تونس' : 'Vue d\'ensemble des performances'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {adminLang === 'ar' ? 'إحصائيات مباشرة ومحدثة من قاعدة بيانات MongoDB' : 'Données en direct extraites de MongoDB'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { fetchStats(); fetchOrders(); }}
                    className="px-3.5 py-2 bg-white border border-[#EADCD8] rounded-xl text-xs font-semibold hover:bg-[#FFF9F5] flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#B77D83]" />
                    <span>{adminLang === 'ar' ? 'تحديث البيانات' : 'Actualiser'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        title: '',
                        titleAr: '',
                        titleFr: '',
                        description: '',
                        descriptionAr: '',
                        descriptionFr: '',
                        price: 0,
                        salePrice: 0,
                        sku: `KH-PRD-${Math.floor(100 + Math.random() * 900)}`,
                        category: 'womens-fashion',
                        subcategory: '',
                        images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'],
                        stock: 10,
                        isFeatured: false,
                        isBestSeller: false,
                        tags: []
                      });
                      setIsProductModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#B77D83] text-white rounded-xl text-xs font-bold hover:bg-[#a66a71] flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{adminLang === 'ar' ? 'إضافة منتج جديد' : 'Nouveau Produit'}</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* Revenue Card */}
                <div className="p-5 bg-white rounded-2xl border border-[#F5E7E5] shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A7E7C] block mb-1">
                    {adminLang === 'ar' ? 'إجمالي المداخيل' : 'Chiffre d\'Affaires'}
                  </span>
                  <div className="text-2xl font-bold text-[#292626]">
                    {formatPrice(stats.totalRevenue)}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                    {adminLang === 'ar' ? 'دينار تونسي (TND)' : 'Devise : Dinars Tunisiens'}
                  </span>
                </div>

                {/* Total Orders Card */}
                <div className="p-5 bg-white rounded-2xl border border-[#F5E7E5] shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A7E7C] block mb-1">
                    {adminLang === 'ar' ? 'إجمالي الطلبيات' : 'Total Commandes'}
                  </span>
                  <div className="text-2xl font-bold text-[#B77D83]">
                    {stats.totalOrders}
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                    {stats.pendingOrders} {adminLang === 'ar' ? 'قيد المراجعة' : 'en attente'}
                  </span>
                </div>

                {/* Delivered Orders Card */}
                <div className="p-5 bg-white rounded-2xl border border-[#F5E7E5] shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A7E7C] block mb-1">
                    {adminLang === 'ar' ? 'الطلبات المسلمة' : 'Commandes Livrées'}
                  </span>
                  <div className="text-2xl font-bold text-emerald-700">
                    {stats.completedOrders}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                    {adminLang === 'ar' ? 'تم تحصيل أموالها نقداً' : 'Paiements encaissés'}
                  </span>
                </div>

                {/* Low Stock Warning Card */}
                <div className="p-5 bg-white rounded-2xl border border-[#F5E7E5] shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A7E7C] block mb-1">
                    {adminLang === 'ar' ? 'تنبيهات المخزون المنخفض' : 'Alertes Stock'}
                  </span>
                  <div className="text-2xl font-bold text-amber-600">
                    {stats.lowStockProducts}
                  </div>
                  <span className="text-[11px] text-amber-700 font-medium mt-1 block">
                    {adminLang === 'ar' ? 'منتجات تحتاج إعادة تموين' : 'Articles à réapprovisionner'}
                  </span>
                </div>

              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl border border-[#F5E7E5] p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-[#292626]">
                    {adminLang === 'ar' ? 'أحدث الطلبيات المستلمة' : 'Dernières Commandes'}
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#B77D83] hover:underline"
                  >
                    {adminLang === 'ar' ? 'عرض كافة الطلبات ←' : 'Voir tout →'}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-[#FFF9F5] text-gray-500 border-b border-[#F5E7E5]">
                      <tr>
                        <th className="py-2.5 px-3 text-start">{adminLang === 'ar' ? 'رقم الطلب' : 'Réf.'}</th>
                        <th className="py-2.5 px-3 text-start">{adminLang === 'ar' ? 'العميلة' : 'Cliente'}</th>
                        <th className="py-2.5 px-3 text-start">{adminLang === 'ar' ? 'الولاية' : 'Gouvernorat'}</th>
                        <th className="py-2.5 px-3 text-start">{adminLang === 'ar' ? 'المجموع' : 'Total'}</th>
                        <th className="py-2.5 px-3 text-start">{adminLang === 'ar' ? 'الحالة' : 'Statut'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5E7E5]">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord._id} className="hover:bg-[#FFF9F5] transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-[#292626]">#{ord.orderNumber}</td>
                          <td className="py-3 px-3 font-medium">{ord.customerDetails?.fullName}</td>
                          <td className="py-3 px-3 text-gray-600">{ord.customerDetails?.governorate}</td>
                          <td className="py-3 px-3 font-bold text-[#B77D83]">{formatPrice(ord.total)}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {ord.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#292626]">
                    {adminLang === 'ar' ? 'إدارة المنتجات والمخزون' : 'Gestion des Produits'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {products.length} {adminLang === 'ar' ? 'منتجات مسجلة في المتجر' : 'produits répertoriés'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      title: '',
                      titleAr: '',
                      titleFr: '',
                      description: '',
                      descriptionAr: '',
                      descriptionFr: '',
                      price: 0,
                      salePrice: 0,
                      sku: `KH-PRD-${Math.floor(100 + Math.random() * 900)}`,
                      category: 'womens-fashion',
                      subcategory: '',
                      images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'],
                      stock: 10,
                      isFeatured: false,
                      isBestSeller: false,
                      tags: []
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#B77D83] hover:bg-[#a66a71] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{adminLang === 'ar' ? 'إضافة منتج جديد' : 'Ajouter un Produit'}</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-[#F5E7E5] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-[#FFF9F5] text-gray-500 border-b border-[#F5E7E5]">
                      <tr>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'الصورة' : 'Image'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'المنتج' : 'Titre'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'الرمز SKU' : 'SKU'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'القسم' : 'Catégorie'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'السعر (د.ت)' : 'Prix'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'المخزون' : 'Stock'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5E7E5]">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-[#FFF9F5] transition-colors">
                          <td className="py-2.5 px-4">
                            <img 
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80'} 
                              alt="" 
                              className="w-10 h-12 object-cover rounded-md border border-[#F5E7E5]" 
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <p className="font-bold text-[#292626] line-clamp-1">{p.titleAr || p.title}</p>
                            <p className="text-[11px] text-gray-400">{p.title}</p>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-semibold text-gray-600">{p.sku}</td>
                          <td className="py-2.5 px-4 text-gray-600">{p.category}</td>
                          <td className="py-2.5 px-4 font-bold text-[#B77D83]">{formatPrice(p.salePrice || p.price)}</td>
                          <td className="py-2.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              p.stock <= 3 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductForm({
                                    title: p.title,
                                    titleAr: p.titleAr,
                                    titleFr: p.titleFr || '',
                                    description: p.description,
                                    descriptionAr: p.descriptionAr,
                                    descriptionFr: p.descriptionFr || '',
                                    price: p.price,
                                    salePrice: p.salePrice || 0,
                                    sku: p.sku,
                                    category: p.category,
                                    subcategory: p.subcategory || '',
                                    images: p.images || [],
                                    stock: p.stock,
                                    isFeatured: p.isFeatured,
                                    isBestSeller: p.isBestSeller,
                                    tags: p.tags || []
                                  });
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 text-gray-500 hover:text-[#B77D83] hover:bg-[#F5E7E5] rounded-md transition-all"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#292626]">
                    {adminLang === 'ar' ? 'سجل الطلبيات والشحن' : 'Commandes Clients'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {orders.length} {adminLang === 'ar' ? 'طلبيات مسجلة' : 'commandes au total'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={exportOrdersToCSV}
                    className="px-3.5 py-2 bg-white border border-[#EADCD8] rounded-xl text-xs font-semibold hover:bg-[#FFF9F5] flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#B77D83]" />
                    <span>{adminLang === 'ar' ? 'تصدير كملف CSV' : 'Exporter CSV'}</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 text-xs">
                {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all capitalize ${
                      orderStatusFilter === st
                        ? 'bg-[#292626] text-white shadow-xs'
                        : 'bg-white text-gray-600 hover:bg-[#F5E7E5] border border-[#EADCD8]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-[#F5E7E5] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-[#FFF9F5] text-gray-500 border-b border-[#F5E7E5]">
                      <tr>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'رقم الطلب' : 'N° Commande'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'العميلة' : 'Cliente'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'الهاتف' : 'Téléphone'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'الولاية / المدينة' : 'Gouvernorat'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'المجموع' : 'Total'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'حالة الطلب' : 'Statut'}</th>
                        <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'تحديث الحالة' : 'Modifier'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5E7E5]">
                      {orders.map((ord) => (
                        <tr key={ord._id} className="hover:bg-[#FFF9F5] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#292626]">#{ord.orderNumber}</td>
                          <td className="py-3 px-4 font-medium">{ord.customerDetails?.fullName}</td>
                          <td className="py-3 px-4 font-mono text-gray-600">{ord.customerDetails?.phone}</td>
                          <td className="py-3 px-4 text-gray-600">{ord.customerDetails?.governorate} ({ord.customerDetails?.city})</td>
                          <td className="py-3 px-4 font-bold text-[#B77D83]">{formatPrice(ord.total)}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                              className="bg-[#FFF9F5] border border-[#EADCD8] rounded-md px-2 py-1 text-[11px] font-semibold outline-none focus:border-[#B77D83]"
                            >
                              <option value="pending">Pending (قيد المراجعة)</option>
                              <option value="confirmed">Confirmed (مؤكد)</option>
                              <option value="processing">Processing (قيد التجهيز)</option>
                              <option value="shipped">Shipped (تم الشحن)</option>
                              <option value="delivered">Delivered (تم التسليم)</option>
                              <option value="cancelled">Cancelled (ملغي)</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-serif text-[#292626]">
                {adminLang === 'ar' ? 'مراقبة وإدارة المخزون' : 'Gestion de l\'Inventaire'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  <p className="font-bold mb-1">
                    {adminLang === 'ar' ? 'تنبيه النقص في المخزون:' : 'Alerte Stock Faible :'}
                  </p>
                  <p>
                    {adminLang === 'ar'
                      ? 'المنتجات التي تحتوي على 3 قطع أو أقل يتم تمييزها باللون البرتقالي لإعادة الطلب الفوري.'
                      : 'Les articles dont le stock est inférieur ou égal à 3 sont surveillés pour réapprovisionnement.'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#F5E7E5] overflow-hidden shadow-xs">
                <table className="w-full text-xs text-start">
                  <thead className="bg-[#FFF9F5] text-gray-500 border-b border-[#F5E7E5]">
                    <tr>
                      <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'المنتج' : 'Article'}</th>
                      <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'الرمز' : 'SKU'}</th>
                      <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'الكمية المتوفرة' : 'Stock'}</th>
                      <th className="py-3 px-4 text-start">{adminLang === 'ar' ? 'الحالة' : 'État'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5E7E5]">
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td className="py-2.5 px-4 font-bold text-[#292626]">{p.titleAr || p.title}</td>
                        <td className="py-2.5 px-4 font-mono">{p.sku}</td>
                        <td className="py-2.5 px-4 font-bold">{p.stock}</td>
                        <td className="py-2.5 px-4">
                          {p.stock <= 3 ? (
                            <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
                              {adminLang === 'ar' ? 'مخزون حرج' : 'Critique'}
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                              {adminLang === 'ar' ? 'متوفر' : 'Normal'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-serif text-[#292626]">
                  {adminLang === 'ar' ? 'إدارة كوبونات وأكواد الخصم' : 'Codes Promotionnels'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((cp) => (
                  <div key={cp._id || cp.code} className="p-4 bg-white rounded-xl border border-[#F5E7E5] shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-base font-bold text-[#B77D83] bg-[#F5E7E5] px-2.5 py-0.5 rounded-md">
                        {cp.code}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {cp.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-[#292626] font-semibold mt-1">
                      {cp.discountType === 'percentage' && `${cp.discountValue}% ${adminLang === 'ar' ? 'خصم على الطلب' : 'de réduction'}`}
                      {cp.discountType === 'free_shipping' && (adminLang === 'ar' ? 'توصيل مجاني' : 'Livraison Gratuite')}
                      {cp.discountType === 'fixed' && `${cp.discountValue} TND ${adminLang === 'ar' ? 'خصم ثابت' : 'de remise fixe'}`}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {adminLang === 'ar' ? `الحد الأدنى: ${cp.minOrder || 0} د.ت` : `Minimum : ${cp.minOrder || 0} DT`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: EMAIL SERVICE */}
          {activeTab === 'email' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#292626]">
                  {adminLang === 'ar' ? 'خادم البريد الإلكتروني (Gmail SMTP)' : 'Configuration Email SMTP'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {adminLang === 'ar' ? 'إرسال تأكيدات الطلب وتحديثات الشحن لعملاء K&H' : 'Notifications automatiques envoyées par Gmail'}
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#F5E7E5] space-y-4 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7E7C]">
                  {adminLang === 'ar' ? 'اختبار إرسال بريد إلكتروني فوري' : 'Tester la connexion SMTP'}
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#292626] mb-1">
                    {adminLang === 'ar' ? 'البريد الإلكتروني المستلم:' : 'Destinataire test :'}
                  </label>
                  <input
                    type="email"
                    value={testEmailRecipient}
                    onChange={(e) => setTestEmailRecipient(e.target.value)}
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3.5 py-2 text-xs outline-none focus:border-[#B77D83]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={emailSending}
                  className="px-5 py-2.5 bg-[#292626] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[#C5A477] rtl:rotate-180" />
                  <span>{emailSending ? '...' : (adminLang === 'ar' ? 'إرسال بريد تجريبي الآن' : 'Envoyer un email test')}</span>
                </button>

                {emailStatusMsg && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${
                    emailStatusMsg.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {emailStatusMsg.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-bold font-serif text-[#292626]">
                {adminLang === 'ar' ? 'إعدادات متجر K&H' : 'Paramètres de la Boutique'}
              </h2>

              <div className="p-6 bg-white rounded-2xl border border-[#F5E7E5] space-y-4 shadow-xs">
                <div>
                  <label className="block text-xs font-semibold text-[#292626] mb-1">
                    {adminLang === 'ar' ? 'اسم المتجر:' : 'Nom de la boutique :'}
                  </label>
                  <input
                    type="text"
                    value={storeSettings.storeName || 'K&H Online Store'}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#292626] mb-1">
                      {adminLang === 'ar' ? 'رسوم التوصيل (د.ت):' : 'Frais de port (DT) :'}
                    </label>
                    <input
                      type="number"
                      value={storeSettings.deliveryFee || 7}
                      onChange={(e) => setStoreSettings({ ...storeSettings, deliveryFee: Number(e.target.value) })}
                      className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#292626] mb-1">
                      {adminLang === 'ar' ? 'حد التوصيل المجاني (د.ت):' : 'Seuil livraison offerte :'}
                    </label>
                    <input
                      type="number"
                      value={storeSettings.freeShippingThreshold || 150}
                      onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292626] mb-1">
                    {adminLang === 'ar' ? 'العنوان في تونس:' : 'Adresse physique :'}
                  </label>
                  <input
                    type="text"
                    value={storeSettings.address || 'Les Berges du Lac 2, Tunis'}
                    onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await fetch('/api/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(storeSettings)
                    });
                    alert(adminLang === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Paramètres enregistrés');
                  }}
                  className="px-6 py-2.5 bg-[#B77D83] text-white rounded-xl text-xs font-bold hover:bg-[#a66a71] transition-all"
                >
                  {adminLang === 'ar' ? 'حفظ الإعدادات' : 'Enregistrer'}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Product Create / Edit Modal with Gemini AI Generator */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#F5E7E5] p-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#F5E7E5] mb-4">
              <h3 className="font-bold text-base text-[#292626] font-serif">
                {editingProduct ? (adminLang === 'ar' ? 'تعديل المنتج' : 'Modifier le Produit') : (adminLang === 'ar' ? 'إضافة منتج جديد' : 'Nouveau Produit')}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* AI Auto-Generate Button */}
              <div className="p-3 bg-[#FFF9F5] rounded-xl border border-[#C5A477]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A477]" />
                  <span className="font-bold text-[#292626]">
                    {adminLang === 'ar' ? 'مساعد الذكاء الاصطناعي (Gemini AI)' : 'Assistant Rédaction Gemini AI'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAiDescription}
                  disabled={aiGenerating}
                  className="px-3.5 py-1.5 bg-[#292626] hover:bg-black text-[#C5A477] font-bold rounded-lg transition-all"
                >
                  {aiGenerating ? '...' : (adminLang === 'ar' ? 'توليد الوصف والترجمة تلقائياً ✨' : 'Générer avec l\'IA ✨')}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">اسم المنتج بالفرنسية / الإنجليزية *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    placeholder="Silk Embroidered Kaftan"
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 outline-none focus:border-[#B77D83]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">اسم المنتج بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={productForm.titleAr}
                    onChange={(e) => setProductForm({ ...productForm, titleAr: e.target.value })}
                    placeholder="قفطان حريري مطرز"
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 outline-none focus:border-[#B77D83]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">الرمز SKU *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value.toUpperCase() })}
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 font-mono outline-none focus:border-[#B77D83]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">القسم *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.nameAr || c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">السعر الأصلي (د.ت) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">سعر التخفيض (اختياري)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">كمية المخزون *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">رابط صورة المنتج (URL)</label>
                  <input
                    type="url"
                    value={productForm.images[0] || ''}
                    onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                    className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">الوصف بالعربية</label>
                <textarea
                  rows={3}
                  value={productForm.descriptionAr}
                  onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })}
                  className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg px-3 py-2 outline-none focus:border-[#B77D83]"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-[#B77D83]"
                  />
                  <span>منتج مميز (Featured)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    className="rounded text-[#B77D83]"
                  />
                  <span>الأكثر مبيعاً (Best Seller)</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#B77D83] text-white font-bold rounded-xl hover:bg-[#a66a71] transition-all text-xs"
              >
                {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج إلى المتجر'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

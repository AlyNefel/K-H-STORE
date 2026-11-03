import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Heart, User, Globe, Menu, X, ShieldCheck, Sparkles, ChevronDown, LogOut, LayoutDashboard 
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { BrandLogo } from './BrandLogo.tsx';

interface HeaderProps {
  onNavigateToAdmin?: () => void;
  isAdminView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToAdmin, isAdminView = false }) => {
  const { 
    language, 
    setLanguage, 
    t, 
    cart, 
    wishlist, 
    user, 
    logout, 
    setIsCartOpen, 
    setIsAuthOpen, 
    setIsAccountOpen, 
    categories, 
    activeCategoryFilter, 
    setActiveCategoryFilter,
    searchQuery,
    setSearchQuery,
    products,
    setQuickViewProduct
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Live search suggestions
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.titleAr.includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
        );
      }).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50 bg-[#FFF9F5]/95 backdrop-blur-md border-b border-[#F5E7E5] shadow-xs transition-all">
      {/* 1. Announcement Bar */}
      <div className="bg-[#292626] text-[#FFF9F5] py-2 px-4 text-xs font-medium text-center flex items-center justify-center gap-2 border-b border-[#C5A477]/40">
        <Sparkles className="w-3.5 h-3.5 text-[#C5A477] animate-pulse" />
        <span>{t('announcement')}</span>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile hamburger button */}
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#292626] hover:text-[#B77D83] focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Official Brand Logo */}
          <div 
            onClick={() => {
              setActiveCategoryFilter('all');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer py-1"
          >
            <BrandLogo variant="dark" size="md" showSlogan={true} />
          </div>

          {/* Center Search Bar with Live Autocomplete */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-white text-sm text-[#292626] placeholder-[#8A7E7C] pl-10 pr-10 py-2.5 rounded-full border border-[#EADCD8] focus:border-[#B77D83] focus:ring-2 focus:ring-[#B77D83]/20 shadow-xs outline-none transition-all"
              />
              <Search className="w-4 h-4 text-[#8A7E7C] absolute start-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-[#F5E7E5] overflow-hidden z-50">
                <div className="p-2 text-xs font-semibold text-[#8A7E7C] bg-[#FFF9F5] border-b border-[#F5E7E5]">
                  {language === 'ar' ? 'نتائج البحث السريع' : 'Résultats de recherche'}
                </div>
                <div className="divide-y divide-[#F5E7E5]">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => {
                        setQuickViewProduct(product);
                        setIsSearchFocused(false);
                      }}
                      className="p-3 flex items-center gap-3 hover:bg-[#FFF9F5] cursor-pointer transition-colors"
                    >
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-10 h-10 object-cover rounded-md border border-[#F5E7E5]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#292626] truncate">
                          {language === 'ar' ? product.titleAr : product.title}
                        </p>
                        <p className="text-xs text-[#B77D83] font-semibold">
                          {(product.salePrice || product.price).toFixed(2)} د.ت
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons (Language, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#292626] hover:bg-[#F5E7E5] border border-transparent hover:border-[#EADCD8] transition-all"
                title="Change language"
              >
                <Globe className="w-4 h-4 text-[#C5A477]" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {isLangMenuOpen && (
                <div 
                  className="absolute end-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-[#F5E7E5] py-1 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setIsLangMenuOpen(false)}
                >
                  <button
                    onClick={() => { setLanguage('ar'); setIsLangMenuOpen(false); }}
                    className={`w-full text-start px-4 py-2 text-xs flex items-center justify-between hover:bg-[#FFF9F5] ${language === 'ar' ? 'font-bold text-[#B77D83]' : 'text-[#292626]'}`}
                  >
                    <span>العربية (تونس)</span>
                    {language === 'ar' && '✓'}
                  </button>
                  <button
                    onClick={() => { setLanguage('fr'); setIsLangMenuOpen(false); }}
                    className={`w-full text-start px-4 py-2 text-xs flex items-center justify-between hover:bg-[#FFF9F5] ${language === 'fr' ? 'font-bold text-[#B77D83]' : 'text-[#292626]'}`}
                  >
                    <span>Français</span>
                    {language === 'fr' && '✓'}
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                    className={`w-full text-start px-4 py-2 text-xs flex items-center justify-between hover:bg-[#FFF9F5] ${language === 'en' ? 'font-bold text-[#B77D83]' : 'text-[#292626]'}`}
                  >
                    <span>English</span>
                    {language === 'en' && '✓'}
                  </button>
                </div>
              )}
            </div>

            {/* Admin Quick Switch (if authenticated as admin or available) */}
            {onNavigateToAdmin && (
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#292626] text-[#C5A477] hover:bg-black transition-all shadow-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{isAdminView ? t('shop') : t('adminDashboard')}</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => {
                // If has items, filter products
                if (wishlist.length > 0) {
                  setActiveCategoryFilter('wishlist');
                } else {
                  alert(language === 'ar' ? 'قائمة الرغبات فارغة حالياً' : 'Votre liste de favoris est vide');
                }
              }}
              className="relative p-2 text-[#292626] hover:text-[#B77D83] hover:bg-[#F5E7E5] rounded-full transition-all"
              title={t('wishlist')}
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#B77D83] text-[#B77D83]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -end-1 w-5 h-5 bg-[#B77D83] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Login Button */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#F5E7E5] text-[#292626] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#B77D83] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {user.name.charAt(0)}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div 
                      className="absolute end-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#F5E7E5] py-2 z-50 animate-in fade-in"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-[#F5E7E5]">
                        <p className="text-xs text-gray-500">{t('myAccount')}</p>
                        <p className="text-sm font-bold text-[#292626] truncate">{user.name}</p>
                        <p className="text-[10px] text-[#B77D83] uppercase tracking-wider">{user.role}</p>
                      </div>
                      <button
                        onClick={() => { setIsAccountOpen(true); setIsUserMenuOpen(false); }}
                        className="w-full text-start px-4 py-2 text-xs text-[#292626] hover:bg-[#FFF9F5] flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-[#8A7E7C]" />
                        <span>{t('myOrders')}</span>
                      </button>
                      {onNavigateToAdmin && (user.role === 'super_admin' || user.role === 'admin' || user.role === 'store_manager') && (
                        <button
                          onClick={() => { onNavigateToAdmin(); setIsUserMenuOpen(false); }}
                          className="w-full text-start px-4 py-2 text-xs text-[#C5A477] font-semibold hover:bg-[#FFF9F5] flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#C5A477]" />
                          <span>{t('adminDashboard')}</span>
                        </button>
                      )}
                      <div className="border-t border-[#F5E7E5] my-1"></div>
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full text-start px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#292626] hover:bg-[#F5E7E5] transition-all"
                >
                  <User className="w-4 h-4 text-[#8A7E7C]" />
                  <span className="hidden sm:inline">{t('login')}</span>
                </button>
              )}
            </div>

            {/* Shopping Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#B77D83] hover:bg-[#a66a71] text-white px-3.5 py-2 rounded-full font-medium shadow-sm transition-all duration-200"
              title={t('cart')}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold">{totalCartCount}</span>
            </button>

          </div>
        </div>
      </div>

      {/* 3. Category Navigation Strip */}
      <nav className="hidden lg:block border-t border-[#F5E7E5] bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-8 py-2.5 text-xs font-semibold tracking-wide text-[#292626]">
            <li>
              <button
                onClick={() => { setActiveCategoryFilter('all'); setSearchQuery(''); }}
                className={`py-1 hover:text-[#B77D83] transition-colors relative ${
                  activeCategoryFilter === 'all' && !searchQuery ? 'text-[#B77D83] font-bold after:content-[""] after:absolute after:bottom-0 after:start-0 after:end-0 after:h-0.5 after:bg-[#B77D83]' : ''
                }`}
              >
                {t('allCategories')}
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug || cat._id}>
                <button
                  onClick={() => { setActiveCategoryFilter(cat.slug); setSearchQuery(''); }}
                  className={`py-1 hover:text-[#B77D83] transition-colors relative ${
                    activeCategoryFilter === cat.slug ? 'text-[#B77D83] font-bold after:content-[""] after:absolute after:bottom-0 after:start-0 after:end-0 after:h-0.5 after:bg-[#B77D83]' : ''
                  }`}
                >
                  {language === 'ar' ? cat.nameAr : (language === 'fr' ? (cat.nameFr || cat.name) : cat.name)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Full-Screen High Z-Index Mobile Drawer Menu (Never Hidden by Slides) */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[100] bg-[#FFF9F5] flex flex-col overflow-hidden animate-in fade-in duration-200"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Top Bar with Brand Logo and Close Button */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5E7E5] bg-white/90 backdrop-blur-md">
            <div 
              onClick={() => {
                setActiveCategoryFilter('all');
                setSearchQuery('');
                setIsMobileMenuOpen(false);
              }}
              className="cursor-pointer"
            >
              <BrandLogo variant="dark" size="sm" showSlogan={false} />
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-[#F5E7E5] text-[#292626] hover:bg-[#B77D83] hover:text-white flex items-center justify-center transition-all shadow-xs"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-white text-sm text-[#292626] ps-10 pe-10 py-3 rounded-2xl border border-[#EADCD8] shadow-xs outline-none focus:border-[#B77D83]"
              />
              <Search className="w-4 h-4 text-[#8A7E7C] absolute start-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Actions (Wishlist & Cart) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCategoryFilter('wishlist');
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white rounded-xl border border-[#F5E7E5] text-xs font-semibold text-[#292626]"
              >
                <Heart className="w-4 h-4 text-[#B77D83]" />
                <span>{t('wishlist')} ({wishlist.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#B77D83] text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('cart')} ({totalCartCount})</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="p-3 bg-white rounded-2xl border border-[#F5E7E5]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A7E7C] mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#C5A477]" />
                <span>{language === 'ar' ? 'اللغة' : (language === 'fr' ? 'Langue' : 'Language')}</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'ar', label: 'العربية' },
                  { code: 'fr', label: 'Français' },
                  { code: 'en', label: 'English' }
                ].map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code as any)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      language === lang.code 
                        ? 'bg-[#292626] text-[#FFF9F5] border-[#292626]' 
                        : 'bg-[#FFF9F5] text-[#292626] border-[#EADCD8] hover:border-[#B77D83]'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Navigation */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B77D83] mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('categories')}</span>
              </p>
              
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategoryFilter('all');
                    setSearchQuery('');
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full text-start px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between transition-colors ${
                    activeCategoryFilter === 'all' && !searchQuery
                      ? 'bg-[#B77D83] text-white font-bold'
                      : 'bg-white hover:bg-[#F5E7E5] text-[#292626]'
                  }`}
                >
                  <span>{t('allCategories')}</span>
                  <span className="text-xs opacity-75">{products.length}</span>
                </button>

                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat.slug).length;
                  const isActive = activeCategoryFilter === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => {
                        setActiveCategoryFilter(cat.slug);
                        setSearchQuery('');
                        setIsMobileMenuOpen(false);
                        const el = document.getElementById('catalog-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full text-start px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between transition-colors ${
                        isActive
                          ? 'bg-[#B77D83] text-white font-bold'
                          : 'bg-white hover:bg-[#F5E7E5] text-[#292626]'
                      }`}
                    >
                      <span>
                        {language === 'ar' ? cat.nameAr : (language === 'fr' ? (cat.nameFr || cat.name) : cat.name)}
                      </span>
                      <span className="text-xs opacity-75">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Dashboard Navigation */}
            {onNavigateToAdmin && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToAdmin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 px-4 bg-[#292626] text-[#C5A477] rounded-xl text-center font-bold text-xs tracking-wider uppercase border border-[#C5A477]/40 shadow-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAdminView ? t('shop') : t('adminDashboard')}</span>
                </button>
              </div>
            )}

            {/* Delivery Reassurance Note */}
            <div className="p-4 rounded-xl bg-[#F5E7E5]/60 text-center text-xs text-[#8A7E7C]">
              <p className="font-semibold text-[#292626] mb-1">
                {language === 'ar' ? 'توصيل سريع لكافة ولايات تونس' : 'Livraison rapide partout en Tunisie'}
              </p>
              <p className="text-[11px]">
                {language === 'ar' ? 'الدفع نقداً عند استلام الطرد' : 'Paiement en espèces à la livraison (COD)'}
              </p>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

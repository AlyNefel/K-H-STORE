import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { BrandLogo } from './BrandLogo.tsx';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, login, register, language, t } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Erreur de connexion');
      }
    } else {
      const res = await register(name, email, password, phone);
      if (!res.success) {
        setError(res.error || 'Erreur lors de la création du compte');
      }
    }

    setLoading(false);
  };

  const handleQuickLogin = async (asRole: 'admin' | 'manager' | 'customer') => {
    setError('');
    setLoading(true);
    if (asRole === 'admin') {
      await login('admin@khstore.tn', 'admin123');
    } else if (asRole === 'manager') {
      await login('manager@khstore.tn', 'manager123');
    } else {
      await login('client@khstore.tn', 'client123');
    }
    setLoading(false);
  };

  if (!isAuthOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#F5E7E5] overflow-hidden my-6 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 end-4 p-1.5 rounded-full hover:bg-[#F5E7E5] text-gray-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo variant="dark" size="sm" showSlogan={false} />
          </div>
          <h2 className="text-xl font-bold text-[#292626] font-serif">
            {mode === 'login' ? t('login') : t('register')}
          </h2>
          <p className="text-xs text-[#8A7E7C] mt-1">
            {language === 'ar' ? 'أهلاً بكِ في عالم K&H للتسوق الفاخر' : 'Bienvenue dans l\'univers K&H'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#292626] mb-1">
                {t('fullName')} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Sarah Ben Salem"
                  className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83]"
                />
                <User className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#292626] mb-1">
              {t('email')} *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@gmail.com"
                className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#292626] mb-1">
                {t('phoneNumber')}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+216 55 123 456"
                  className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83]"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#292626] mb-1">
              {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'} *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FFF9F5] border border-[#EADCD8] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#292626] outline-none focus:border-[#B77D83]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#B77D83] hover:bg-[#a66a71] text-white rounded-xl font-bold text-xs shadow-md transition-all mt-2"
          >
            {loading ? '...' : (mode === 'login' ? t('login') : t('register'))}
          </button>
        </form>

        {/* Switch mode */}
        <div className="text-center mt-4 pt-4 border-t border-[#F5E7E5]">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-xs text-[#B77D83] font-semibold hover:underline"
          >
            {mode === 'login' 
              ? (language === 'ar' ? 'ليس لديكِ حساب؟ أنشئي حسابكِ الآن' : 'Pas de compte ? Inscrivez-vous')
              : (language === 'ar' ? 'لديكِ حساب بالفعل؟ تسجيل الدخول' : 'Déjà un compte ? Connectez-vous')}
          </button>
        </div>

        {/* Quick Demo Access Shortcut */}
        <div className="mt-6 p-3 bg-[#FFF9F5] rounded-xl border border-[#F5E7E5]">
          <p className="text-[11px] font-bold text-[#8A7E7C] mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C5A477]" />
            <span>{language === 'ar' ? 'تسجيل دخول سريع للتجربة:' : 'Accès rapide démo :'}</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="px-2.5 py-1.5 bg-[#292626] text-[#C5A477] rounded-lg text-[10px] font-bold hover:bg-black transition-all"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="px-2.5 py-1.5 bg-white text-[#292626] border border-[#EADCD8] rounded-lg text-[10px] font-bold hover:bg-[#F5E7E5] transition-all"
            >
              Client (Sarah)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

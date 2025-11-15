import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { Menu, X, ShoppingBag, User, LogOut, Settings, Package, ChefHat, Truck, QrCode, BarChart3, Presentation, Calendar } from 'lucide-react';
import ExxquemaLogo from './Logo';

const Header = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, getTotalItems } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    router.push('/');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isAdminRoute = router.pathname.startsWith('/admin');
  const totalItems = getTotalItems();

  const navItems = [
    { label: 'Início', href: '/', active: router.pathname === '/' },
    { label: 'Nossa História', href: '/historia', active: router.pathname === '/historia' },
    { label: 'Conceito', href: '/conceito', active: router.pathname === '/conceito' },
    { label: 'Cardápio', href: '/cardapio', active: router.pathname === '/cardapio' },
    { label: 'Programação', href: '/programacao', active: router.pathname === '/programacao' },
    ...(isAuthenticated ? [
      { label: 'Meus Pedidos', href: '/pedidos', active: router.pathname === '/pedidos' },
    ] : []),
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-lg border-b border-gray-800' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <ExxquemaLogo size={50} supreme={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-orange-400 ${
                  item.active ? 'text-orange-400' : 'text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {!isAdminRoute && (
              <Link href="/carrinho" className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.nome?.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user?.nome}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      
                      <Link
                        href="/perfil"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Meu Perfil
                      </Link>
                      
                      <Link
                        href="/pedidos"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Package className="w-4 h-4 mr-3" />
                        Meus Pedidos
                      </Link>

                      {/* Admin Links */}
                      {user?.role === 'admin' && (
                        <>
                          <div className="border-t border-gray-700 my-1" />
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <BarChart3 className="w-4 h-4 mr-3" />
                            Painel Admin
                          </Link>
                          <Link
                            href="/apresentacao"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Presentation className="w-4 h-4 mr-3" />
                            Apresentação
                          </Link>
                          <Link
                            href="/roadmap"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Calendar className="w-4 h-4 mr-3" />
                            Roadmap
                          </Link>
                          <Link
                            href="/qr-codes"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <QrCode className="w-4 h-4 mr-3" />
                            QR Codes
                          </Link>
                          <Link
                            href="/atendente"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Truck className="w-4 h-4 mr-3" />
                            Painel Atendente
                          </Link>
                          <Link
                            href="/cozinha"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <ChefHat className="w-4 h-4 mr-3" />
                            Painel Cozinha
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-700 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-orange-400 hover:bg-gray-800"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sair
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
              >
                Entrar
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-gray-900 border-t border-gray-700 relative z-50"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`block text-base font-medium transition-colors hover:text-orange-400 ${
                    item.active ? 'text-orange-400' : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-center px-4 py-3 rounded-lg font-medium transition-all shadow-lg shadow-orange-500/30"
                >
                  Entrar
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Backdrop for profile menu */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;
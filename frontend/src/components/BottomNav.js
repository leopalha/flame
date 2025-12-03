/**
 * FLAME - BottomNav Component
 *
 * Navegacao mobile fixa no rodape
 * Design System: Magenta (#FF006E) -> Cyan (#00D4FF)
 */
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { Home, UtensilsCrossed, ShoppingBag, User, ClipboardList } from 'lucide-react';

const BottomNav = () => {
  const router = useRouter();
  const { getTotalItems } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const totalItems = getTotalItems();

  const navItems = [
    {
      label: 'Inicio',
      href: '/',
      icon: Home,
    },
    {
      label: 'Cardapio',
      href: '/cardapio',
      icon: UtensilsCrossed,
    },
    {
      label: 'Carrinho',
      href: '/carrinho',
      icon: ShoppingBag,
      badge: totalItems > 0 ? totalItems : null,
    },
    {
      label: 'Pedidos',
      href: '/pedidos',
      icon: ClipboardList,
      requiresAuth: true,
    },
    {
      label: 'Perfil',
      href: isAuthenticated ? '/perfil' : '/login',
      icon: User,
    },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          // Skip items that require auth if not authenticated
          if (item.requiresAuth && !isAuthenticated) {
            return null;
          }

          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 w-12 h-1 bg-gradient-to-r from-magenta-500 to-cyan-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Icon container */}
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    active
                      ? 'text-transparent'
                      : 'text-neutral-500'
                  }`}
                  style={active ? {
                    stroke: 'url(#flameGradientNav)',
                  } : {}}
                />

                {/* Badge for cart */}
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-gradient-to-r from-magenta-500 to-cyan-500 text-white text-xs rounded-full flex items-center justify-center font-medium px-1"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.span>
                )}

                {/* Gradient icon for active state */}
                {active && (
                  <svg className="absolute inset-0 w-6 h-6" style={{ pointerEvents: 'none' }}>
                    <defs>
                      <linearGradient id="flameGradientNav" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF006E" />
                        <stop offset="100%" stopColor="#00D4FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs mt-1 font-medium transition-colors ${
                  active
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-magenta-500 to-cyan-500'
                    : 'text-neutral-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* SVG Gradient Definition (hidden) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="flameGradientNavIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF006E" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
      </svg>
    </nav>
  );
};

export default BottomNav;

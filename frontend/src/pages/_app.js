import '../styles/globals.css';
import '../styles/components.css';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import Script from 'next/script';
import ServiceWorkerUpdater from '../components/ServiceWorkerUpdater';
import ErrorBoundary from '../components/ErrorBoundary';

import { Inter, Montserrat, Bebas_Neue } from 'next/font/google';

// Fontes FLAME
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  weight: '400',
});

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);
  const applyTheme = useThemeStore((state) => state.applyTheme);

  useEffect(() => {
    setIsClient(true);
    // Aplicar tema salvo ao carregar
    applyTheme();
  }, [applyTheme]);

  return (
    <ErrorBoundary>
      <div className={`${inter.variable} ${montserrat.variable} ${bebasNeue.variable} font-sans`}>
        {/* Service Worker Updater */}
        <ServiceWorkerUpdater />

        {/* Google Identity Services SDK */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          async
          defer
        />

        <Component {...pageProps} />
        <Toaster
          position="top-right"
          containerStyle={{
            top: 100, // Abaixo do header (100px para nunca sobrepor)
            zIndex: 9999,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#141414',
              color: '#fff',
              border: '1px solid #262626',
              borderRadius: '16px',
            },
            success: {
              style: {
                border: '1px solid #10b981',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                border: '1px solid #ef4444',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default MyApp;

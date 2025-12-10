import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Meta Tags */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* PWA */}
        <meta name="application-name" content="FLAME" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FLAME" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Theme Color */}
        <meta name="theme-color" content="#FF006E" />
        <meta name="msapplication-TileColor" content="#FF006E" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Favicons - usando logo-flame.png */}
        <link rel="icon" type="image/png" href="/logo-flame.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo-flame.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo-flame.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" type="image/png" href="/logo-flame.png" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-167x167.png" />
        
        {/* Splash Screens - iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/splash-2048x2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        
        {/* Google Fonts - Inter, Montserrat, Bebas Neue */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Google Identity Services - Preconnect */}
        <link rel="preconnect" href="https://accounts.google.com" />
      </Head>
      <body className="antialiased">
        {/* Script de emergencia - limpa SW corrompido ANTES do React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var host = window.location.hostname;
                  var isProduction = host !== 'localhost' && host !== '127.0.0.1';
                  var needsCleanup = sessionStorage.getItem('swCleanupNeeded') === 'true';

                  // Se detectou erro de localhost anteriormente, limpar agora
                  if (needsCleanup) {
                    console.log('FLAME: Executando limpeza de emergencia...');
                    sessionStorage.removeItem('swCleanupNeeded');

                    // Limpar caches
                    if ('caches' in window) {
                      caches.keys().then(function(names) {
                        names.forEach(function(name) { caches.delete(name); });
                      });
                    }

                    // Desregistrar SWs
                    if ('serviceWorker' in navigator) {
                      navigator.serviceWorker.getRegistrations().then(function(regs) {
                        regs.forEach(function(reg) { reg.unregister(); });
                      });
                    }

                    // Limpar storage
                    try { localStorage.clear(); } catch(e) {}
                    
                    // Recarregar limpo
                    setTimeout(function() { window.location.reload(true); }, 200);
                    return;
                  }

                  // Listener para detectar erros de localhost em producao
                  if (isProduction) {
                    window.addEventListener('error', function(e) {
                      if (e.target && e.target.src && e.target.src.includes('localhost')) {
                        console.log('FLAME: Erro localhost detectado, marcando para limpeza');
                        sessionStorage.setItem('swCleanupNeeded', 'true');
                        window.location.reload();
                      }
                    }, true);
                  }
                } catch(e) { console.error('FLAME emergency script error:', e); }
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

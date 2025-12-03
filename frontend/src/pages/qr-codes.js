import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { QrCode, Download, Printer, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function QRCodes() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [selectedTable, setSelectedTable] = useState(null);

  // Protect route - only admin
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login como admin para acessar');
      router.push('/login?returnTo=/qr-codes');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      toast.error('Acesso negado. Apenas administradores.');
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Generate 10 tables
  const tables = Array.from({ length: 10 }, (_, i) => i + 1);

  // Get base URL
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}`
    : 'http://localhost:3002';

  const generateQRCodeUrl = (tableNumber) => {
    // Using Google Charts API to generate QR Code
    const qrUrl = `${baseUrl}/qr/${tableNumber}`;
    const size = 400;
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrUrl)}`;
  };

  const handleDownload = (tableNumber) => {
    const link = document.createElement('a');
    link.href = generateQRCodeUrl(tableNumber);
    link.download = `RED-LIGHT-Mesa-${tableNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (tableNumber) => {
    const printWindow = window.open('', '_blank');
    const qrUrl = generateQRCodeUrl(tableNumber);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - Mesa ${tableNumber}</title>
          <style>
            body {
              margin: 0;
              padding: 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: Arial, sans-serif;
              background: white;
            }
            .container {
              text-align: center;
              border: 3px solid #E30613;
              padding: 40px;
              border-radius: 20px;
              max-width: 500px;
            }
            h1 {
              color: #E30613;
              font-size: 48px;
              margin: 0 0 10px 0;
            }
            .subtitle {
              color: #000;
              font-size: 24px;
              margin: 0 0 30px 0;
            }
            .mesa {
              font-size: 72px;
              font-weight: bold;
              color: #000;
              margin: 20px 0;
            }
            img {
              max-width: 100%;
              height: auto;
              border: 2px solid #ddd;
              border-radius: 10px;
            }
            .instructions {
              margin-top: 30px;
              font-size: 18px;
              color: #666;
              line-height: 1.6;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>RED LIGHT</h1>
            <div class="subtitle">Lounge Bar</div>
            <div class="mesa">MESA ${tableNumber}</div>
            <img src="${qrUrl}" alt="QR Code Mesa ${tableNumber}">
            <div class="instructions">
              <p><strong>Escaneie o QR Code</strong></p>
              <p>Faça seu pedido direto da mesa</p>
              <p style="font-size: 14px; margin-top: 20px;">
                Arnaldo Quintela, 19 - Botafogo, RJ
              </p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for image to load before printing
    const img = printWindow.document.querySelector('img');
    img.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');

    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Codes - Todas as Mesas</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              background: white;
            }
            .page {
              page-break-after: always;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 40px;
            }
            .container {
              text-align: center;
              border: 3px solid #E30613;
              padding: 40px;
              border-radius: 20px;
              max-width: 500px;
            }
            h1 {
              color: #E30613;
              font-size: 48px;
              margin: 0 0 10px 0;
            }
            .subtitle {
              color: #000;
              font-size: 24px;
              margin: 0 0 30px 0;
            }
            .mesa {
              font-size: 72px;
              font-weight: bold;
              color: #000;
              margin: 20px 0;
            }
            img {
              max-width: 100%;
              height: auto;
              border: 2px solid #ddd;
              border-radius: 10px;
            }
            .instructions {
              margin-top: 30px;
              font-size: 18px;
              color: #666;
              line-height: 1.6;
            }
            @media print {
              .page { page-break-after: always; }
            }
          </style>
        </head>
        <body>
    `;

    tables.forEach((tableNumber) => {
      const qrUrl = generateQRCodeUrl(tableNumber);
      html += `
        <div class="page">
          <div class="container">
            <h1>RED LIGHT</h1>
            <div class="subtitle">Lounge Bar</div>
            <div class="mesa">MESA ${tableNumber}</div>
            <img src="${qrUrl}" alt="QR Code Mesa ${tableNumber}">
            <div class="instructions">
              <p><strong>Escaneie o QR Code</strong></p>
              <p>Faça seu pedido direto da mesa</p>
              <p style="font-size: 14px; margin-top: 20px;">
                Arnaldo Quintela, 19 - Botafogo, RJ
              </p>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for all images to load
    const images = printWindow.document.querySelectorAll('img');
    let loadedCount = 0;

    images.forEach(img => {
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        }
      };
    });
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Verificando permissões..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>QR Codes das Mesas | FLAME</title>
        <meta name="description" content="QR Codes para acesso ao cardápio por mesa" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-orange-500"
              >
                <QrCode className="w-10 h-10 text-orange-400" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                QR Codes das Mesas
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                Clique em cada QR Code para baixar ou imprimir
              </p>

              {/* Print All Button */}
              <button
                onClick={handlePrintAll}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Imprimir Todas as Mesas
              </button>
            </div>

            {/* QR Codes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {tables.map((tableNumber) => (
                <motion.div
                  key={tableNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tableNumber * 0.05 }}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-orange-500 transition-colors"
                >
                  {/* Table Number */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    <h2 className="text-2xl font-bold text-white">
                      Mesa {tableNumber}
                    </h2>
                  </div>

                  {/* QR Code Image */}
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <img
                      src={generateQRCodeUrl(tableNumber)}
                      alt={`QR Code Mesa ${tableNumber}`}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* URL Preview */}
                  <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-400 break-all font-mono">
                      {baseUrl}/qr/{tableNumber}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload(tableNumber)}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Baixar PNG
                    </button>

                    <button
                      onClick={() => handlePrint(tableNumber)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Printer className="w-4 h-4" />
                      Imprimir
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-12 max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <QrCode className="w-6 h-6 text-orange-400" />
                Como usar os QR Codes
              </h3>

              <div className="space-y-4 text-gray-300">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Imprima os QR Codes</h4>
                    <p className="text-sm text-gray-400">
                      Clique em "Imprimir" em cada mesa ou use "Imprimir Todas as Mesas" para imprimir todos de uma vez.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Cole nas Mesas</h4>
                    <p className="text-sm text-gray-400">
                      Fixe cada QR Code em sua respectiva mesa, em local visível para os clientes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Cliente Escaneia</h4>
                    <p className="text-sm text-gray-400">
                      Quando o cliente escanear o QR Code, ele será direcionado automaticamente para fazer login/cadastro e acessar o cardápio com a mesa já selecionada.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Pedido Automático</h4>
                    <p className="text-sm text-gray-400">
                      O pedido vai direto para a cozinha após pagamento, já identificado com o número da mesa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                <p className="text-blue-400 text-sm flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <strong>Dica:</strong> Plastifique os QR Codes impressos para maior durabilidade!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

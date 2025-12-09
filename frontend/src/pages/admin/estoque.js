import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Plus,
  X,
  AlertTriangle,
  TrendingDown,
  Package,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import useInventoryStore from '../../stores/inventoryStore';
import InventoryTable from '../../components/InventoryTable';
import InventoryChart from '../../components/InventoryChart';

const EstoqueAdminPage = () => {
  const {
    products,
    alerts,
    consumption,
    forecasts,
    loading,
    error,
    fetchDashboard,
    fetchAlerts,
    fetchConsumption,
    fetchForecasts,
    adjustStock,
    generateReport,
    clearError
  } = useInventoryStore();

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [adjustReason, setAdjustReason] = useState('ajuste_inventario');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  // Buscar dados ao carregar
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      fetchDashboard(),
      fetchAlerts(),
      fetchConsumption(30),
      fetchForecasts()
    ]);
    setLastUpdate(new Date());
  };

  // Abrir modal de ajuste
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setNewQuantity(product.stock?.toString() || '0');
    setAdjustReason('ajuste_inventario');
    setAdjustNotes('');
    setShowAdjustModal(true);
  };

  // Abrir modal de histórico
  const handleHistoryClick = (product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  };

  // Enviar ajuste de estoque
  const handleSubmitAdjust = async () => {
    if (!selectedProduct || newQuantity === '') {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await adjustStock(
        selectedProduct.id,
        parseInt(newQuantity),
        adjustReason,
        adjustNotes
      );
      setShowAdjustModal(false);
      toast.success('Estoque ajustado com sucesso!');
    } catch (err) {
      toast.error('Erro ao ajustar estoque: ' + err.message);
    }
  };

  // Razões de ajuste
  const adjustReasons = [
    { value: 'ajuste_inventario', label: 'Ajuste de Inventário' },
    { value: 'entrada_fornecedor', label: 'Entrada de Fornecedor' },
    { value: 'perda', label: 'Perda/Dano' },
    { value: 'cortesia', label: 'Cortesia/Brinde' },
    { value: 'reposicao', label: 'Reposição Interna' }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Gestão de Estoque</h1>
                <p className="text-sm text-gray-400">
                  {lastUpdate && `Última atualização: ${lastUpdate.toLocaleTimeString('pt-BR')}`}
                </p>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadAllData}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
                title="Recarregar dados"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => generateReport().then(report => {
                  const element = document.createElement('a');
                  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2)));
                  element.setAttribute('download', `relatorio-estoque-${new Date().toISOString().split('T')[0]}.json`);
                  element.style.display = 'none';
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                })}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
                title="Baixar relatório"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total de Produtos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gray-900 rounded-2xl border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400">TOTAL DE PRODUTOS</h3>
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{products.length}</p>
            <p className="text-xs text-gray-500 mt-2">Com controle de estoque</p>
          </motion.div>

          {/* Críticos (Zerados) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-gray-900 rounded-2xl border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400">CRÍTICOS</h3>
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--theme-primary)' }}>{alerts.critical}</p>
            <p className="text-xs text-gray-500 mt-2">Sem estoque</p>
          </motion.div>

          {/* Alertas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-gray-900 rounded-2xl border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400">ALERTAS</h3>
              <TrendingDown className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-yellow-400">{alerts.warning}</p>
            <p className="text-xs text-gray-500 mt-2">Estoque baixo</p>
          </motion.div>

          {/* Urgentes para Repor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-gray-900 rounded-2xl border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400">URGENTE</h3>
              <Plus className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">
              {forecasts.filter(f => f.daysUntilStockOut && f.daysUntilStockOut <= 7).length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Reposição em até 7 dias</p>
          </motion.div>
        </div>

        {/* Guia de Abas */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Coluna Esquerda: Tabela */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-4">Inventário</h2>
            <InventoryTable
              onEditClick={handleEditClick}
              onHistoryClick={handleHistoryClick}
            />
          </div>
        </div>

        {/* Gráficos e Análises */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Análise de Consumo</h2>
          <InventoryChart consumption={consumption} forecasts={forecasts} />
        </div>
      </div>

      {/* Modal: Ajustar Estoque */}
      <AnimatePresence>
        {showAdjustModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Ajustar Estoque</h2>
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Informações do Produto */}
              <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-400">Produto</p>
                <p className="font-bold text-white">{selectedProduct.name}</p>
                <p className="text-xs text-gray-500">Estoque atual: {selectedProduct.stock}</p>
              </div>

              {/* Quantidade Nova */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nova Quantidade
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    style={{ borderColor: `rgba(var(--theme-primary-rgb, 255, 0, 110), 0.3)` }}
                  />
                </div>

                {/* Razão */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Motivo
                  </label>
                  <select
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    style={{ borderColor: `rgba(var(--theme-primary-rgb, 255, 0, 110), 0.3)` }}
                  >
                    {adjustReasons.map(reason => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={adjustNotes}
                    onChange={(e) => setAdjustNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    style={{ borderColor: `rgba(var(--theme-primary-rgb, 255, 0, 110), 0.3)` }}
                    rows="3"
                    placeholder="Descrição do ajuste..."
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitAdjust}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-all hover:scale-105"
                  style={{ background: `var(--theme-primary)` }}
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensagem de Erro Global */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 p-4 bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/50 rounded-lg text-[var(--theme-primary)] z-40 max-w-md"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Erro</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-2 text-[var(--theme-primary)] hover:text-[var(--theme-secondary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EstoqueAdminPage;

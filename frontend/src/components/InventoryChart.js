import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import useThemeStore from '../stores/themeStore';

const InventoryChart = ({ consumption = {}, forecasts = [] }) => {
  const { getPalette } = useThemeStore();
  const palette = getPalette();

  // Consumo por Categoria
  const categoryData = useMemo(() => {
    return (consumption.byCategory || []).slice(0, 5);
  }, [consumption]);

  // Produtos Mais Consumidos
  const topProducts = useMemo(() => {
    return (consumption.byProduct || []).slice(0, 8);
  }, [consumption]);

  // Produtos que vão acabar logo
  const urgentForecasts = useMemo(() => {
    return (forecasts || [])
      .filter(f => f.daysUntilStockOut && f.daysUntilStockOut <= 7)
      .sort((a, b) => (a.daysUntilStockOut || Infinity) - (b.daysUntilStockOut || Infinity))
      .slice(0, 5);
  }, [forecasts]);

  // Barra de progresso animada
  const ProgressBar = ({ value, max, color = palette?.primary || '#FF006E' }) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ backgroundColor: color }}
          className="h-full rounded-full"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Seção: Consumo por Categoria */}
      {categoryData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700"
        >
          <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
            <BarChart3 className="w-5 h-5" style={{ color: palette?.primary || '#FF006E' }} />
            Consumo por Categoria (últimos 30 dias)
          </h3>
          <div className="space-y-4">
            {categoryData.map((category, idx) => {
              const maxConsumption = Math.max(...categoryData.map(c => c.totalQuantity)) || 1;
              return (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (idx + 1) }}
                  className="space-y-2"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-white">
                      {category.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-bold"
                        style={{ color: palette?.primary || '#FF006E' }}
                      >
                        {category.totalQuantity}
                      </span>
                      <span className="text-xs text-gray-500">
                        /{Math.ceil(category.averagePerDay)}/dia
                      </span>
                    </div>
                  </div>
                  <ProgressBar value={category.totalQuantity} max={maxConsumption} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Top: {category.topProducts[0]?.name}</span>
                    <span>R$ {category.totalValue}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Seção: Produtos Mais Consumidos */}
      {topProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700"
        >
          <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
            <TrendingUp className="w-5 h-5" style={{ color: palette?.secondary || '#00D4FF' }} />
            Top 8 Produtos - Maior Consumo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topProducts.map((product, idx) => {
              const maxQty = Math.max(...topProducts.map(p => p.totalQuantity)) || 1;
              return (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * idx }}
                  className="p-4 bg-black/30 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <span className="text-2xl font-bold" style={{ color: palette?.primary || '#FF006E' }}>
                      {product.totalQuantity}
                    </span>
                  </div>
                  <ProgressBar value={product.totalQuantity} max={maxQty} />
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <span className="text-gray-500">
                      {product.averagePerDay} unidades/dia
                    </span>
                    <span className="text-gray-400">
                      R$ {product.totalValue}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Seção: Previsão de Falta */}
      {urgentForecasts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-900/20 to-red-800/10 rounded-2xl p-6 border border-red-500/30"
        >
          <h3 className="flex items-center gap-2 text-lg font-bold text-red-400 mb-6">
            <TrendingDown className="w-5 h-5" />
            Previsão: Produtos que Vão Acabar em Breve
          </h3>
          <div className="space-y-3">
            {urgentForecasts.map((forecast, idx) => (
              <motion.div
                key={forecast.productId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="p-4 bg-red-500/10 rounded-lg border border-red-500/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{forecast.name}</h4>
                    <p className="text-sm text-red-400">
                      Estoque: <span className="font-bold">{forecast.currentStock}</span> unidades
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Dias até faltar:</p>
                    <p
                      className="text-2xl font-bold"
                      style={{
                        color: forecast.daysUntilStockOut <= 2 ? '#ff0000' : '#ff9900'
                      }}
                    >
                      {forecast.daysUntilStockOut || '∞'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Consumo/dia:</p>
                    <p className="text-white font-semibold">{forecast.dailyAverage}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sugestão reposição:</p>
                    <p className="text-white font-semibold">{forecast.recommendedOrder}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Estado vazio */}
      {categoryData.length === 0 && topProducts.length === 0 && urgentForecasts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 text-center text-gray-400"
        >
          <p>Nenhum dado de consumo disponível ainda.</p>
        </motion.div>
      )}
    </div>
  );
};

export default InventoryChart;

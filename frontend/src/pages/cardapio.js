import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Star, Clock, Grid, List } from 'lucide-react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import ImageModal from '../components/ImageModal';
import NarguileOptionsModal from '../components/NarguileOptionsModal';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { useProductStore } from '../stores/productStore';
import { useDebounce } from '../hooks';
import { formatCurrency } from '../utils/format';

export default function Cardapio() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [narguileProduct, setNarguileProduct] = useState(null);
  const {
    products,
    categories,
    isLoading,
    filters,
    pagination,
    fetchProducts,
    fetchCategories,
    searchProducts,
    filterByCategory,
    filterByPrice,
    toggleFeaturedFilter,
    clearFilters,
    sortProducts,
    goToPage,
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (debouncedSearchTerm !== filters.search) {
      searchProducts(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchProducts, filters.search]);

  const handleCategoryFilter = async (category) => {
    await filterByCategory(category);
    setShowFilters(false);
  };

  const handlePriceFilter = async () => {
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : null;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : null;
    
    await filterByPrice(minPrice, maxPrice);
    setShowFilters(false);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    sortProducts(newSortBy);
  };

  const handleClearFilters = async () => {
    await clearFilters();
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setSortBy('featured');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Head>
        <title>Cardápio | FLAME</title>
        <meta name="description" content="Conheça nosso cardápio com drinks autorais, petiscos gourmet e narguilé premium do FLAME Lounge Bar" />
        <meta name="keywords" content="cardápio, drinks, petiscos, narguilé, flame, bar, lounge, botafogo" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          {/* Header */}
          <div className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(to right, rgba(var(--theme-primary-rgb), 0.5), rgba(var(--theme-accent-rgb), 0.5), rgba(var(--theme-secondary-rgb), 0.5))' }}>
            {/* Background Effects */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, rgba(var(--theme-primary-rgb), 0.2), transparent, transparent)' }} />
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(var(--theme-secondary-rgb), 0.1)' }} />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(var(--theme-primary-rgb), 0.1)' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4"
              >
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))' }}>
                  Nosso Cardápio
                </span>
              </motion.h1>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-neutral-300 max-w-2xl mx-auto"
              >
                Drinks autorais, gastronomia premium e narguilé de alta qualidade
              </motion.p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-neutral-900 border-b border-neutral-800 sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 w-full md:max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar produtos..."
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-700 rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--theme-primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex bg-neutral-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className="p-2 rounded-md transition-colors text-white"
                      style={viewMode === 'grid' ? { background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' } : { color: '#9ca3af' }}
                      onMouseEnter={(e) => { if (viewMode !== 'grid') e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={(e) => { if (viewMode !== 'grid') e.currentTarget.style.color = '#9ca3af'; }}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className="p-2 rounded-md transition-colors text-white"
                      style={viewMode === 'list' ? { background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' } : { color: '#9ca3af' }}
                      onMouseEnter={(e) => { if (viewMode !== 'list') e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={(e) => { if (viewMode !== 'list') e.currentTarget.style.color = '#9ca3af'; }}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--theme-primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                  >
                    <option value="featured">Destaques</option>
                    <option value="name-asc">Nome A-Z</option>
                    <option value="name-desc">Nome Z-A</option>
                    <option value="price-asc">Menor Preço</option>
                    <option value="price-desc">Maior Preço</option>
                    <option value="newest">Mais Novos</option>
                  </select>

                  {/* Filters Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filtros
                    {(filters.category || filters.isFeatured || filters.minPrice || filters.maxPrice) && (
                      <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.category || filters.isFeatured || filters.search || filters.minPrice || filters.maxPrice) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 text-white px-3 py-1 rounded-full text-sm" style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent))' }}>
                      Busca: "{filters.search}"
                      <button onClick={() => setSearchTerm('')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center gap-1 text-white px-3 py-1 rounded-full text-sm" style={{ background: 'linear-gradient(to right, var(--theme-accent), var(--theme-secondary))' }}>
                      {filters.category}
                      <button onClick={() => handleCategoryFilter('')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-white px-3 py-1 rounded-full text-sm" style={{ background: 'linear-gradient(to right, var(--theme-secondary), var(--theme-primary))' }}>
                      <Star className="w-3 h-3" />
                      Destaques
                      <button onClick={toggleFeaturedFilter}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center gap-1 text-white px-3 py-1 rounded-full text-sm" style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}>
                      Preço: {filters.minPrice && formatCurrency(filters.minPrice)} - {filters.maxPrice && formatCurrency(filters.maxPrice)}
                      <button onClick={() => filterByPrice(null, null)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="text-neutral-400 hover:text-white text-sm underline"
                  >
                    Limpar todos
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-neutral-800 border-b border-neutral-700 overflow-hidden"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Categories */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Categorias</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleCategoryFilter('')}
                          className="block w-full text-left px-3 py-2 rounded-lg transition-colors"
                          style={!filters.category ? { background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))', color: 'white' } : { color: '#9ca3af' }}
                          onMouseEnter={(e) => { if (filters.category) { e.currentTarget.style.color = 'white'; e.currentTarget.style.backgroundColor = '#374151'; } }}
                          onMouseLeave={(e) => { if (filters.category) { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
                        >
                          Todas
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleCategoryFilter(category)}
                            className="block w-full text-left px-3 py-2 rounded-lg transition-colors"
                            style={filters.category === category ? { background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))', color: 'white' } : { color: '#9ca3af' }}
                            onMouseEnter={(e) => { if (filters.category !== category) { e.currentTarget.style.color = 'white'; e.currentTarget.style.backgroundColor = '#374151'; } }}
                            onMouseLeave={(e) => { if (filters.category !== category) { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Faixa de Preço</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-neutral-400 mb-1">Preço mínimo</label>
                          <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                            placeholder="R$ 0,00"
                            className="w-full bg-neutral-700 border border-neutral-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                            style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--theme-primary)'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#525252'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-neutral-400 mb-1">Preço máximo</label>
                          <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                            placeholder="R$ 100,00"
                            className="w-full bg-neutral-700 border border-neutral-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                            style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--theme-primary)'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#525252'}
                          />
                        </div>
                        <button
                          onClick={handlePriceFilter}
                          className="w-full text-white py-2 px-4 rounded-lg transition-colors shadow-lg"
                          style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>

                    {/* Special Filters */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Especiais</h3>
                      <div className="space-y-2">
                        <button
                          onClick={toggleFeaturedFilter}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg transition-colors"
                          style={filters.isFeatured ? { background: 'linear-gradient(to right, var(--theme-secondary), var(--theme-primary))', color: 'white' } : { color: '#9ca3af' }}
                          onMouseEnter={(e) => { if (!filters.isFeatured) { e.currentTarget.style.color = 'white'; e.currentTarget.style.backgroundColor = '#374151'; } }}
                          onMouseLeave={(e) => { if (!filters.isFeatured) { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
                        >
                          <Star className="w-4 h-4" />
                          Produtos em Destaque
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-neutral-400">
                {isLoading ? 'Carregando...' : `${pagination.totalProducts} produtos encontrados`}
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {Array.from({ length: 12 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            )}

            {/* Products */}
            {!isLoading && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {products.length > 0 ? (
                  products.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <ProductCard
                        product={product}
                        variant={viewMode === 'list' ? 'compact' : 'default'}
                        onImageClick={setSelectedProduct}
                        onNarguileClick={setNarguileProduct}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-12 h-12 text-neutral-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-neutral-400 mb-6">
                      Tente ajustar os filtros ou termos de busca
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
                      style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      Limpar Filtros
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Pagination */}
            {!isLoading && products.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-neutral-700 rounded-lg text-neutral-400 hover:text-white hover:border-[var(--theme-primary)] hover:border-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className="px-3 py-2 rounded-lg transition-colors"
                        style={page === pagination.currentPage ? { background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))', color: 'white' } : { color: '#9ca3af' }}
                        onMouseEnter={(e) => { if (page !== pagination.currentPage) { e.currentTarget.style.color = 'white'; e.currentTarget.style.backgroundColor = '#262626'; } }}
                        onMouseLeave={(e) => { if (page !== pagination.currentPage) { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => goToPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-neutral-700 rounded-lg text-neutral-400 hover:text-white hover:border-[var(--theme-secondary)] hover:border-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal de visualização */}
          <ImageModal
            isOpen={selectedProduct !== null}
            onClose={() => setSelectedProduct(null)}
            imageSrc={selectedProduct?.image}
            imageAlt={selectedProduct?.name}
          />

          {/* Modal de opções de Narguilé */}
          <NarguileOptionsModal
            isOpen={narguileProduct !== null}
            onClose={() => setNarguileProduct(null)}
            product={narguileProduct}
          />
        </div>
      </Layout>
    </>
  );
}
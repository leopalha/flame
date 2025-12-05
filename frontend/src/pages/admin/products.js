import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Package,
  Save,
  X,
  Grid,
  List,
  RefreshCw,
  Tag,
  AlertCircle
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner, { SkeletonCard } from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';
import { formatCurrency } from '../../utils/format';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

const DEFAULT_CATEGORIES = ['Drinks', 'Entradas', 'Porcoes', 'Sobremesas', 'Narguile'];

export default function AdminProducts() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { getPalette } = useThemeStore();
  const palette = getPalette();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isActive: true,
    isSignature: false,
    isPromotional: false,
    discountPercentage: '',
    hasStock: false,
    stock: '',
    minStock: '5',
    preparationTime: '15'
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/admin/products');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 50,
        isActive: 'all', // Mostrar todos para admin
        sortBy: 'name',
        sortOrder: 'ASC'
      };

      if (selectedCategory !== 'Todos') {
        params.category = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await api.get('/products', { params });

      if (response.data.success) {
        const productsData = response.data.data.products || response.data.data || [];
        setProducts(Array.isArray(productsData) ? productsData : []);

        if (response.data.data.pagination) {
          setPagination(response.data.data.pagination);
        }
      } else {
        throw new Error(response.data.message || 'Erro ao carregar produtos');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error('Erro ao carregar produtos. Tente novamente.');
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, pagination.currentPage]);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/products/categories');
      if (response.data.success && response.data.data.categories) {
        const apiCategories = response.data.data.categories;
        // Merge with default categories
        const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...apiCategories])];
        setCategories(allCategories);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      // Keep default categories on error
    }
  }, []);

  // Load products and categories on mount
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchProducts();
      fetchCategories();
    }
  }, [fetchProducts, fetchCategories, isAuthenticated, user]);

  // Filter products by search (client-side for better UX)
  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        image: product.image || '',
        isActive: product.isActive !== false,
        isSignature: product.isSignature || false,
        isPromotional: product.isPromotional || false,
        discountPercentage: product.discountPercentage?.toString() || '',
        hasStock: product.hasStock || false,
        stock: product.stock?.toString() || '',
        minStock: product.minStock?.toString() || '5',
        preparationTime: product.preparationTime?.toString() || '15'
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        isActive: true,
        isSignature: false,
        isPromotional: false,
        discountPercentage: '',
        hasStock: false,
        stock: '',
        minStock: '5',
        preparationTime: '15'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Preencha todos os campos obrigatorios (nome, preco, categoria)');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || null,
        isActive: formData.isActive,
        isSignature: formData.isSignature,
        isPromotional: formData.isPromotional,
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null,
        hasStock: formData.hasStock,
        stock: formData.hasStock && formData.stock ? parseInt(formData.stock) : null,
        minStock: formData.hasStock && formData.minStock ? parseInt(formData.minStock) : 5,
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : 15
      };

      let response;
      if (editingProduct) {
        response = await api.put(`/products/${editingProduct.id}`, productData);
      } else {
        response = await api.post('/products', productData);
      }

      if (response.data.success) {
        toast.success(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
        handleCloseModal();
        fetchProducts(); // Refresh list
      } else {
        throw new Error(response.data.message || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Tem certeza que deseja desativar este produto?')) return;

    try {
      const response = await api.patch(`/products/${productId}/deactivate`);

      if (response.data.success) {
        setProducts(prev => prev.map(p =>
          p.id === productId ? { ...p, isActive: false } : p
        ));
        toast.success('Produto desativado!');
      } else {
        throw new Error(response.data.message || 'Erro ao desativar produto');
      }
    } catch (error) {
      console.error('Erro ao desativar produto:', error);
      toast.error('Erro ao desativar produto');
    }
  };

  const toggleAvailability = async (productId, currentStatus) => {
    try {
      const endpoint = currentStatus ? 'deactivate' : 'activate';
      const response = await api.patch(`/products/${productId}/${endpoint}`);

      if (response.data.success) {
        setProducts(prev => prev.map(p =>
          p.id === productId ? { ...p, isActive: !currentStatus } : p
        ));
        toast.success(currentStatus ? 'Produto desativado!' : 'Produto ativado!');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Erro ao alterar disponibilidade:', error);
      toast.error('Erro ao alterar disponibilidade');
    }
  };

  const toggleHighlight = async (productId, currentStatus) => {
    try {
      const response = await api.put(`/products/${productId}`, {
        isSignature: !currentStatus
      });

      if (response.data.success) {
        setProducts(prev => prev.map(p =>
          p.id === productId ? { ...p, isSignature: !currentStatus } : p
        ));
        toast.success(currentStatus ? 'Destaque removido!' : 'Produto destacado!');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Erro ao alterar destaque:', error);
      toast.error('Erro ao alterar destaque');
    }
  };

  const handleRefresh = () => {
    fetchProducts();
    toast.success('Atualizando produtos...');
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Verificando permissoes..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gerenciar Produtos | FLAME Admin</title>
        <meta name="description" content="Gerencie produtos do cardapio FLAME" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-24 bg-black">
          {/* Header */}
          <div className="bg-neutral-900 border-b border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push('/admin')}
                    className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Gerenciar Produtos</h1>
                    <p className="text-neutral-400 text-sm">
                      {pagination.totalProducts || products.length} produtos no cardapio
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                    disabled={loading}
                  >
                    <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
                  </button>

                  {/* View Toggle */}
                  <div className="flex items-center bg-neutral-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' ? 'bg-[var(--theme-primary)] text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' ? 'bg-[var(--theme-primary)] text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90 flex items-center gap-2"
                    style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))' }}
                  >
                    <Plus className="w-4 h-4" />
                    Novo Produto
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filters */}
            <div className="bg-neutral-900 rounded-xl p-4 mb-6 border border-neutral-800">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[var(--theme-primary)]"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  <button
                    onClick={() => setSelectedCategory('Todos')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === 'Todos'
                        ? 'bg-[var(--theme-primary)] text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category
                          ? 'bg-[var(--theme-primary)] text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-neutral-900 rounded-xl p-12 text-center border border-neutral-800">
                <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
                <p className="text-neutral-400 mb-6">
                  {products.length === 0
                    ? 'Ainda não há produtos cadastrados.'
                    : 'Tente ajustar os filtros ou adicione um novo produto.'}
                </p>
                <button
                  onClick={() => handleOpenModal()}
                  className="px-6 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))' }}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Adicionar Produto
                </button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-[var(--theme-primary)] transition-colors ${
                      viewMode === 'list' ? 'flex' : ''
                    } ${!product.isActive ? 'opacity-60' : ''}`}
                  >
                    {/* Product Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} bg-neutral-800`}>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                        <Package className="w-12 h-12 text-neutral-600" />
                      </div>

                      {/* Status Badges */}
                      <div className="absolute top-2 left-2 flex gap-2 z-10">
                        {product.isSignature && (
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Destaque
                          </span>
                        )}
                        {product.isPromotional && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Promo
                          </span>
                        )}
                        {!product.isActive && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Inativo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                          <span className="inline-flex items-center gap-1 text-neutral-400 text-xs mt-1">
                            <Tag className="w-3 h-3" />
                            {product.category}
                          </span>
                        </div>
                        <div className="text-right">
                          {product.isPromotional && product.discountPercentage ? (
                            <>
                              <span className="text-sm text-neutral-500 line-through">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="text-lg font-bold text-[var(--theme-primary)] block">
                                {formatCurrency(product.price * (1 - product.discountPercentage / 100))}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-[var(--theme-primary)]">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                        {product.description || 'Sem descrição'}
                      </p>

                      {/* Stock info */}
                      {product.hasStock && (
                        <div className="flex items-center gap-2 mb-4 text-xs">
                          {product.stock <= (product.minStock || 5) ? (
                            <span className="flex items-center gap-1 text-red-400">
                              <AlertCircle className="w-3 h-3" />
                              Estoque baixo: {product.stock}
                            </span>
                          ) : (
                            <span className="text-neutral-500">
                              Estoque: {product.stock}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAvailability(product.id, product.isActive)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.isActive ? 'bg-green-500/20 text-green-400' : 'bg-neutral-800 text-neutral-400'
                            }`}
                            title={product.isActive ? 'Desativar' : 'Ativar'}
                          >
                            {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => toggleHighlight(product.id, product.isSignature)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.isSignature ? 'bg-yellow-500/20 text-yellow-400' : 'bg-neutral-800 text-neutral-400'
                            }`}
                            title={product.isSignature ? 'Remover destaque' : 'Destacar'}
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-neutral-800 rounded-lg hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Desativar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pagination.currentPage === page
                        ? 'bg-[var(--theme-primary)] text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-900 rounded-xl border border-neutral-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                    </h3>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 text-neutral-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                        placeholder="Ex: Moscow Mule"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Descricao
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                        placeholder="Descreva o produto..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                          Preco (R$) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                          Categoria *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                        >
                          <option value="">Selecione...</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        URL da Imagem
                      </label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                          Tempo de Preparo (min)
                        </label>
                        <input
                          type="number"
                          value={formData.preparationTime}
                          onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                          placeholder="15"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                          Desconto (%)
                        </label>
                        <input
                          type="number"
                          value={formData.discountPercentage}
                          onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                          placeholder="0"
                          disabled={!formData.isPromotional}
                        />
                      </div>
                    </div>

                    {/* Stock controls */}
                    <div className="border-t border-neutral-800 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer mb-4">
                        <input
                          type="checkbox"
                          checked={formData.hasStock}
                          onChange={(e) => setFormData({ ...formData, hasStock: e.target.checked })}
                          className="rounded border-neutral-600 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                        />
                        <span className="text-neutral-300">Controlar estoque</span>
                      </label>

                      {formData.hasStock && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                              Estoque Atual
                            </label>
                            <input
                              type="number"
                              value={formData.stock}
                              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                              Estoque Minimo
                            </label>
                            <input
                              type="number"
                              value={formData.minStock}
                              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                              placeholder="5"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6 border-t border-neutral-800 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="rounded border-neutral-600 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                        />
                        <span className="text-neutral-300">Ativo</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isSignature}
                          onChange={(e) => setFormData({ ...formData, isSignature: e.target.checked })}
                          className="rounded border-neutral-600 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                        />
                        <span className="text-neutral-300">Destaque</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPromotional}
                          onChange={(e) => setFormData({ ...formData, isPromotional: e.target.checked })}
                          className="rounded border-neutral-600 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                        />
                        <span className="text-neutral-300">Promocao</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-neutral-800">
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProduct}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-lg text-white font-medium transition-all hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                      style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent), var(--theme-secondary))' }}
                    >
                      {saving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {editingProduct ? 'Atualizar' : 'Criar'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
}

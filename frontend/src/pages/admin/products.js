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
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Loader2,
  Filter,
  ChevronDown,
  Check,
  AlertTriangle,
  PackageX,
  PackageCheck,
  ClipboardList,
  Scale
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner, { SkeletonCard } from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import useIngredientStore from '../../stores/ingredientStore';
import { formatCurrency } from '../../utils/format';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

const DEFAULT_CATEGORIES = ['Drinks', 'Entradas', 'Porcoes', 'Sobremesas', 'Narguile'];

export default function AdminProducts() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    ingredients,
    recipe,
    fetchIngredients,
    fetchProductRecipe,
    addRecipeItem,
    updateRecipeItem,
    removeRecipeItem,
    loading: ingredientLoading
  } = useIngredientStore();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'inStock', 'lowStock', 'outOfStock', 'noControl'
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  // Recipe Modal State (Sprint 31)
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeProduct, setRecipeProduct] = useState(null);
  const [recipeForm, setRecipeForm] = useState({
    ingredientId: '',
    quantity: '',
    unit: '',
    isOptional: false,
    notes: ''
  });
  const [editingRecipeItem, setEditingRecipeItem] = useState(null);

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

  // Filter products by search and filters (client-side for better UX)
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    // Active filter
    if (activeFilter === 'active' && !product.isActive) return false;
    if (activeFilter === 'inactive' && product.isActive) return false;

    // Stock filter
    if (stockFilter !== 'all') {
      if (stockFilter === 'noControl' && product.hasStock) return false;
      if (stockFilter === 'inStock' && (!product.hasStock || product.stock <= (product.minStock || 5))) return false;
      if (stockFilter === 'lowStock' && (!product.hasStock || product.stock > (product.minStock || 5) || product.stock === 0)) return false;
      if (stockFilter === 'outOfStock' && (!product.hasStock || product.stock > 0)) return false;
    }

    return true;
  });

  // Calculate stock stats
  const stockStats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    withStock: products.filter(p => p.hasStock).length,
    lowStock: products.filter(p => p.hasStock && p.stock <= (p.minStock || 5) && p.stock > 0).length,
    outOfStock: products.filter(p => p.hasStock && p.stock === 0).length,
    inStock: products.filter(p => p.hasStock && p.stock > (p.minStock || 5)).length
  };

  const handleOpenModal = (product = null) => {
    setImagePreview(null); // Clear image preview
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

  // ============== FICHA TÉCNICA (Sprint 31) ==============

  const handleOpenRecipeModal = async (product) => {
    setRecipeProduct(product);
    setShowRecipeModal(true);
    setEditingRecipeItem(null);
    setRecipeForm({
      ingredientId: '',
      quantity: '',
      unit: '',
      isOptional: false,
      notes: ''
    });

    try {
      await fetchIngredients();
      await fetchProductRecipe(product.id);
    } catch (error) {
      console.error('Erro ao carregar ficha técnica:', error);
      toast.error('Erro ao carregar dados');
    }
  };

  const handleCloseRecipeModal = () => {
    setShowRecipeModal(false);
    setRecipeProduct(null);
    setEditingRecipeItem(null);
  };

  const handleAddRecipeItem = async () => {
    if (!recipeForm.ingredientId || !recipeForm.quantity || !recipeForm.unit) {
      toast.error('Preencha insumo, quantidade e unidade');
      return;
    }

    try {
      await addRecipeItem(recipeProduct.id, {
        ingredientId: recipeForm.ingredientId,
        quantity: parseFloat(recipeForm.quantity),
        unit: recipeForm.unit,
        isOptional: recipeForm.isOptional,
        notes: recipeForm.notes || null
      });

      toast.success('Insumo adicionado à ficha técnica!');
      setRecipeForm({
        ingredientId: '',
        quantity: '',
        unit: '',
        isOptional: false,
        notes: ''
      });
    } catch (error) {
      console.error('Erro ao adicionar insumo:', error);
      toast.error(error.response?.data?.message || 'Erro ao adicionar insumo');
    }
  };

  const handleEditRecipeItem = (item) => {
    setEditingRecipeItem(item);
    setRecipeForm({
      ingredientId: item.ingredientId,
      quantity: item.quantity?.toString() || '',
      unit: item.unit || '',
      isOptional: item.isOptional || false,
      notes: item.notes || ''
    });
  };

  const handleUpdateRecipeItem = async () => {
    if (!editingRecipeItem) return;

    try {
      await updateRecipeItem(editingRecipeItem.id, {
        quantity: parseFloat(recipeForm.quantity),
        unit: recipeForm.unit,
        isOptional: recipeForm.isOptional,
        notes: recipeForm.notes || null
      });

      toast.success('Insumo atualizado!');
      setEditingRecipeItem(null);
      setRecipeForm({
        ingredientId: '',
        quantity: '',
        unit: '',
        isOptional: false,
        notes: ''
      });
    } catch (error) {
      console.error('Erro ao atualizar insumo:', error);
      toast.error('Erro ao atualizar insumo');
    }
  };

  const handleRemoveRecipeItem = async (itemId) => {
    if (!confirm('Remover este insumo da ficha técnica?')) return;

    try {
      await removeRecipeItem(itemId);
      toast.success('Insumo removido!');
    } catch (error) {
      console.error('Erro ao remover insumo:', error);
      toast.error('Erro ao remover insumo');
    }
  };

  const handleRefresh = () => {
    fetchProducts();
    toast.success('Atualizando produtos...');
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido. Use: JPEG, PNG, GIF ou WebP');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Tamanho máximo: 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const productId = editingProduct?.id || 'new';
      const response = await api.post(`/upload/product/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setFormData(prev => ({ ...prev, image: response.data.data.imageUrl }));
        toast.success('Imagem enviada com sucesso!');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error(error.response?.data?.message || 'Erro ao enviar imagem');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  // Clear image
  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview(null);
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
          <div className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push('/admin')}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Gerenciar Produtos</h1>
                    <p className="text-gray-400 text-sm">
                      {pagination.totalProducts || products.length} produtos no cardapio
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={loading}
                  >
                    <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
                  </button>

                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' ? 'bg-[var(--theme-primary)] text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' ? 'bg-[var(--theme-primary)] text-white' : 'text-gray-400 hover:text-white'
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
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Total</span>
                </div>
                <p className="text-xl font-bold text-white">{stockStats.total}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Ativos</span>
                </div>
                <p className="text-xl font-bold text-green-400">{stockStats.active}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <EyeOff className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">Inativos</span>
                </div>
                <p className="text-xl font-bold text-gray-400">{stockStats.inactive}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <PackageCheck className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Em Estoque</span>
                </div>
                <p className="text-xl font-bold text-green-400">{stockStats.inStock}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">Estoque Baixo</span>
                </div>
                <p className="text-xl font-bold text-yellow-400">{stockStats.lowStock}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <PackageX className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-gray-400">Sem Estoque</span>
                </div>
                <p className="text-xl font-bold text-red-400">{stockStats.outOfStock}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-800">
              <div className="flex flex-col gap-4">
                {/* Search and Quick Filters Row */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--theme-primary)]"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                  >
                    <option value="all">Todos Status</option>
                    <option value="active">Apenas Ativos</option>
                    <option value="inactive">Apenas Inativos</option>
                  </select>

                  {/* Stock Filter */}
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                  >
                    <option value="all">Todo Estoque</option>
                    <option value="inStock">Em Estoque</option>
                    <option value="lowStock">Estoque Baixo</option>
                    <option value="outOfStock">Sem Estoque</option>
                    <option value="noControl">Sem Controle</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  <span className="text-sm text-gray-500 mr-2">Categoria:</span>
                  <button
                    onClick={() => setSelectedCategory('Todos')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === 'Todos'
                        ? 'bg-[var(--theme-primary)] text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Active Filters Summary */}
                {(activeFilter !== 'all' || stockFilter !== 'all' || selectedCategory !== 'Todos' || searchTerm) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-500">Filtros ativos:</span>
                    {searchTerm && (
                      <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 flex items-center gap-1">
                        Busca: {searchTerm}
                        <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {activeFilter !== 'all' && (
                      <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 flex items-center gap-1">
                        {activeFilter === 'active' ? 'Ativos' : 'Inativos'}
                        <button onClick={() => setActiveFilter('all')} className="ml-1 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {stockFilter !== 'all' && (
                      <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 flex items-center gap-1">
                        {stockFilter === 'inStock' ? 'Em Estoque' : stockFilter === 'lowStock' ? 'Estoque Baixo' : stockFilter === 'outOfStock' ? 'Sem Estoque' : 'Sem Controle'}
                        <button onClick={() => setStockFilter('all')} className="ml-1 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedCategory !== 'Todos' && (
                      <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 flex items-center gap-1">
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory('Todos')} className="ml-1 hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setActiveFilter('all');
                        setStockFilter('all');
                        setSelectedCategory('Todos');
                      }}
                      className="text-xs text-[var(--theme-primary)] hover:underline"
                    >
                      Limpar todos
                    </button>
                  </div>
                )}
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
              <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-400 mb-6">
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
                    className={`bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-[var(--theme-primary)] transition-colors ${
                      viewMode === 'list' ? 'flex' : ''
                    } ${!product.isActive ? 'opacity-60' : ''}`}
                  >
                    {/* Product Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} bg-gray-800`}>
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
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <Package className="w-12 h-12 text-gray-600" />
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
                          <span className="inline-flex items-center gap-1 text-gray-400 text-xs mt-1">
                            <Tag className="w-3 h-3" />
                            {product.category}
                          </span>
                        </div>
                        <div className="text-right">
                          {product.isPromotional && product.discountPercentage ? (
                            <>
                              <span className="text-sm text-gray-500 line-through">
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

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
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
                            <span className="text-gray-500">
                              Estoque: {product.stock}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAvailability(product.id, product.isActive)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'
                            }`}
                            title={product.isActive ? 'Desativar' : 'Ativar'}
                          >
                            {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => toggleHighlight(product.id, product.isSignature)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.isSignature ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-400'
                            }`}
                            title={product.isSignature ? 'Remover destaque' : 'Destacar'}
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenRecipeModal(product)}
                            className="p-2 bg-gray-800 rounded-lg hover:bg-purple-500/20 text-gray-400 hover:text-purple-400 transition-colors"
                            title="Ficha Técnica"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-gray-800 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
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
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
                className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                    </h3>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
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
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
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
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
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
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
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
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                        >
                          <option value="">Selecione...</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Imagem do Produto
                      </label>

                      {/* Preview Area */}
                      <div className="relative mb-3">
                        {(imagePreview || formData.image) ? (
                          <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={imagePreview || formData.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/placeholder-product.png';
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleClearImage}
                              className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                              title="Remover imagem"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            {uploading && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-48 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-[var(--theme-primary)] transition-colors">
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={uploading}
                            />
                            {uploading ? (
                              <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-10 h-10 text-gray-500 mb-2" />
                                <span className="text-sm text-gray-400">Clique para enviar imagem</span>
                                <span className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF ou WebP (max 5MB)</span>
                              </>
                            )}
                          </label>
                        )}
                      </div>

                      {/* URL Input (alternative) */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">ou cole uma URL:</span>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => {
                            setFormData({ ...formData, image: e.target.value });
                            setImagePreview(null);
                          }}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--theme-primary)]"
                          placeholder="https://..."
                        />
                      </div>
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
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
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
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                          placeholder="0"
                          disabled={!formData.isPromotional}
                        />
                      </div>
                    </div>

                    {/* Stock controls */}
                    <div className="border-t border-gray-800 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer mb-4">
                        <input
                          type="checkbox"
                          checked={formData.hasStock}
                          onChange={(e) => setFormData({ ...formData, hasStock: e.target.checked })}
                          className="rounded border-gray-600 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
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
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
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
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                              placeholder="5"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6 border-t border-gray-800 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="rounded border-gray-600 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                        />
                        <span className="text-neutral-300">Ativo</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isSignature}
                          onChange={(e) => setFormData({ ...formData, isSignature: e.target.checked })}
                          className="rounded border-gray-600 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                        />
                        <span className="text-neutral-300">Destaque</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPromotional}
                          onChange={(e) => setFormData({ ...formData, isPromotional: e.target.checked })}
                          className="rounded border-gray-600 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)]"
                        />
                        <span className="text-neutral-300">Promocao</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-800">
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
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

          {/* Recipe Modal (Sprint 31 - Ficha Técnica) */}
          {showRecipeModal && recipeProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseRecipeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Ficha Técnica</h2>
                      <p className="text-sm text-gray-400">{recipeProduct.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseRecipeModal}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                  {/* Add/Edit Form */}
                  <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-300 mb-4">
                      {editingRecipeItem ? 'Editar Insumo' : 'Adicionar Insumo'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Ingredient Select */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Insumo</label>
                        <select
                          value={recipeForm.ingredientId}
                          onChange={(e) => {
                            const ing = ingredients.find(i => i.id === e.target.value);
                            setRecipeForm(prev => ({
                              ...prev,
                              ingredientId: e.target.value,
                              unit: ing?.unit || prev.unit
                            }));
                          }}
                          disabled={editingRecipeItem}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50"
                        >
                          <option value="">Selecione um insumo</option>
                          {ingredients.map(ing => (
                            <option key={ing.id} value={ing.id}>
                              {ing.name} ({ing.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Quantidade</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={recipeForm.quantity}
                            onChange={(e) => setRecipeForm(prev => ({ ...prev, quantity: e.target.value }))}
                            placeholder="0.00"
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                          />
                          <input
                            type="text"
                            value={recipeForm.unit}
                            onChange={(e) => setRecipeForm(prev => ({ ...prev, unit: e.target.value }))}
                            placeholder="unidade"
                            className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      {/* Optional Toggle */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="isOptional"
                          checked={recipeForm.isOptional}
                          onChange={(e) => setRecipeForm(prev => ({ ...prev, isOptional: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                        />
                        <label htmlFor="isOptional" className="text-sm text-gray-300">
                          Ingrediente opcional
                        </label>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Observações</label>
                        <input
                          type="text"
                          value={recipeForm.notes}
                          onChange={(e) => setRecipeForm(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Ex: pode substituir por..."
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                      {editingRecipeItem && (
                        <button
                          onClick={() => {
                            setEditingRecipeItem(null);
                            setRecipeForm({
                              ingredientId: '',
                              quantity: '',
                              unit: '',
                              isOptional: false,
                              notes: ''
                            });
                          }}
                          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        onClick={editingRecipeItem ? handleUpdateRecipeItem : handleAddRecipeItem}
                        disabled={ingredientLoading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        {ingredientLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        {editingRecipeItem ? 'Atualizar' : 'Adicionar'}
                      </button>
                    </div>
                  </div>

                  {/* Recipe Items List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-300">
                        Insumos da Receita
                      </h3>
                      <span className="text-xs text-gray-500">
                        {recipe.length} insumo(s)
                      </span>
                    </div>

                    {recipe.length === 0 ? (
                      <div className="text-center py-8 bg-gray-800/30 rounded-xl">
                        <Scale className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">Nenhum insumo cadastrado</p>
                        <p className="text-gray-500 text-xs mt-1">Adicione os insumos necessários para produzir este item</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recipe.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {item.ingredient?.name || 'Insumo'}
                                  {item.isOptional && (
                                    <span className="ml-2 text-xs text-gray-500">(opcional)</span>
                                  )}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {item.quantity} {item.unit}
                                  {item.notes && ` • ${item.notes}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditRecipeItem(item)}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveRecipeItem(item.id)}
                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                title="Remover"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
                  <button
                    onClick={handleCloseRecipeModal}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
}

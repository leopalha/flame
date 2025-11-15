import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import {
  mockProducts,
  mockCategories,
  mockFeaturedProducts
} from '../data/mockData';
import { safeLocalStorage } from '../utils/storage';

// DEBUG FORÇADO
console.log('🔍 PRODUCTSTORE: mockProducts importado com', mockProducts.length, 'produtos');
console.log('🔍 PRODUCTSTORE: Primeiro ID:', mockProducts[0]?.id, mockProducts[0]?.nome);
console.log('🔍 PRODUCTSTORE: Último ID:', mockProducts[mockProducts.length-1]?.id, mockProducts[mockProducts.length-1]?.nome);

// Função para verificar se deve usar dados mockados
const shouldUseMockData = () => {
  // Em desenvolvimento, usar dados mockados por padrão
  if (process.env.NODE_ENV === 'development') {
    // Se não foi configurado explicitamente no localStorage, usar mock por padrão
    const mockDataSetting = safeLocalStorage.getItem('useMockData');
    return mockDataSetting === null || mockDataSetting === 'true';
  }

  // Em produção, só usar se não há API configurada ou se explicitamente solicitado
  return !process.env.NEXT_PUBLIC_API_URL || safeLocalStorage.getItem('useMockData') === 'true';
};

// Função para simular delay de rede
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Função para mapear dados mockados para o formato esperado pelo store
const mapMockProductToStore = (mockProduct) => ({
  id: mockProduct.id,
  name: mockProduct.nome,
  description: mockProduct.descricao,
  price: mockProduct.preco,
  category: mockProduct.categoria,
  image: mockProduct.imagem,
  isActive: mockProduct.disponivel,
  isFeatured: mockProduct.destaque,
  stock: mockProduct.estoque,
  hasStock: mockProduct.estoque !== undefined,
  ingredients: mockProduct.ingredientes,
  allergens: mockProduct.alergenos,
  preparationTime: mockProduct.tempoPreparo,
  calories: mockProduct.calorias,
  tags: mockProduct.tags || [],
  createdAt: new Date().toISOString(),
  discount: 0
});

// Função para filtrar produtos mockados
const filterMockProducts = (products, filters) => {
  let filtered = [...products];

  if (filters.category && filters.category !== '') {
    filtered = filtered.filter(product => 
      product.categoria.toLowerCase() === filters.category.toLowerCase()
    );
  }

  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(product => 
      product.nome.toLowerCase().includes(searchTerm) ||
      product.descricao.toLowerCase().includes(searchTerm) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  }

  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    filtered = filtered.filter(product => product.preco >= filters.minPrice);
  }

  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.preco <= filters.maxPrice);
  }

  if (filters.isActive !== null) {
    filtered = filtered.filter(product => product.disponivel === filters.isActive);
  }

  if (filters.isFeatured) {
    filtered = filtered.filter(product => product.destaque === true);
  }

  return filtered;
};

const useProductStore = create((set, get) => ({
  // State
  products: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  filters: {
    category: '',
    search: '',
    minPrice: null,
    maxPrice: null,
    isActive: null,
    isFeatured: false,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    productsPerPage: 100,
  },

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Fetch all products with filters
  fetchProducts: async (page = 1, limit = 100) => {
    set({ isLoading: true, error: null });
    try {
      // Usar função shouldUseMockData em vez de forçar
      const useMock = shouldUseMockData();
      
      if (useMock) {
        // Usar dados mockados
        await simulateDelay();
        
        const { filters } = get();
        const filteredProducts = filterMockProducts(mockProducts, filters);
        
        // Paginação simulada
        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        const mappedProducts = paginatedProducts.map(mapMockProductToStore);
        
        set({
          products: mappedProducts,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalProducts: totalProducts,
            productsPerPage: limit,
          },
        });
      } else {
        // Usar API real
        const { filters } = get();
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(filters.category && { category: filters.category }),
          ...(filters.search && { search: filters.search }),
          ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
          ...(filters.isActive !== null && { isActive: filters.isActive.toString() }),
          ...(filters.isFeatured && { isFeatured: filters.isFeatured.toString() }),
        });

        const response = await api.get(`/products?${params}`);

        if (response.data.success) {
          set({
            products: response.data.data.products,
            pagination: {
              currentPage: response.data.data.pagination.currentPage,
              totalPages: response.data.data.pagination.totalPages,
              totalProducts: response.data.data.pagination.totalProducts,
              productsPerPage: response.data.data.pagination.productsPerPage,
            },
          });
        } else {
          set({ error: response.data.message });
          toast.error(response.data.message || 'Erro ao carregar produtos');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      const errorMessage = error.response?.status === 404
        ? 'Servidor indisponível. Usando dados de demonstração.'
        : error.response?.data?.message || 'Erro ao carregar produtos. Verifique sua conexão.';

      set({ error: errorMessage });
      toast.error(errorMessage);

      // Se API falhar, tentar carregar dados mockados como fallback
      if (!shouldUseMockData()) {
        console.log('API falhou, carregando dados mockados como fallback...');
        await simulateDelay();
        const { filters } = get();
        const filteredProducts = filterMockProducts(mockProducts, filters);
        const mappedProducts = filteredProducts.slice(0, limit).map(mapMockProductToStore);

        set({
          products: mappedProducts,
          pagination: {
            currentPage: 1,
            totalPages: Math.ceil(filteredProducts.length / limit),
            totalProducts: filteredProducts.length,
            productsPerPage: limit,
          },
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch featured products
  fetchFeaturedProducts: async () => {
    set({ isLoading: true });
    try {
      const useMock = shouldUseMockData();
      if (useMock) {
        await simulateDelay(300);
        const featuredProducts = mockFeaturedProducts.map(mapMockProductToStore);
        set({ featuredProducts });
      } else {
        const response = await api.get('/products/featured');

        if (response.data.success) {
          set({ featuredProducts: response.data.data.products });
        } else {
          set({ error: response.data.message });
          toast.error(response.data.message || 'Erro ao carregar produtos em destaque');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);

      // Tentar fallback para dados mockados
      if (!shouldUseMockData()) {
        console.log('API falhou, usando produtos mockados em destaque como fallback...');
        await simulateDelay(300);
        const featuredProducts = mockFeaturedProducts.map(mapMockProductToStore);
        set({ featuredProducts });
      } else {
        const errorMessage = 'Erro ao carregar produtos em destaque. Verifique sua conexão.';
        set({ error: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const useMock = shouldUseMockData();
      if (useMock) {
        await simulateDelay(200);
        set({ categories: mockCategories });
      } else {
        const response = await api.get('/products/categories');

        if (response.data.success) {
          set({ categories: response.data.data.categories });
        } else {
          toast.error(response.data.message || 'Erro ao carregar categorias');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);

      // Tentar fallback para dados mockados
      if (!shouldUseMockData()) {
        console.log('API falhou, usando categorias mockadas como fallback...');
        await simulateDelay(200);
        set({ categories: mockCategories });
      }
    }
  },

  // Fetch single product
  fetchProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      if (shouldUseMockData()) {
        await simulateDelay(300);
        const mockProduct = mockProducts.find(product => product.id === id);
        
        if (mockProduct) {
          const mappedProduct = mapMockProductToStore(mockProduct);
          set({ currentProduct: mappedProduct });
          return mappedProduct;
        } else {
          set({ error: 'Produto não encontrado' });
          return null;
        }
      } else {
        const response = await api.get(`/products/${id}`);

        if (response.data.success) {
          set({ currentProduct: response.data.data.product });
          return response.data.data.product;
        } else {
          const errorMessage = response.data.message || 'Produto não encontrado';
          set({ error: errorMessage });
          toast.error(errorMessage);
          return null;
        }
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);

      // Tentar fallback para dados mockados
      if (!shouldUseMockData()) {
        console.log('API falhou, procurando produto nos dados mockados...');
        await simulateDelay(300);
        const mockProduct = mockProducts.find(product => product.id === id);

        if (mockProduct) {
          const mappedProduct = mapMockProductToStore(mockProduct);
          set({ currentProduct: mappedProduct });
          return mappedProduct;
        }
      }

      const errorMessage = 'Produto não encontrado. Verifique sua conexão.';
      set({ error: errorMessage });
      toast.error(errorMessage);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Search products
  searchProducts: async (query) => {
    set({
      filters: { ...get().filters, search: query },
    });
    await get().fetchProducts(1);
  },

  // Filter by category
  filterByCategory: async (category) => {
    set({
      filters: { ...get().filters, category },
    });
    await get().fetchProducts(1);
  },

  // Filter by price range
  filterByPrice: async (minPrice, maxPrice) => {
    set({
      filters: { ...get().filters, minPrice, maxPrice },
    });
    await get().fetchProducts(1);
  },

  // Toggle featured filter
  toggleFeaturedFilter: async () => {
    const currentFilters = get().filters;
    set({
      filters: { ...currentFilters, isFeatured: !currentFilters.isFeatured },
    });
    await get().fetchProducts(1);
  },

  // Clear all filters
  clearFilters: async () => {
    set({
      filters: {
        category: '',
        search: '',
        minPrice: null,
        maxPrice: null,
        isActive: null,
        isFeatured: false,
      },
    });
    await get().fetchProducts(1);
  },

  // Load more products (pagination)
  loadMore: async () => {
    const { pagination } = get();
    if (pagination.currentPage < pagination.totalPages) {
      await get().fetchProducts(pagination.currentPage + 1);
    }
  },

  // Go to specific page
  goToPage: async (page) => {
    await get().fetchProducts(page);
  },

  // Get products by category (cached)
  getProductsByCategory: (category) => {
    const { products } = get();
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  },

  // Get product recommendations
  getRecommendations: (productId, limit = 4) => {
    const { products, currentProduct } = get();
    
    if (!currentProduct && !productId) return [];

    const targetProduct = currentProduct || products.find(p => p.id === productId);
    if (!targetProduct) return [];

    // Get products from same category, excluding current product
    const sameCategory = products.filter(product => 
      product.category === targetProduct.category && 
      product.id !== targetProduct.id &&
      product.isActive
    );

    // If not enough products in same category, add products from other categories
    if (sameCategory.length < limit) {
      const otherProducts = products.filter(product =>
        product.category !== targetProduct.category &&
        product.id !== targetProduct.id &&
        product.isActive
      );
      
      return [...sameCategory, ...otherProducts].slice(0, limit);
    }

    return sameCategory.slice(0, limit);
  },

  // Get price range for all products
  getPriceRange: () => {
    const { products } = get();
    if (products.length === 0) return { min: 0, max: 100 };

    const prices = products.map(product => {
      const price = product.discount > 0 
        ? product.price * (1 - product.discount / 100)
        : product.price;
      return parseFloat(price);
    });

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  },

  // Sort products
  sortProducts: (sortBy) => {
    const { products } = get();
    let sortedProducts = [...products];

    switch (sortBy) {
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sortedProducts.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'featured':
        sortedProducts.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
        break;
      default:
        break;
    }

    set({ products: sortedProducts });
  },

  // Check if product is in stock
  isProductInStock: (productId) => {
    const { products } = get();
    const product = products.find(p => p.id === productId);
    
    if (!product) return false;
    if (!product.hasStock) return product.isActive;
    
    return product.isActive && product.stock > 0;
  },

  // Get product stock level
  getStockLevel: (productId) => {
    const { products } = get();
    const product = products.find(p => p.id === productId);
    
    if (!product || !product.hasStock) return null;
    
    if (product.stock === 0) return 'out';
    if (product.stock <= 5) return 'low';
    if (product.stock <= 20) return 'medium';
    return 'high';
  },

  // Clear current product
  clearCurrentProduct: () => set({ currentProduct: null }),

  // Refresh products (force reload)
  refreshProducts: async () => {
    const { pagination } = get();
    await get().fetchProducts(pagination.currentPage);
  },
}));

export { useProductStore };
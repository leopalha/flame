const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Product extends Model {
  // Verificar se produto está disponível
  isAvailable() {
    return this.isActive && (!this.hasStock || this.stock > 0);
  }

  // Aplicar desconto (se houver promoção)
  getPriceWithDiscount() {
    if (this.discountPercentage && this.discountPercentage > 0) {
      return this.price * (1 - this.discountPercentage / 100);
    }
    return this.price;
  }

  // Verificar se é item vegetariano
  isVegetarian() {
    return this.dietary && this.dietary.includes('vegetariano');
  }

  // Verificar se é sem lactose
  isLactoseFree() {
    return this.dietary && this.dietary.includes('sem_lactose');
  }
}

Product.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  category: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    allowNull: false,
    validate: {
      isIn: [[
        'bebidas_alcoolicas',
        'bebidas_nao_alcoolicas',
        'drinks_autorais',
        'petiscos',
        'pratos_principais',
        'sobremesas',
        'porcoes',
        'combos'
      ]]
    }
  },
  subcategory: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    // Validação isUrl removida para permitir caminhos relativos /images/cardapio/
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  allergens: {
    type: DataTypes.TEXT, // JSON string para compatibilidade com SQLite
    allowNull: true,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('allergens');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('allergens', JSON.stringify(value || []));
    }
  },
  dietary: {
    type: DataTypes.TEXT, // JSON string para compatibilidade com SQLite
    allowNull: true,
    defaultValue: '[]', // ['vegetariano', 'vegano', 'sem_lactose', 'sem_gluten']
    get() {
      const value = this.getDataValue('dietary');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('dietary', JSON.stringify(value || []));
    },
    validate: {
      isValidDietary(value) {
        const validOptions = ['vegetariano', 'vegano', 'sem_lactose', 'sem_gluten'];
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (parsed && Array.isArray(parsed)) {
          for (const item of parsed) {
            if (!validOptions.includes(item)) {
              throw new Error(`Opção dietary inválida: ${item}`);
            }
          }
        }
      }
    }
  },
  preparationTime: {
    type: DataTypes.INTEGER, // em minutos
    allowNull: true,
    defaultValue: 15
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPromotional: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  hasStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // true se controla estoque
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  minStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 5
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // para ordenação no cardápio
  },
  tags: {
    type: DataTypes.TEXT, // JSON string para compatibilidade com SQLite
    allowNull: true,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('tags');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    }
  },
  isSignature: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // produto destaque da casa
  },
  alcoholicContent: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true // % de álcool (apenas para bebidas)
  },
  volume: {
    type: DataTypes.STRING(20),
    allowNull: true // ex: "300ml", "1L", "Dose"
  },
  spiceLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 5 // 0 = não picante, 5 = muito picante
    }
  }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['position']
    },
    {
      fields: ['name'],
      type: 'fulltext'
    }
  ],
  hooks: {
    beforeSave: (product) => {
      // Normalizar dados
      if (product.name) {
        product.name = product.name.trim();
      }
      
      // Se não controla estoque, definir como disponível
      if (!product.hasStock) {
        product.stock = null;
      }
    }
  }
});

module.exports = Product;
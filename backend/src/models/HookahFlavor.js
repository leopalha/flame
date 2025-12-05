const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HookahFlavor = sequelize.define('HookahFlavor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('frutas', 'mentol', 'especial', 'classico', 'premium'),
    defaultValue: 'classico',
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 25.00,
    comment: 'Preço base por 30 minutos',
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  popularity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Número de sessões com este sabor',
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    comment: 'Rating médio (0-5)',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'hookah_flavors',
  timestamps: true,
  indexes: [
    {
      fields: ['category'],
    },
    {
      fields: ['inStock'],
    },
    {
      fields: ['popularity'],
      name: 'idx_hookah_flavors_popularity',
    },
  ],
});

// Instance Methods
HookahFlavor.prototype.isAvailable = function() {
  return this.inStock === true;
};

HookahFlavor.prototype.getPriceForDuration = function(durationMinutes) {
  const baseDuration = 30;
  const additionalBlocks = Math.ceil((durationMinutes - baseDuration) / 15);
  const additionalCost = additionalBlocks * (this.price * 0.25); // 25% da base por 15min
  return parseFloat((this.price + additionalCost).toFixed(2));
};

HookahFlavor.prototype.incrementPopularity = function() {
  this.popularity = (this.popularity || 0) + 1;
  return this.save();
};

// Static Methods
HookahFlavor.getPopularFlavors = function(limit = 5) {
  return this.findAll({
    where: { inStock: true },
    order: [['popularity', 'DESC']],
    limit,
  });
};

HookahFlavor.getByCategory = function(category) {
  return this.findAll({
    where: { category, inStock: true },
    order: [['name', 'ASC']],
  });
};

module.exports = HookahFlavor;

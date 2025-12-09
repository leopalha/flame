const { sequelize } = require('../config/database');

// Import models
const User = require('./User');
const Product = require('./Product');
const Table = require('./Table');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const InventoryMovement = require('./InventoryMovement');
const HookahFlavor = require('./HookahFlavor');
const HookahSession = require('./HookahSession');
const Reservation = require('./Reservation');
const CashbackHistory = require('./CashbackHistory');
const Cashier = require('./Cashier');
const CashierMovement = require('./CashierMovement');
const PushSubscription = require('./PushSubscription');
const Campaign = require('./Campaign');
const Ingredient = require('./Ingredient');
const RecipeItem = require('./RecipeItem');
const IngredientMovement = require('./IngredientMovement');
const Message = require('./Message');
const SplitPayment = require('./SplitPayment');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Order, { 
    foreignKey: 'userId', 
    as: 'orders' 
  });
  
  User.hasMany(Order, { 
    foreignKey: 'attendantId', 
    as: 'attendedOrders' 
  });
  
  User.hasMany(Order, { 
    foreignKey: 'kitchenUserId', 
    as: 'preparedOrders' 
  });

  // Table associations
  Table.hasMany(Order, { 
    foreignKey: 'tableId', 
    as: 'orders' 
  });

  // Order associations
  Order.belongsTo(User, { 
    foreignKey: 'userId', 
    as: 'customer' 
  });
  
  Order.belongsTo(Table, { 
    foreignKey: 'tableId', 
    as: 'table' 
  });
  
  Order.belongsTo(User, { 
    foreignKey: 'attendantId', 
    as: 'attendant' 
  });
  
  Order.belongsTo(User, { 
    foreignKey: 'kitchenUserId', 
    as: 'kitchenUser' 
  });

  Order.hasMany(OrderItem, { 
    foreignKey: 'orderId', 
    as: 'items' 
  });

  // Product associations
  Product.hasMany(OrderItem, { 
    foreignKey: 'productId', 
    as: 'orderItems' 
  });

  // OrderItem associations
  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
  });

  OrderItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
  });

  // InventoryMovement associations
  InventoryMovement.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
  });

  InventoryMovement.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
  });

  InventoryMovement.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Product.hasMany(InventoryMovement, {
    foreignKey: 'productId',
    as: 'movements'
  });

  Order.hasMany(InventoryMovement, {
    foreignKey: 'orderId',
    as: 'movements'
  });

  // HookahSession associations
  Table.hasMany(HookahSession, {
    foreignKey: 'mesaId',
    as: 'hookahSessions'
  });

  HookahSession.belongsTo(Table, {
    foreignKey: 'mesaId',
    as: 'Table'
  });

  HookahSession.belongsTo(HookahFlavor, {
    foreignKey: 'flavorId',
    as: 'HookahFlavor'
  });

  HookahFlavor.hasMany(HookahSession, {
    foreignKey: 'flavorId',
    as: 'sessions'
  });

  // Reservation associations
  User.hasMany(Reservation, {
    foreignKey: 'userId',
    as: 'reservations'
  });

  Reservation.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Table.hasMany(Reservation, {
    foreignKey: 'tableId',
    as: 'reservations'
  });

  Reservation.belongsTo(Table, {
    foreignKey: 'tableId',
    as: 'table'
  });

  // CashbackHistory associations
  User.hasMany(CashbackHistory, {
    foreignKey: 'userId',
    as: 'cashbackHistory'
  });

  CashbackHistory.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Order.hasMany(CashbackHistory, {
    foreignKey: 'orderId',
    as: 'cashbackHistory'
  });

  CashbackHistory.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
  });

  // Cashier associations
  User.hasMany(Cashier, {
    foreignKey: 'operatorId',
    as: 'cashiers'
  });

  Cashier.belongsTo(User, {
    foreignKey: 'operatorId',
    as: 'operator'
  });

  Cashier.belongsTo(User, {
    foreignKey: 'closedBy',
    as: 'closer'
  });

  Cashier.hasMany(CashierMovement, {
    foreignKey: 'cashierId',
    as: 'movements'
  });

  // CashierMovement associations
  CashierMovement.belongsTo(Cashier, {
    foreignKey: 'cashierId',
    as: 'cashier'
  });

  CashierMovement.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });

  CashierMovement.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
  });

  User.hasMany(CashierMovement, {
    foreignKey: 'createdBy',
    as: 'cashierMovements'
  });

  Order.hasMany(CashierMovement, {
    foreignKey: 'orderId',
    as: 'cashierMovements'
  });

  // PushSubscription associations
  User.hasMany(PushSubscription, {
    foreignKey: 'userId',
    as: 'pushSubscriptions'
  });

  PushSubscription.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // Campaign associations
  User.hasMany(Campaign, {
    foreignKey: 'createdBy',
    as: 'campaigns'
  });

  Campaign.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });

  // Ingredient associations (Ficha Técnica)
  Ingredient.hasMany(RecipeItem, {
    foreignKey: 'ingredientId',
    as: 'recipeItems'
  });

  Ingredient.hasMany(IngredientMovement, {
    foreignKey: 'ingredientId',
    as: 'movements'
  });

  RecipeItem.belongsTo(Ingredient, {
    foreignKey: 'ingredientId',
    as: 'ingredient'
  });

  RecipeItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
  });

  Product.hasMany(RecipeItem, {
    foreignKey: 'productId',
    as: 'recipe'
  });

  IngredientMovement.belongsTo(Ingredient, {
    foreignKey: 'ingredientId',
    as: 'ingredient'
  });

  IngredientMovement.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
  });

  IngredientMovement.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // Sprint 56: Message associations (Chat staff-cliente)
  Message.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
  });

  Message.belongsTo(User, {
    foreignKey: 'senderId',
    as: 'sender'
  });

  Order.hasMany(Message, {
    foreignKey: 'orderId',
    as: 'messages'
  });

  User.hasMany(Message, {
    foreignKey: 'senderId',
    as: 'sentMessages'
  });

  // Sprint 60: SplitPayment associations (Divisão de Conta)
  SplitPayment.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order'
  });

  SplitPayment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Order.hasMany(SplitPayment, {
    foreignKey: 'orderId',
    as: 'splitPayments'
  });

  User.hasMany(SplitPayment, {
    foreignKey: 'userId',
    as: 'splitPayments'
  });
};

// Initialize associations
defineAssociations();

// Sync database
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Banco de dados sincronizado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
    return false;
  }
};

// Create database tables
const createTables = async () => {
  try {
    // Create tables in the correct order (respecting foreign keys)
    // Using { alter: false } to prevent infinite loop
    await User.sync();
    console.log('✅ Tabela users criada/atualizada');

    await Product.sync();
    console.log('✅ Tabela products criada/atualizada');

    await Table.sync();
    console.log('✅ Tabela tables criada/atualizada');

    await Order.sync();
    console.log('✅ Tabela orders criada/atualizada');

    await OrderItem.sync();
    console.log('✅ Tabela order_items criada/atualizada');

    await InventoryMovement.sync();
    console.log('✅ Tabela inventory_movements criada/atualizada');

    await HookahFlavor.sync();
    console.log('✅ Tabela hookah_flavors criada/atualizada');

    await HookahSession.sync();
    console.log('✅ Tabela hookah_sessions criada/atualizada');

    await Reservation.sync();
    console.log('✅ Tabela reservations criada/atualizada');

    await CashbackHistory.sync();
    console.log('✅ Tabela cashback_history criada/atualizada');

    await Cashier.sync();
    console.log('✅ Tabela cashiers criada/atualizada');

    await CashierMovement.sync();
    console.log('✅ Tabela cashier_movements criada/atualizada');

    await PushSubscription.sync();
    console.log('✅ Tabela push_subscriptions criada/atualizada');

    await Campaign.sync();
    console.log('✅ Tabela campaigns criada/atualizada');

    return true;
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    return false;
  }
};

// Drop all tables (use with caution!)
const dropTables = async () => {
  try {
    await sequelize.drop();
    console.log('✅ Todas as tabelas foram removidas');
    return true;
  } catch (error) {
    console.error('❌ Erro ao remover tabelas:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  Table,
  Order,
  OrderItem,
  InventoryMovement,
  HookahFlavor,
  HookahSession,
  Reservation,
  CashbackHistory,
  Cashier,
  CashierMovement,
  PushSubscription,
  Campaign,
  Ingredient,
  RecipeItem,
  IngredientMovement,
  Message,
  SplitPayment,
  syncDatabase,
  createTables,
  dropTables
};
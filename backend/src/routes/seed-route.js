const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Seed users endpoint (protegido por chave secreta)
router.post('/seed-users', async (req, res) => {
  // Chave secreta para proteção
  const secretKey = req.headers['x-seed-key'] || req.body.secretKey;
  if (secretKey !== 'FLAME2024SEED') {
    return res.status(403).json({ success: false, message: 'Chave inválida' });
  }

  try {
    const usersData = [
      { nome: 'Administrador FLAME', email: 'admin@flamelounge.com.br', celular: '(11) 99999-0001', cpf: '000.000.000-01', password: 'admin123', role: 'admin' },
      { nome: 'Gerente FLAME', email: 'gerente@flamelounge.com.br', celular: '(11) 99999-0002', cpf: '000.000.000-02', password: 'gerente123', role: 'gerente' },
      { nome: 'Cozinheiro FLAME', email: 'cozinha@flamelounge.com.br', celular: '(11) 99999-0003', cpf: '000.000.000-03', password: 'cozinha123', role: 'cozinha' },
      { nome: 'Barman FLAME', email: 'bar@flamelounge.com.br', celular: '(11) 99999-0004', cpf: '000.000.000-04', password: 'bar123', role: 'bar' },
      { nome: 'Atendente FLAME', email: 'atendente@flamelounge.com.br', celular: '(11) 99999-0005', cpf: '000.000.000-05', password: 'atendente123', role: 'atendente' },
      { nome: 'Caixa FLAME', email: 'caixa@flamelounge.com.br', celular: '(11) 99999-0006', cpf: '000.000.000-06', password: 'caixa123', role: 'caixa' },
      { nome: 'Cliente Teste', email: 'cliente@flamelounge.com.br', celular: '(11) 99999-0007', cpf: '000.000.000-07', password: 'cliente123', role: 'cliente' }
    ];

    const results = [];
    for (const userData of usersData) {
      // NÃO fazer hash manual - o hook beforeSave do modelo fará automaticamente
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          nome: userData.nome,
          email: userData.email,
          celular: userData.celular,
          cpf: userData.cpf,
          password: userData.password, // Hook beforeSave fará o hash
          role: userData.role,
          isActive: true,
          emailVerified: true,
          phoneVerified: true,
          profileComplete: true,
          totalOrders: 0,
          totalSpent: 0,
          cashbackBalance: userData.role === 'cliente' ? 50 : 0,
          loyaltyTier: userData.role === 'cliente' ? 'bronze' : null
        }
      });
      results.push({ email: userData.email, role: userData.role, created });
    }

    res.json({ success: true, message: 'Users seeded', data: results });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user email endpoint - para corrigir usuários de teste
router.post('/update-user-email', async (req, res) => {
  const secretKey = req.headers['x-seed-key'] || req.body.secretKey;
  if (secretKey !== 'FLAME2024SEED') {
    return res.status(403).json({ success: false, message: 'Chave inválida' });
  }

  try {
    const { celular, newEmail, newNome } = req.body;

    if (!celular || !newEmail) {
      return res.status(400).json({
        success: false,
        message: 'celular e newEmail são obrigatórios'
      });
    }

    const user = await User.findOne({ where: { celular } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado com este celular'
      });
    }

    // Atualizar email e nome se fornecido
    user.email = newEmail;
    if (newNome) {
      user.nome = newNome;
    }
    await user.save();

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        celular: user.celular
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset users endpoint - deleta e recria
router.post('/reset-users', async (req, res) => {
  const secretKey = req.headers['x-seed-key'] || req.body.secretKey;
  if (secretKey !== 'FLAME2024SEED') {
    return res.status(403).json({ success: false, message: 'Chave inválida' });
  }

  try {
    const usersData = [
      { nome: 'Leonardo Palha', email: 'leonardo.palha@gmail.com', celular: '+5521995354010', cpf: null, password: 'Leo@2024', role: 'admin' },
      { nome: 'Administrador FLAME', email: 'admin@flamelounge.com.br', celular: '(11) 99999-0001', cpf: '000.000.000-01', password: 'admin123', role: 'admin' },
      { nome: 'Gerente FLAME', email: 'gerente@flamelounge.com.br', celular: '(11) 99999-0002', cpf: '000.000.000-02', password: 'gerente123', role: 'gerente' },
      { nome: 'Cozinheiro FLAME', email: 'cozinha@flamelounge.com.br', celular: '(11) 99999-0003', cpf: '000.000.000-03', password: 'cozinha123', role: 'cozinha' },
      { nome: 'Barman FLAME', email: 'bar@flamelounge.com.br', celular: '(11) 99999-0004', cpf: '000.000.000-04', password: 'bar123', role: 'bar' },
      { nome: 'Atendente FLAME', email: 'atendente@flamelounge.com.br', celular: '(11) 99999-0005', cpf: '000.000.000-05', password: 'atendente123', role: 'atendente' },
      { nome: 'Caixa FLAME', email: 'caixa@flamelounge.com.br', celular: '(11) 99999-0006', cpf: '000.000.000-06', password: 'caixa123', role: 'caixa' },
      { nome: 'Cliente Teste', email: 'cliente@flamelounge.com.br', celular: '(11) 99999-0007', cpf: '000.000.000-07', password: 'cliente123', role: 'cliente' }
    ];

    // Deletar usuários existentes
    const emails = usersData.map(u => u.email);
    await User.destroy({
      where: {
        email: emails
      }
    });

    // Criar novos usuários
    const results = [];
    for (const userData of usersData) {
      // NÃO fazer hash aqui - o hook beforeSave do model fará
      const user = await User.create({
        nome: userData.nome,
        email: userData.email,
        celular: userData.celular,
        cpf: userData.cpf,
        password: userData.password, // Senha em texto plano - hook fará o hash
        role: userData.role,
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        totalOrders: 0,
        totalSpent: 0,
        cashbackBalance: userData.role === 'cliente' ? 50 : 0,
        loyaltyTier: userData.role === 'cliente' ? 'bronze' : null
      });
      results.push({ email: user.email, role: user.role, id: user.id });
    }

    res.json({ success: true, message: 'Users reset successfully', data: results });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fix passwords endpoint - atualiza APENAS a senha dos usuários de teste (SEM deletar)
router.post('/fix-passwords', async (req, res) => {
  const secretKey = req.headers['x-seed-key'] || req.body.secretKey;
  if (secretKey !== 'FLAME2024SEED') {
    return res.status(403).json({ success: false, message: 'Chave inválida' });
  }

  try {
    const usersToFix = [
      { email: 'admin@flamelounge.com.br', password: 'admin123' },
      { email: 'gerente@flamelounge.com.br', password: 'gerente123' },
      { email: 'cozinha@flamelounge.com.br', password: 'cozinha123' },
      { email: 'bar@flamelounge.com.br', password: 'bar123' },
      { email: 'atendente@flamelounge.com.br', password: 'atendente123' },
      { email: 'caixa@flamelounge.com.br', password: 'caixa123' },
      { email: 'cliente@flamelounge.com.br', password: 'cliente123' }
    ];

    const results = [];
    for (const { email, password } of usersToFix) {
      const user = await User.findOne({ where: { email } });
      if (user) {
        // Atualizar senha diretamente - o hook beforeSave fará o hash
        user.password = password;
        user.profileComplete = true;
        await user.save();
        results.push({ email, updated: true });
      } else {
        results.push({ email, updated: false, reason: 'User not found' });
      }
    }

    res.json({ success: true, message: 'Passwords fixed', data: results });
  } catch (error) {
    console.error('Fix passwords error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Seed products endpoint - produtos básicos para começar
router.post('/seed-products', async (req, res) => {
  const secretKey = req.headers['x-seed-key'] || req.body.secretKey;
  if (secretKey !== 'FLAME2024SEED') {
    return res.status(403).json({ success: false, message: 'Chave inválida' });
  }

  try {
    const { Product } = require('../models');

    // Produtos essenciais para teste
    const products = [
      { name: 'Caipirinha Clássica', description: 'Cachaça, limão e açúcar', price: 28.00, category: 'bebidas_alcoolicas', subcategory: 'Drinks', stock: 50, hasStock: true, isActive: true, isFeatured: true, preparationTime: 5 },
      { name: 'Gin Tônica', description: 'Gin premium e tônica Fever-Tree', price: 38.00, category: 'bebidas_alcoolicas', subcategory: 'Drinks', stock: 50, hasStock: true, isActive: true, isFeatured: true, preparationTime: 5 },
      { name: 'Mojito', description: 'Rum, hortelã, limão e açúcar', price: 32.00, category: 'bebidas_alcoolicas', subcategory: 'Drinks', stock: 50, hasStock: true, isActive: true, preparationTime: 5 },
      { name: 'Cerveja Heineken', description: 'Cerveja premium 330ml', price: 12.00, category: 'bebidas_alcoolicas', subcategory: 'Cervejas', stock: 100, hasStock: true, isActive: true, preparationTime: 1 },
      { name: 'Batata Rústica', description: 'Batatas com bacon e queijo', price: 32.00, category: 'petiscos', subcategory: 'Petiscos', stock: 30, hasStock: true, isActive: true, preparationTime: 15 },
      { name: 'Hambúrguer FLAME', description: 'Burger artesanal 200g', price: 42.00, category: 'pratos_principais', subcategory: 'Burgers', stock: 20, hasStock: true, isActive: true, preparationTime: 25 },
      { name: 'Coca-Cola', description: 'Refrigerante 350ml', price: 7.00, category: 'bebidas_nao_alcoolicas', subcategory: 'Refrigerantes', stock: 200, hasStock: true, isActive: true, preparationTime: 1 },
      { name: 'Água Mineral', description: 'Água sem gás 500ml', price: 5.00, category: 'bebidas_nao_alcoolicas', subcategory: 'Água', stock: 200, hasStock: true, isActive: true, preparationTime: 1 }
    ];

    const results = [];
    for (const p of products) {
      const [product, created] = await Product.findOrCreate({
        where: { name: p.name },
        defaults: p
      });
      results.push({ name: p.name, created });
    }

    const createdCount = results.filter(r => r.created).length;
    const existingCount = results.length - createdCount;

    res.json({
      success: true,
      message: `${createdCount} produtos criados, ${existingCount} já existiam`,
      data: { created: createdCount, existing: existingCount, total: results.length }
    });
  } catch (error) {
    console.error('Seed products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Seed products in bulk - aceita array de produtos via body
router.post('/seed-products-bulk', async (req, res) => {
  const secretKey = req.headers['x-seed-key'] || req.body.secretKey;
  if (secretKey !== 'FLAME2024SEED') {
    return res.status(403).json({ success: false, message: 'Chave inválida' });
  }

  try {
    const { Product } = require('../models');
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Campo "products" deve ser um array de produtos'
      });
    }

    const results = [];
    for (const p of products) {
      try {
        const [product, created] = await Product.findOrCreate({
          where: { name: p.name },
          defaults: p
        });
        results.push({ name: p.name, created, success: true });
      } catch (error) {
        results.push({ name: p.name, created: false, success: false, error: error.message });
      }
    }

    const createdCount = results.filter(r => r.created).length;
    const existingCount = results.filter(r => r.success && !r.created).length;
    const errorCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `${createdCount} produtos criados, ${existingCount} já existiam, ${errorCount} erros`,
      data: { created: createdCount, existing: existingCount, errors: errorCount, total: products.length }
    });
  } catch (error) {
    console.error('Seed products bulk error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

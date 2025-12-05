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
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          nome: userData.nome,
          email: userData.email,
          celular: userData.celular,
          cpf: userData.cpf,
          password: hashedPassword,
          role: userData.role,
          isActive: true,
          emailVerified: true,
          phoneVerified: true,
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
      { nome: 'Leonardo Palha', email: 'leonardo.palha@gmail.com', celular: '(21) 98765-4321', cpf: '123.456.789-01', password: 'Leo@2024', role: 'admin' },
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

module.exports = router;

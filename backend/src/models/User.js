const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

class User extends Model {
  // Método para verificar senha
  async checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  // Remover dados sensíveis ao serializar
  toJSON() {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.smsCode;
    delete values.smsAttempts;
    delete values.smsCodeExpiry;
    return values;
  }

  // Verificar se usuário é admin
  isAdmin() {
    return this.role === 'admin';
  }

  // Verificar se usuário é funcionário
  isEmployee() {
    return ['admin', 'atendente', 'cozinha'].includes(this.role);
  }

  // Verificar se o perfil está completo
  hasCompleteProfile() {
    // Google: Precisa apenas de nome + email (já vem do Google)
    if (this.authProvider === 'google') {
      return !!(this.nome && this.email && this.googleId);
    }

    // Local/Phone: Precisa de nome + email + profileComplete marcado
    return !!(this.nome && this.email && this.profileComplete);
  }

  // Sistema de Cashback - Calcular tier baseado em totalSpent
  calculateTier() {
    const spent = parseFloat(this.totalSpent) || 0;
    if (spent >= 10000) return 'platinum';
    if (spent >= 5000) return 'gold';
    if (spent >= 1000) return 'silver';
    return 'bronze';
  }

  // Atualizar tier automaticamente
  async updateTier() {
    const newTier = this.calculateTier();
    if (this.loyaltyTier !== newTier) {
      this.loyaltyTier = newTier;
      await this.save();
      return newTier;
    }
    return null;
  }

  // Adicionar cashback (% do valor gasto)
  async addCashback(amount, orderId = null, description = null) {
    const balanceBefore = parseFloat(this.cashbackBalance) || 0;
    this.cashbackBalance = (balanceBefore + amount).toFixed(2);
    const balanceAfter = parseFloat(this.cashbackBalance);

    await this.updateTier();
    await this.save();

    // Registrar no histórico
    const CashbackHistory = require('./CashbackHistory');
    await CashbackHistory.create({
      userId: this.id,
      orderId,
      amount,
      type: 'earned',
      description,
      balanceBefore,
      balanceAfter
    });
  }

  // Usar cashback (retorna quanto foi usado)
  async useCashback(maxAmount, description = 'Usado no pedido') {
    const balance = parseFloat(this.cashbackBalance) || 0;
    const amountToUse = Math.min(balance, maxAmount);

    if (amountToUse <= 0) {
      return 0;
    }

    const balanceBefore = balance;
    this.cashbackBalance = (balance - amountToUse).toFixed(2);
    const balanceAfter = parseFloat(this.cashbackBalance);
    await this.save();

    // Registrar no histórico
    const CashbackHistory = require('./CashbackHistory');
    await CashbackHistory.create({
      userId: this.id,
      amount: -amountToUse,
      type: 'redeemed',
      description,
      balanceBefore,
      balanceAfter
    });

    return amountToUse;
  }

  // Benefícios por tier
  getTierBenefits() {
    const benefits = {
      bronze: {
        name: 'Bronze',
        cashbackRate: 2, // 2%
        perks: ['2% de cashback em todas as compras']
      },
      silver: {
        name: 'Prata',
        cashbackRate: 5, // 5%
        perks: ['5% de cashback', 'Prioridade em reservas', 'R$ 50 no aniversário']
      },
      gold: {
        name: 'Ouro',
        cashbackRate: 8, // 8%
        perks: ['8% de cashback', 'Mesa reservada', 'R$ 100 no aniversário', '1 drink cortesia/mês']
      },
      platinum: {
        name: 'Platina',
        cashbackRate: 10, // 10%
        perks: ['10% de cashback', 'Mesa VIP', 'R$ 200 no aniversário', '2 drinks cortesia/mês', 'Eventos exclusivos']
      }
    };
    return benefits[this.loyaltyTier] || benefits.bronze;
  }

  // Info para próximo tier
  getNextTierInfo() {
    const spent = parseFloat(this.totalSpent) || 0;
    const tierThresholds = {
      bronze: { next: 'silver', required: 1000 },
      silver: { next: 'gold', required: 5000 },
      gold: { next: 'platinum', required: 10000 },
      platinum: { next: null, required: null }
    };

    const info = tierThresholds[this.loyaltyTier];
    if (!info.next) {
      return null;
    }

    return {
      currentTier: this.loyaltyTier,
      nextTier: info.next,
      requiredSpent: info.required,
      currentSpent: spent,
      remaining: Math.max(0, info.required - spent),
      progress: Math.min(100, (spent / info.required) * 100)
    };
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: true, // CPF opcional no cadastro
    unique: true,
    validate: {
      is: {
        args: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        msg: 'CPF deve estar no formato 000.000.000-00'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true, // Email pode ser null para cadastro por celular
    unique: true,
    validate: {
      isEmail: true
    }
  },
  celular: {
    type: DataTypes.STRING(20), // Aumentado para suportar números internacionais
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
      // Validação de formato removida para permitir migração de dados antigos
      // A validação agora é feita apenas no middleware de validação
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Pode ser null para usuários que só usam SMS
    validate: {
      len: [6, 100]
    }
  },
  role: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    defaultValue: 'cliente',
    allowNull: false,
    validate: {
      isIn: [['cliente', 'atendente', 'cozinha', 'bar', 'caixa', 'gerente', 'admin']]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  profileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Indica se o usuário completou todas as informações do perfil (nome, email)'
  },
  smsCode: {
    type: DataTypes.STRING(6), // Atualizado para 6 dígitos
    allowNull: true
  },
  smsAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  smsCodeExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // CRM Metrics
  totalOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalSpent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  lastVisit: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastOrderDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Cashback System
  cashbackBalance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Saldo disponível de cashback em R$'
  },
  loyaltyTier: {
    type: DataTypes.TEXT,
    defaultValue: 'bronze',
    validate: {
      isIn: [['bronze', 'silver', 'gold', 'platinum']]
    },
    comment: 'Tier calculado baseado em totalSpent'
  },
  // Google OAuth Fields
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'ID único do Google OAuth'
  },
  googleProfilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL da foto de perfil do Google'
  },
  authProvider: {
    type: DataTypes.TEXT,
    defaultValue: 'local',
    allowNull: false,
    validate: {
      isIn: [['local', 'google']]
    },
    comment: 'Provedor de autenticação utilizado (local, google)'
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    beforeSave: async (user) => {
      // Hash da senha se foi alterada
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
        user.password = await bcrypt.hash(user.password, salt);
      }

      // Normalizar dados
      if (user.email) {
        user.email = user.email.toLowerCase().trim();
      }
      if (user.nome) {
        user.nome = user.nome.trim();
      }
    }
  }
});

module.exports = User;
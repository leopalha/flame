const { User } = require('../models');
const { generateToken } = require('../middlewares/auth.middleware');
const smsService = require('../services/sms.service');
const { Op } = require('sequelize');

class AuthController {
  // Cadastro de usuário - Etapa 1: Dados básicos
  async register(req, res) {
    try {
      const { nome, cpf, email, celular, password } = req.body;

      // Verificar se já existe usuário com CPF, email ou celular
      const whereConditions = [
        { email },
        { celular }
      ];

      // Adicionar CPF na verificação apenas se fornecido
      if (cpf) {
        whereConditions.push({ cpf });
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: whereConditions
        }
      });

      if (existingUser) {
        let field = 'dados';
        if (cpf && existingUser.cpf === cpf) field = 'CPF';
        else if (existingUser.email === email) field = 'E-mail';
        else if (existingUser.celular === celular) field = 'Celular';

        return res.status(409).json({
          success: false,
          message: `${field} já cadastrado no sistema`
        });
      }

      // Gerar código SMS
      const smsCode = smsService.generateSMSCode();
      const smsCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

      // Criar usuário (ainda não verificado)
      // Remover cpf do objeto se for undefined ou vazio
      const userData = {
        nome,
        email,
        celular,
        password, // Senha será hashada automaticamente pelo hook beforeCreate do modelo
        smsCode,
        smsCodeExpiry,
        smsAttempts: 0,
        phoneVerified: false,
        emailVerified: false,
        role: 'cliente'
      };

      // Adicionar CPF apenas se fornecido
      if (cpf) {
        userData.cpf = cpf;
      }

      const user = await User.create(userData);

      // Enviar SMS
      const smsResult = await smsService.sendVerificationCode(celular, smsCode);

      if (!smsResult.success) {
        // Se falhou ao enviar SMS, apagar usuário criado
        await user.destroy();
        
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar código SMS',
          error: smsResult.error
        });
      }

      res.status(201).json({
        success: true,
        message: 'Usuário cadastrado! Código SMS enviado.',
        data: {
          userId: user.id,
          celular,
          smsExpiry: smsCodeExpiry
        }
      });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Validar código SMS - Etapa 2
  async verifySMS(req, res) {
    try {
      const { celular, code } = req.body;

      const user = await User.findOne({
        where: { celular }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Verificar se código expirou
      if (new Date() > user.smsCodeExpiry) {
        return res.status(400).json({
          success: false,
          message: 'Código SMS expirado. Solicite um novo código.'
        });
      }

      // Verificar tentativas
      if (user.smsAttempts >= 3) {
        return res.status(429).json({
          success: false,
          message: 'Muitas tentativas. Aguarde 15 minutos ou solicite novo código.'
        });
      }

      // Verificar código
      if (user.smsCode !== code) {
        // Incrementar tentativas
        await user.update({
          smsAttempts: user.smsAttempts + 1
        });

        return res.status(400).json({
          success: false,
          message: `Código incorreto. Tentativas restantes: ${2 - user.smsAttempts}`
        });
      }

      // Código correto - marcar celular como verificado
      await user.update({
        phoneVerified: true,
        smsCode: null,
        smsCodeExpiry: null,
        smsAttempts: 0
      });

      // Gerar token JWT
      const token = generateToken(user.id);

      // Enviar SMS de boas-vindas
      await smsService.sendWelcomeMessage(user.celular, user.nome);

      res.status(200).json({
        success: true,
        message: 'Cadastro concluído com sucesso!',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      console.error('Erro na verificação SMS:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Reenviar código SMS
  async resendSMS(req, res) {
    try {
      const { celular } = req.body;

      const user = await User.findOne({
        where: { celular }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      if (user.phoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Celular já verificado'
        });
      }

      // Verificar limite de tentativas (máx 3 códigos por hora)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (user.updatedAt > oneHourAgo && user.smsAttempts >= 3) {
        return res.status(429).json({
          success: false,
          message: 'Limite de tentativas atingido. Tente novamente em 1 hora.'
        });
      }

      // Gerar novo código
      const smsCode = smsService.generateSMSCode();
      const smsCodeExpiry = new Date(Date.now() + 5 * 60 * 1000);

      // Enviar SMS
      const smsResult = await smsService.sendVerificationCode(celular, smsCode);

      if (!smsResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao reenviar código SMS',
          error: smsResult.error
        });
      }

      // Atualizar usuário
      await user.update({
        smsCode,
        smsCodeExpiry,
        smsAttempts: 0
      });

      res.status(200).json({
        success: true,
        message: 'Novo código SMS enviado',
        data: {
          smsExpiry: smsCodeExpiry
        }
      });
    } catch (error) {
      console.error('Erro ao reenviar SMS:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Login via SMS (sem senha)
  async loginSMS(req, res) {
    try {
      const { celular } = req.body;

      const user = await User.findOne({
        where: { celular, isActive: true }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      if (!user.phoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Celular não verificado'
        });
      }

      // Gerar código SMS para login
      const smsCode = smsService.generateSMSCode();
      const smsCodeExpiry = new Date(Date.now() + 5 * 60 * 1000);

      const smsResult = await smsService.sendVerificationCode(celular, smsCode);

      if (!smsResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar código SMS',
          error: smsResult.error
        });
      }

      await user.update({
        smsCode,
        smsCodeExpiry,
        smsAttempts: 0
      });

      res.status(200).json({
        success: true,
        message: 'Código SMS enviado para login',
        data: {
          userId: user.id,
          smsExpiry: smsCodeExpiry
        }
      });
    } catch (error) {
      console.error('Erro no login SMS:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Login com email e senha
  async loginPassword(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { 
          email: email.toLowerCase(),
          isActive: true 
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: 'Usuário não possui senha. Use login por SMS.'
        });
      }

      const isPasswordValid = await user.checkPassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Atualizar último login
      await user.update({
        lastLogin: new Date()
      });

      const token = generateToken(user.id);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter dados do usuário logado
  async getMe(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar perfil
  async updateProfile(req, res) {
    try {
      const { nome, email } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const updatedData = {};
      
      if (nome && nome !== user.nome) {
        updatedData.nome = nome;
      }
      
      if (email && email !== user.email) {
        // Verificar se email já existe
        const emailExists = await User.findOne({
          where: { 
            email: email.toLowerCase(),
            id: { [Op.ne]: user.id }
          }
        });

        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'Email já está em uso'
          });
        }

        updatedData.email = email.toLowerCase();
        updatedData.emailVerified = false; // Precisará verificar novamente
      }

      await user.update(updatedData);

      res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Logout (invalidar token - implementação básica)
  async logout(req, res) {
    try {
      // Em uma implementação mais robusta, você manteria uma blacklist de tokens
      // Por ora, o logout é apenas no frontend (remover token)

      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Solicitar recuperação de senha (envia código SMS)
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório'
        });
      }

      const user = await User.findOne({
        where: { email: email.toLowerCase(), isActive: true }
      });

      // Sempre retornar sucesso para não revelar se email existe
      if (!user) {
        return res.status(200).json({
          success: true,
          message: 'Se o email estiver cadastrado, você receberá um código SMS'
        });
      }

      // Gerar código de reset (6 dígitos para maior segurança)
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

      // Salvar código no usuário (reutilizando campos SMS)
      await user.update({
        smsCode: resetCode,
        smsCodeExpiry: resetCodeExpiry,
        smsAttempts: 0
      });

      // Enviar SMS com código de reset
      const smsResult = await smsService.sendPasswordResetCode(user.celular, resetCode);

      if (!smsResult.success) {
        console.error('Erro ao enviar SMS de reset:', smsResult.error);
      }

      res.status(200).json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um código SMS',
        data: {
          // Em produção, não enviar celular ofuscado
          hint: user.celular ? `****${user.celular.slice(-4)}` : null
        }
      });
    } catch (error) {
      console.error('Erro no forgot password:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Verificar código de reset
  async verifyResetCode(req, res) {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({
          success: false,
          message: 'Email e código são obrigatórios'
        });
      }

      const user = await User.findOne({
        where: { email: email.toLowerCase(), isActive: true }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Código inválido ou expirado'
        });
      }

      // Verificar se código expirou
      if (!user.smsCodeExpiry || new Date() > user.smsCodeExpiry) {
        return res.status(400).json({
          success: false,
          message: 'Código expirado. Solicite um novo código.'
        });
      }

      // Verificar tentativas
      if (user.smsAttempts >= 5) {
        return res.status(429).json({
          success: false,
          message: 'Muitas tentativas. Aguarde 15 minutos ou solicite novo código.'
        });
      }

      // Verificar código
      if (user.smsCode !== code) {
        await user.update({
          smsAttempts: user.smsAttempts + 1
        });

        return res.status(400).json({
          success: false,
          message: 'Código incorreto'
        });
      }

      // Código válido - gerar token temporário para reset
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      // Salvar token temporário (reutilizando smsCode)
      await user.update({
        smsCode: resetToken,
        smsCodeExpiry: resetTokenExpiry,
        smsAttempts: 0
      });

      res.status(200).json({
        success: true,
        message: 'Código verificado com sucesso',
        data: {
          resetToken
        }
      });
    } catch (error) {
      console.error('Erro ao verificar código de reset:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Redefinir senha
  async resetPassword(req, res) {
    try {
      const { email, resetToken, newPassword } = req.body;

      if (!email || !resetToken || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Email, token e nova senha são obrigatórios'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A senha deve ter pelo menos 6 caracteres'
        });
      }

      const user = await User.findOne({
        where: { email: email.toLowerCase(), isActive: true }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token inválido ou expirado'
        });
      }

      // Verificar token
      if (!user.smsCode || user.smsCode !== resetToken) {
        return res.status(400).json({
          success: false,
          message: 'Token inválido ou expirado'
        });
      }

      // Verificar se token expirou
      if (!user.smsCodeExpiry || new Date() > user.smsCodeExpiry) {
        return res.status(400).json({
          success: false,
          message: 'Token expirado. Inicie o processo novamente.'
        });
      }

      // Atualizar senha
      await user.update({
        password: newPassword,
        smsCode: null,
        smsCodeExpiry: null,
        smsAttempts: 0
      });

      // Gerar novo token de login
      const token = generateToken(user.id);

      res.status(200).json({
        success: true,
        message: 'Senha redefinida com sucesso!',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new AuthController();
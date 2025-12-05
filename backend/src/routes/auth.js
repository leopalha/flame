const express = require('express');
const router = express.Router();

// Import middlewares
const { authenticate } = require('../middlewares/auth.middleware');
const { 
  validateUserRegistration,
  validateSMSCode,
  validateUserLogin
} = require('../middlewares/validation.middleware');

// Import controller
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Cadastrar novo usuário e enviar SMS de verificação
 * @access  Public
 * @body    { nome, cpf, email, celular, password }
 */
router.post('/register', validateUserRegistration, authController.register);

/**
 * @route   POST /api/auth/register-phone
 * @desc    Cadastrar usuário apenas com telefone (perfil incompleto)
 * @access  Public
 * @body    { celular }
 */
router.post('/register-phone', authController.registerPhone);

/**
 * @route   POST /api/auth/verify-sms
 * @desc    Verificar código SMS e completar cadastro
 * @access  Public
 * @body    { celular, code }
 */
router.post('/verify-sms', validateSMSCode, authController.verifySMS);

/**
 * @route   POST /api/auth/resend-sms
 * @desc    Reenviar código SMS
 * @access  Public
 * @body    { celular }
 */
router.post('/resend-sms', authController.resendSMS);

/**
 * @route   DELETE /api/auth/delete-unverified/:email
 * @desc    Deletar usuário não verificado (apenas para testes)
 * @access  Public (temporário)
 */
router.delete('/delete-unverified/:email', authController.deleteUnverifiedUser);

/**
 * @route   POST /api/auth/login-sms
 * @desc    Iniciar login por SMS (enviar código)
 * @access  Public
 * @body    { celular }
 */
router.post('/login-sms', authController.loginSMS);

/**
 * @route   POST /api/auth/login
 * @desc    Login com email e senha
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', validateUserLogin, authController.loginPassword);

/**
 * @route   GET /api/auth/me
 * @desc    Obter dados do usuário logado
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route   PUT /api/auth/profile
 * @desc    Atualizar perfil do usuário
 * @access  Private
 * @body    { nome?, email? }
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * @route   POST /api/auth/complete-profile
 * @desc    Completar perfil após cadastro por telefone
 * @access  Private
 * @body    { nome, email, password? }
 */
router.post('/complete-profile', authenticate, authController.completeProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout do usuário
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar recuperação de senha (envia código SMS)
 * @access  Public
 * @body    { email }
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/verify-reset-code
 * @desc    Verificar código de reset de senha
 * @access  Public
 * @body    { email, code }
 */
router.post('/verify-reset-code', authController.verifyResetCode);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Redefinir senha com token
 * @access  Public
 * @body    { email, resetToken, newPassword }
 */
router.post('/reset-password', authController.resetPassword);

module.exports = router;
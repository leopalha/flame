const { OAuth2Client } = require('google-auth-library');

class GoogleService {
  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  /**
   * Verifica e valida um ID Token JWT do Google
   * @param {string} token - ID Token JWT recebido do frontend
   * @returns {Promise<Object>} Payload com dados do usuário Google
   */
  async verifyToken(token) {
    try {
      console.log('🔐 GOOGLE SERVICE: Verificando token...');

      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();

      console.log('✅ GOOGLE SERVICE: Token válido:', {
        sub: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified
      });

      return {
        sub: payload.sub,                     // Google User ID (único)
        email: payload.email,                 // Email do usuário
        email_verified: payload.email_verified, // Email verificado?
        name: payload.name,                   // Nome completo
        picture: payload.picture,             // URL da foto de perfil
        given_name: payload.given_name,       // Primeiro nome
        family_name: payload.family_name,     // Sobrenome
        locale: payload.locale                // Locale (pt-BR, en-US, etc)
      };
    } catch (error) {
      console.error('❌ GOOGLE SERVICE: Erro ao verificar token:', error.message);
      throw new Error('Token do Google inválido ou expirado');
    }
  }

  /**
   * Valida se o GOOGLE_CLIENT_ID está configurado
   * @returns {boolean}
   */
  isConfigured() {
    return !!process.env.GOOGLE_CLIENT_ID;
  }
}

module.exports = new GoogleService();

require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import services
const { testConnection } = require('./config/database');
const { createTables } = require('./models');
const socketService = require('./services/socket.service');
const jobScheduler = require('./jobs');

// Import middlewares
const { authenticate, optionalAuth } = require('./middlewares/auth.middleware');

// Import controllers
const authController = require('./controllers/authController');

const app = express();
const server = http.createServer(app);

// Trust proxy for Railway/Heroku/etc
app.set('trust proxy', 1);

// Initialize Socket.IO
const io = socketService.init(server);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - aceita multiplas origens
const allowedOrigins = [
  'http://localhost:3000',
  'https://flameloungebar.vercel.app',
  'https://flame-lounge-bar.vercel.app',
  'https://flame-lounge.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Permite requests sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    // Permite qualquer subdominio do Vercel para o projeto flame
    if (origin.includes('leopalhas-projects.vercel.app') ||
        origin.includes('flameloungebar.vercel.app') ||
        origin.includes('flame-lounge.vercel.app') ||
        allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Rate limiting - mais permissivo para suportar polling e uso normal
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000, // 1 minuto
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200, // 200 requests por minuto
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limit para rotas de autenticação e health check
  skip: (req) => {
    const skipPaths = ['/api/auth/me', '/api/products', '/api/health'];
    return skipPaths.some(path => req.path.startsWith(path));
  }
});

app.use('/api', limiter);

// Body parsing middleware
// IMPORTANTE: Webhook do Stripe precisa receber body raw
// Deve vir ANTES do express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FLAME API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/admin', authenticate, require('./routes/admin'));
app.use('/api/cashier', require('./routes/cashier.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/push', require('./routes/push.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/hookah', require('./routes/hookah'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/migrate', require('./routes/migrate')); // Temporário - para migração CPF
app.use('/api/crm', require('./routes/crm'));
app.use('/api/upload', require('./routes/upload.routes')); // Sprint 30 - Upload de imagens
app.use('/api/chat', require('./routes/chat')); // Sprint 56 - Chat staff-cliente
app.use('/api', require('./routes/seed-route'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Erro global:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  // Sequelize validation error
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(err => ({
      field: err.path,
      message: err.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  // Sequelize unique constraint error
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Dados já existem no sistema'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Default error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Initialize server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Falha na conexão com banco de dados');
      process.exit(1);
    }

    // Create/update database tables
    const tablesCreated = await createTables();
    if (!tablesCreated) {
      console.error('❌ Falha ao criar/atualizar tabelas');
      process.exit(1);
    }

    // Initialize job scheduler
    const jobCount = jobScheduler.initializeJobs();

    // Start server
    const PORT = process.env.PORT || 7000;
    server.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════╗
║           🔥 FLAME API 🔥            ║
║                                      ║
║  Servidor: http://localhost:${PORT}     ║
║  Ambiente: ${process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT'}             ║
║  Socket.IO: ✅ Ativo                 ║
║  Database: ✅ Conectado              ║
║  Jobs: ✅ ${jobCount} agendados               ║
║                                      ║
║  Endpoints disponíveis:              ║
║  GET  /health                        ║
║  POST /api/auth/register             ║
║  POST /api/auth/verify-sms           ║
║  POST /api/auth/login                ║
║                                      ║
╚══════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('Recebido SIGTERM. Encerrando servidor graciosamente...');
      jobScheduler.stopAllJobs();
      server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('Recebido SIGINT. Encerrando servidor graciosamente...');
      jobScheduler.stopAllJobs();
      server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Start the server
startServer();

module.exports = { app, server, io };
/**
 * Upload Middleware
 * Sprint 30 - Upload de Imagens para Produtos
 *
 * Configuração do Multer para upload de imagens
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garantir que diretório de uploads existe
const uploadDir = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp + random + extensão original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// Filtro de tipos de arquivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use: JPEG, PNG, GIF ou WebP'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1 // Apenas 1 arquivo por vez
  }
});

// Middleware de tratamento de erros do multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. Tamanho máximo: 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Apenas 1 arquivo por vez é permitido'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Erro no upload: ${err.message}`
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Erro no upload'
    });
  }

  next();
};

// Middleware para deletar arquivo antigo se existir
const deleteOldFile = (filePath) => {
  if (!filePath) return;

  try {
    // Extrair apenas o nome do arquivo da URL
    const filename = filePath.split('/').pop();
    const fullPath = path.join(uploadDir, filename);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`✅ Arquivo antigo deletado: ${filename}`);
    }
  } catch (error) {
    console.error('Erro ao deletar arquivo antigo:', error);
  }
};

module.exports = {
  upload,
  handleMulterError,
  deleteOldFile,
  uploadDir
};

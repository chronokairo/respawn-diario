const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5500',
    credentials: true
}));

// Logging
app.use(morgan('combined'));

// Parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/contact', contactRoutes);

// Rota de teste
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend Respawn Diário funcionando!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Algo deu errado!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
    });
});

// Rota 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`🎮 Servidor Respawn Diário rodando na porta ${PORT}`);
    console.log(`🌐 Ambiente: ${process.env.NODE_ENV}`);
    console.log(`📡 API disponível em: http://localhost:${PORT}/api`);
});

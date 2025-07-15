const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Requer permissões de administrador.' });
    }
    next();
};

// Conectar ao banco de dados
const connectDB = () => {
    const dbPath = path.join(__dirname, '..', 'data', 'database.sqlite');
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco:', err.message);
        } else {
            console.log('📦 Conectado ao banco SQLite');
            
            // Criar tabelas se não existirem
            createTables(db);
        }
    });
    return db;
};

// Criar tabelas
const createTables = (db) => {
    // Tabela de usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            name TEXT,
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de posts
    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            excerpt TEXT,
            content TEXT,
            category TEXT NOT NULL,
            author TEXT NOT NULL,
            image TEXT,
            featured BOOLEAN DEFAULT 0,
            rating REAL,
            tags TEXT,
            views INTEGER DEFAULT 0,
            likes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de newsletter
    db.run(`
        CREATE TABLE IF NOT EXISTS newsletter (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            active BOOLEAN DEFAULT 1
        )
    `);

    // Tabela de contatos
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            replied BOOLEAN DEFAULT 0
        )
    `);

    // Inserir usuário admin padrão
    createDefaultAdmin(db);
};

// Criar usuário admin padrão
const createDefaultAdmin = (db) => {
    const bcrypt = require('bcryptjs');
    
    db.get('SELECT id FROM users WHERE role = "admin"', (err, row) => {
        if (err) {
            console.error('Erro ao verificar admin:', err);
            return;
        }
        
        if (!row) {
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            
            db.run(`
                INSERT INTO users (username, email, password, role, name)
                VALUES (?, ?, ?, ?, ?)
            `, ['admin', 'admin@respawndiario.com', hashedPassword, 'admin', 'Administrador'], (err) => {
                if (err) {
                    console.error('Erro ao criar admin:', err);
                } else {
                    console.log('👤 Usuário admin criado: admin / admin123');
                }
            });
        }
    });
};

module.exports = {
    authenticateToken,
    requireAdmin,
    connectDB
};

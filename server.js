// Backend básico em Node.js (Express) com conexão SQLite
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'respawn_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'respawn_refresh_secret';

// Middlewares de segurança
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname)); // Middleware para servir arquivos estáticos

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
    req.user = user;
    next();
  });
};

// Middleware para validação de dados
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email e password são obrigatórios.' });
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }
  
  // Validar senha
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password deve ter pelo menos 6 caracteres.' });
  }
  
  // Validar username
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: 'Username deve ter entre 3 e 20 caracteres.' });
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ error: 'Username deve conter apenas letras, números e underscore.' });
  }
  
  next();
};

// Funções utilitárias para tokens
const generateTokens = (user) => {
  const payload = { 
    id: user.id, 
    username: user.username, 
    email: user.email 
  };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

const saveRefreshToken = (userId, refreshToken) => {
  return new Promise((resolve, reject) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
    db.run(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, refreshToken, expiresAt],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

const cleanExpiredTokens = () => {
  db.run('DELETE FROM refresh_tokens WHERE expires_at < datetime("now")');
  db.run('DELETE FROM password_resets WHERE expires_at < datetime("now")');
  db.run('DELETE FROM user_sessions WHERE expires_at < datetime("now")');
};

// Limpar tokens expirados a cada hora
setInterval(cleanExpiredTokens, 60 * 60 * 1000);

// Banco de dados SQLite
const db = new sqlite3.Database('./data/respawn.db', (err) => {
  if (err) return console.error('Erro ao conectar ao banco:', err.message);
  console.log('Conectado ao banco SQLite.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT 1,
    email_verified BOOLEAN DEFAULT 0,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    theme TEXT DEFAULT 'dark',
    language TEXT DEFAULT 'pt-BR',
    notifications_enabled BOOLEAN DEFAULT 1,
    newsletter_enabled BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
});

// Rota de teste
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Exemplo: listar usuários
app.get('/api/users', (req, res) => {
  db.all('SELECT id, username, email, created_at FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Exemplo: criar usuário (sem autenticação, apenas para teste)
app.post('/api/users', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Campos obrigatórios.' });
  }
  db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, username, email });
    }
  );
});

// Cadastro de usuário
app.post('/api/auth/register', validateRegister, async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;
  
  try {
    // Verificar se usuário já existe
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (existingUser) {
      return res.status(409).json({ error: 'Username ou email já está em uso.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const userId = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, first_name || null, last_name || null],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
    
    // Criar preferências padrão
    db.run(
      'INSERT INTO user_preferences (user_id) VALUES (?)',
      [userId]
    );
    
    const user = { id: userId, username, email, first_name, last_name };
    const { accessToken, refreshToken } = generateTokens(user);
    
    await saveRefreshToken(userId, refreshToken);
    
    res.status(201).json({
      message: 'Usuário criado com sucesso.',
      user: {
        id: userId,
        username,
        email,
        first_name: first_name || null,
        last_name: last_name || null
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Login de usuário
app.post('/api/auth/login', async (req, res) => {
  const { login, password, remember_me } = req.body;
  
  if (!login || !password) {
    return res.status(400).json({ error: 'Login e password são obrigatórios.' });
  }
  
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1', [login, login], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    
    // Atualizar último login
    db.run('UPDATE users SET last_login = datetime("now") WHERE id = ?', [user.id]);
    
    const { accessToken, refreshToken } = generateTokens(user);
    
    if (remember_me) {
      await saveRefreshToken(user.id, refreshToken);
    }
    
    // Registrar sessão
    const sessionToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    db.run(
      'INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [user.id, sessionToken, req.ip, req.get('User-Agent'), expiresAt]
    );
    
    res.json({
      message: 'Login realizado com sucesso.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
        bio: user.bio
      },
      accessToken,
      refreshToken: remember_me ? refreshToken : undefined
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Refresh Token
app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token é obrigatório.' });
  }
  
  try {
    // Verificar se o refresh token existe no banco
    const tokenRecord = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > datetime("now")', [refreshToken], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!tokenRecord) {
      return res.status(403).json({ error: 'Refresh token inválido ou expirado.' });
    }
    
    // Verificar o token JWT
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    // Buscar usuário
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ? AND is_active = 1', [decoded.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!user) {
      return res.status(403).json({ error: 'Usuário não encontrado.' });
    }
    
    // Gerar novo access token
    const { accessToken } = generateTokens(user);
    
    res.json({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (err) {
    console.error('Erro no refresh:', err);
    res.status(403).json({ error: 'Refresh token inválido.' });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    // Remover refresh token se fornecido
    if (refreshToken) {
      db.run('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    }
    
    // Remover todas as sessões do usuário (logout em todos os dispositivos)
    db.run('DELETE FROM user_sessions WHERE user_id = ?', [req.user.id]);
    
    res.json({ message: 'Logout realizado com sucesso.' });
  } catch (err) {
    console.error('Erro no logout:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Perfil do usuário
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(`
        SELECT u.*, up.theme, up.language, up.notifications_enabled, up.newsletter_enabled
        FROM users u
        LEFT JOIN user_preferences up ON u.id = up.user_id
        WHERE u.id = ?
      `, [req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Atualizar perfil
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  const { first_name, last_name, bio, avatar_url } = req.body;
  
  try {
    db.run(
      'UPDATE users SET first_name = ?, last_name = ?, bio = ?, avatar_url = ?, updated_at = datetime("now") WHERE id = ?',
      [first_name, last_name, bio, avatar_url, req.user.id],
      function(err) {
        if (err) {
          console.error('Erro ao atualizar perfil:', err);
          return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
        res.json({ message: 'Perfil atualizado com sucesso.' });
      }
    );
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Atualizar preferências
app.put('/api/auth/preferences', authenticateToken, async (req, res) => {
  const { theme, language, notifications_enabled, newsletter_enabled } = req.body;
  
  try {
    db.run(
      `UPDATE user_preferences SET 
       theme = COALESCE(?, theme),
       language = COALESCE(?, language),
       notifications_enabled = COALESCE(?, notifications_enabled),
       newsletter_enabled = COALESCE(?, newsletter_enabled),
       updated_at = datetime("now")
       WHERE user_id = ?`,
      [theme, language, notifications_enabled, newsletter_enabled, req.user.id],
      function(err) {
        if (err) {
          console.error('Erro ao atualizar preferências:', err);
          return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
        res.json({ message: 'Preferências atualizadas com sucesso.' });
      }
    );
  } catch (err) {
    console.error('Erro ao atualizar preferências:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Alterar senha
app.put('/api/auth/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres.' });
  }
  
  try {
    // Verificar senha atual
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT password FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Senha atual incorreta.' });
    }
    
    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    // Atualizar senha
    db.run(
      'UPDATE users SET password = ?, updated_at = datetime("now") WHERE id = ?',
      [hashedNewPassword, req.user.id],
      function(err) {
        if (err) {
          console.error('Erro ao alterar senha:', err);
          return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
        
        // Revogar todas as sessões existentes
        db.run('DELETE FROM refresh_tokens WHERE user_id = ?', [req.user.id]);
        db.run('DELETE FROM user_sessions WHERE user_id = ?', [req.user.id]);
        
        res.json({ message: 'Senha alterada com sucesso. Faça login novamente.' });
      }
    );
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Recuperação de senha - Solicitar reset
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório.' });
  }
  
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT id, email FROM users WHERE email = ? AND is_active = 1', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    // Sempre retornar sucesso por segurança (não vazar se email existe)
    if (!user) {
      return res.json({ message: 'Se o email existir, as instruções foram enviadas.' });
    }
    
    // Gerar token de reset
    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    
    // Salvar token no banco
    db.run(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, resetToken, expiresAt],
      function(err) {
        if (err) {
          console.error('Erro ao criar token de reset:', err);
          return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
        
        // Aqui você enviaria um email real com o link de reset
        // resetLink = `https://respawndiario.com/reset-password?token=${resetToken}`
        console.log(`Reset token para ${email}: ${resetToken}`);
        
        res.json({ 
          message: 'Se o email existir, as instruções foram enviadas.',
          // Em desenvolvimento, retornar o token
          ...(process.env.NODE_ENV === 'development' && { resetToken })
        });
      }
    );
  } catch (err) {
    console.error('Erro na recuperação de senha:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Resetar senha
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres.' });
  }
  
  try {
    // Verificar token no banco
    const resetRecord = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM password_resets WHERE token = ? AND expires_at > datetime("now") AND used = 0',
        [token],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    if (!resetRecord) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }
    
    // Verificar token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.userId !== resetRecord.user_id) {
      return res.status(400).json({ error: 'Token inválido.' });
    }
    
    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Atualizar senha
    db.run(
      'UPDATE users SET password = ?, updated_at = datetime("now") WHERE id = ?',
      [hashedPassword, resetRecord.user_id],
      function(err) {
        if (err) {
          console.error('Erro ao resetar senha:', err);
          return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
        
        // Marcar token como usado
        db.run('UPDATE password_resets SET used = 1 WHERE id = ?', [resetRecord.id]);
        
        // Revogar todas as sessões do usuário
        db.run('DELETE FROM refresh_tokens WHERE user_id = ?', [resetRecord.user_id]);
        db.run('DELETE FROM user_sessions WHERE user_id = ?', [resetRecord.user_id]);
        
        res.json({ message: 'Senha resetada com sucesso. Faça login com a nova senha.' });
      }
    );
  } catch (err) {
    console.error('Erro ao resetar senha:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Token inválido.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Integração com CMS Headless (exemplo: Strapi)
// Sugestão: consumir posts/notícias/guides via API REST do CMS
// Exemplo de rota proxy para buscar posts do CMS
app.get('/api/cms/posts', async (req, res) => {
  try {
    const { data } = await axios.get('https://cms.respawndiario.com/api/posts');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar posts do CMS.' });
  }
});

// Listar comentários de um post
app.get('/api/comments/:postId', (req, res) => {
  const postId = req.params.postId;
  db.all(
    `SELECT comments.id, comments.content, comments.created_at, users.username FROM comments 
     JOIN users ON comments.user_id = users.id WHERE post_id = ? ORDER BY created_at DESC`,
    [postId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Adicionar comentário (requer autenticação)
app.post('/api/comments', authenticateToken, (req, res) => {
  const { post_id, content } = req.body;
  const user_id = req.user.id;
  
  if (!post_id || !content) {
    return res.status(400).json({ error: 'Post ID e conteúdo são obrigatórios.' });
  }
  
  if (content.trim().length === 0) {
    return res.status(400).json({ error: 'Conteúdo não pode estar vazio.' });
  }
  
  if (content.length > 1000) {
    return res.status(400).json({ error: 'Conteúdo muito longo (máximo 1000 caracteres).' });
  }
  
  db.run(
    'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
    [post_id, user_id, content.trim()],
    function (err) {
      if (err) {
        console.error('Erro ao adicionar comentário:', err);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
      }
      res.status(201).json({ 
        id: this.lastID, 
        post_id, 
        user_id, 
        content: content.trim(),
        username: req.user.username,
        created_at: new Date().toISOString()
      });
    }
  );
});

// Atualizar comentário
app.put('/api/comments/:id', authenticateToken, (req, res) => {
  const commentId = req.params.id;
  const { content } = req.body;
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Conteúdo é obrigatório.' });
  }
  
  if (content.length > 1000) {
    return res.status(400).json({ error: 'Conteúdo muito longo (máximo 1000 caracteres).' });
  }
  
  // Verificar se o comentário pertence ao usuário
  db.get('SELECT user_id FROM comments WHERE id = ?', [commentId], (err, comment) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
    
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }
    
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado a editar este comentário.' });
    }
    
    db.run(
      'UPDATE comments SET content = ?, updated_at = datetime("now") WHERE id = ?',
      [content.trim(), commentId],
      function(err) {
        if (err) {
          console.error('Erro ao atualizar comentário:', err);
          return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
        res.json({ message: 'Comentário atualizado com sucesso.' });
      }
    );
  });
});

// Deletar comentário
app.delete('/api/comments/:id', authenticateToken, (req, res) => {
  const commentId = req.params.id;
  
  // Verificar se o comentário pertence ao usuário
  db.get('SELECT user_id FROM comments WHERE id = ?', [commentId], (err, comment) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
    
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }
    
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado a deletar este comentário.' });
    }
    
    db.run('DELETE FROM comments WHERE id = ?', [commentId], function(err) {
      if (err) {
        console.error('Erro ao deletar comentário:', err);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
      }
      res.json({ message: 'Comentário deletado com sucesso.' });
    });
  });
});

// Listar likes de um post
app.get('/api/likes/:postId', (req, res) => {
  const postId = req.params.postId;
  db.all('SELECT user_id FROM likes WHERE post_id = ?', [postId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Adicionar like
app.post('/api/likes', authenticateToken, (req, res) => {
  const { post_id } = req.body;
  const user_id = req.user.id;
  
  if (!post_id) {
    return res.status(400).json({ error: 'Post ID é obrigatório.' });
  }
  
  db.run(
    'INSERT OR IGNORE INTO likes (post_id, user_id) VALUES (?, ?)',
    [post_id, user_id],
    function (err) {
      if (err) {
        console.error('Erro ao adicionar like:', err);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
      }
      
      if (this.changes === 0) {
        return res.status(409).json({ error: 'Like já existe.' });
      }
      
      res.status(201).json({ 
        id: this.lastID, 
        post_id, 
        user_id,
        message: 'Like adicionado com sucesso.'
      });
    }
  );
});

// Remover like
app.delete('/api/likes', authenticateToken, (req, res) => {
  const { post_id } = req.body;
  const user_id = req.user.id;
  
  if (!post_id) {
    return res.status(400).json({ error: 'Post ID é obrigatório.' });
  }
  
  db.run('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [post_id, user_id], function (err) {
    if (err) {
      console.error('Erro ao remover like:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Like não encontrado.' });
    }
    
    res.json({ message: 'Like removido com sucesso.' });
  });
});

// Verificar se usuário curtiu um post
app.get('/api/likes/:postId/check', authenticateToken, (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  
  db.get('SELECT id FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId], (err, like) => {
    if (err) {
      console.error('Erro ao verificar like:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
    
    res.json({ liked: !!like });
  });
});

// Verificar se usuário está autenticado
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

// Listar sessões ativas do usuário
app.get('/api/auth/sessions', authenticateToken, (req, res) => {
  db.all(
    'SELECT id, ip_address, user_agent, created_at, expires_at FROM user_sessions WHERE user_id = ? AND expires_at > datetime("now") ORDER BY created_at DESC',
    [req.user.id],
    (err, sessions) => {
      if (err) {
        console.error('Erro ao buscar sessões:', err);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
      }
      res.json(sessions);
    }
  );
});

// Revogar sessão específica
app.delete('/api/auth/sessions/:sessionId', authenticateToken, (req, res) => {
  const sessionId = req.params.sessionId;
  
  db.run(
    'DELETE FROM user_sessions WHERE id = ? AND user_id = ?',
    [sessionId, req.user.id],
    function(err) {
      if (err) {
        console.error('Erro ao revogar sessão:', err);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Sessão não encontrada.' });
      }
      
      res.json({ message: 'Sessão revogada com sucesso.' });
    }
  );
});

// Estatísticas do usuário
app.get('/api/user/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  const queries = [
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM comments WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve({ comments: row.count });
      });
    }),
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM likes WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve({ likes: row.count });
      });
    }),
    new Promise((resolve, reject) => {
      db.get('SELECT created_at FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve({ memberSince: row.created_at });
      });
    })
  ];
  
  Promise.all(queries)
    .then(results => {
      const stats = Object.assign({}, ...results);
      res.json(stats);
    })
    .catch(err => {
      console.error('Erro ao buscar estatísticas:', err);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    });
});

// Exemplo de rota GET
app.get('/', (req, res) => {
    res.json({ message: 'Backend Express funcionando!' });
});

// Exemplo de rota POST
app.post('/data', (req, res) => {
    const { info } = req.body;
    res.json({ received: info });
});

// Social Login (OAuth) - Rotas de exemplo
app.get('/api/auth/google', (req, res) => {
  // Redirecionar para Google OAuth (placeholder)
  res.redirect('https://accounts.google.com/o/oauth2/v2/auth?...');
});
app.get('/api/auth/facebook', (req, res) => {
  // Redirecionar para Facebook OAuth (placeholder)
  res.redirect('https://www.facebook.com/v10.0/dialog/oauth?...');
});
app.get('/api/auth/discord', (req, res) => {
  // Redirecionar para Discord OAuth (placeholder)
  res.redirect('https://discord.com/api/oauth2/authorize?...');
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
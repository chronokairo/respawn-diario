const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB, authenticateToken } = require('../middleware/auth');

const router = express.Router();
const db = connectDB();

// Gerar token JWT
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            email: user.email,
            role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// POST /api/auth/register - Registro de usuário
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, name } = req.body;

        // Validação básica
        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'Username, email e password são obrigatórios'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password deve ter pelo menos 6 caracteres'
            });
        }

        // Verificar se usuário já existe
        db.get(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email],
            async (err, existingUser) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }

                if (existingUser) {
                    return res.status(400).json({
                        error: 'Username ou email já existe'
                    });
                }

                // Hash da senha
                const hashedPassword = await bcrypt.hash(password, 10);

                // Inserir usuário
                db.run(
                    `INSERT INTO users (username, email, password, name) 
                     VALUES (?, ?, ?, ?)`,
                    [username, email, hashedPassword, name || username],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Erro ao criar usuário' });
                        }

                        // Buscar usuário criado
                        db.get(
                            'SELECT id, username, email, role, name FROM users WHERE id = ?',
                            [this.lastID],
                            (err, user) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Erro ao buscar usuário' });
                                }

                                const token = generateToken(user);

                                res.status(201).json({
                                    message: 'Usuário criado com sucesso',
                                    token,
                                    user: {
                                        id: user.id,
                                        username: user.username,
                                        email: user.email,
                                        name: user.name,
                                        role: user.role
                                    }
                                });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/auth/login - Login
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json({
                error: 'Login e password são obrigatórios'
            });
        }

        // Buscar usuário por username ou email
        db.get(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [login, login],
            async (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }

                if (!user) {
                    return res.status(401).json({
                        error: 'Credenciais inválidas'
                    });
                }

                // Verificar senha
                const isValidPassword = await bcrypt.compare(password, user.password);
                
                if (!isValidPassword) {
                    return res.status(401).json({
                        error: 'Credenciais inválidas'
                    });
                }

                const token = generateToken(user);

                res.json({
                    message: 'Login realizado com sucesso',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        avatar: user.avatar
                    }
                });
            }
        );
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// GET /api/auth/me - Dados do usuário atual
router.get('/me', authenticateToken, (req, res) => {
    db.get(
        'SELECT id, username, email, name, role, avatar, created_at FROM users WHERE id = ?',
        [req.user.id],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.json({ user });
        }
    );
});

// PUT /api/auth/profile - Atualizar perfil
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Buscar usuário atual
        db.get('SELECT * FROM users WHERE id = ?', [userId], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            let updateData = [];
            let updateQuery = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP';

            // Atualizar nome
            if (name && name !== user.name) {
                updateQuery += ', name = ?';
                updateData.push(name);
            }

            // Atualizar email
            if (email && email !== user.email) {
                // Verificar se email já existe
                const existingEmail = await new Promise((resolve) => {
                    db.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId], (err, row) => {
                        resolve(row);
                    });
                });

                if (existingEmail) {
                    return res.status(400).json({ error: 'Email já está em uso' });
                }

                updateQuery += ', email = ?';
                updateData.push(email);
            }

            // Atualizar senha
            if (newPassword) {
                if (!currentPassword) {
                    return res.status(400).json({ error: 'Senha atual é obrigatória' });
                }

                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
                if (!isCurrentPasswordValid) {
                    return res.status(400).json({ error: 'Senha atual incorreta' });
                }

                if (newPassword.length < 6) {
                    return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
                }

                const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                updateQuery += ', password = ?';
                updateData.push(hashedNewPassword);
            }

            updateQuery += ' WHERE id = ?';
            updateData.push(userId);

            db.run(updateQuery, updateData, function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao atualizar perfil' });
                }

                res.json({ message: 'Perfil atualizado com sucesso' });
            });
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/auth/logout - Logout (client-side apenas)
router.post('/logout', authenticateToken, (req, res) => {
    res.json({ message: 'Logout realizado com sucesso' });
});

module.exports = router;

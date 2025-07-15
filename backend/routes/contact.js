const express = require('express');
const nodemailer = require('nodemailer');
const { connectDB } = require('../middleware/auth');

const router = express.Router();
const db = connectDB();

// Configurar nodemailer
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// POST /api/contact - Formulário de contato
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validação
        if (!name || !email || !message) {
            return res.status(400).json({
                error: 'Nome, email e mensagem são obrigatórios'
            });
        }

        // Salvar no banco
        db.run(
            'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || 'Contato via site', message],
            async function(err) {
                if (err) {
                    console.error('Erro ao salvar contato:', err);
                    return res.status(500).json({ error: 'Erro ao salvar mensagem' });
                }

                // Enviar email (opcional)
                try {
                    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                        const transporter = createTransporter();
                        
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: process.env.EMAIL_USER,
                            subject: `[Respawn Diário] ${subject || 'Novo contato'}`,
                            html: `
                                <h2>Novo contato recebido</h2>
                                <p><strong>Nome:</strong> ${name}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Assunto:</strong> ${subject || 'Não informado'}</p>
                                <p><strong>Mensagem:</strong></p>
                                <p>${message.replace(/\n/g, '<br>')}</p>
                                <hr>
                                <p><small>Enviado através do site Respawn Diário</small></p>
                            `
                        });
                    }
                } catch (emailError) {
                    console.error('Erro ao enviar email:', emailError);
                    // Não retorna erro para o usuário, apenas loga
                }

                res.status(201).json({
                    message: 'Mensagem enviada com sucesso! Responderemos em breve.',
                    contactId: this.lastID
                });
            }
        );
    } catch (error) {
        console.error('Erro no contato:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/contact/newsletter - Inscrição na newsletter
router.post('/newsletter', (req, res) => {
    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({
            error: 'Email é obrigatório'
        });
    }

    // Verificar se email já está cadastrado
    db.get('SELECT id FROM newsletter WHERE email = ?', [email], (err, existing) => {
        if (err) {
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        if (existing) {
            return res.status(400).json({
                error: 'Email já está inscrito na newsletter'
            });
        }

        // Inserir novo inscrito
        db.run(
            'INSERT INTO newsletter (email, name) VALUES (?, ?)',
            [email, name || null],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao inscrever na newsletter' });
                }

                res.status(201).json({
                    message: 'Inscrito na newsletter com sucesso!',
                    subscriberId: this.lastID
                });
            }
        );
    });
});

// GET /api/contact/newsletter - Listar inscritos (admin apenas)
router.get('/newsletter', (req, res) => {
    // Por enquanto sem autenticação, mas deveria ter requireAdmin
    db.all(
        'SELECT id, email, name, subscribed_at, active FROM newsletter WHERE active = 1 ORDER BY subscribed_at DESC',
        [],
        (err, subscribers) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao buscar inscritos' });
            }

            res.json({
                subscribers,
                total: subscribers.length
            });
        }
    );
});

// DELETE /api/contact/newsletter/:email - Descadastrar da newsletter
router.delete('/newsletter/:email', (req, res) => {
    const { email } = req.params;

    db.run(
        'UPDATE newsletter SET active = 0 WHERE email = ?',
        [email],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erro ao descadastrar' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Email não encontrado' });
            }

            res.json({ message: 'Descadastrado da newsletter com sucesso' });
        }
    );
});

module.exports = router;

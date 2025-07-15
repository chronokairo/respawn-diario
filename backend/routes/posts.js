const express = require('express');
const { connectDB, authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const db = connectDB();

// GET /api/posts - Listar todos os posts
router.get('/', (req, res) => {
    const { category, limit = 10, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM posts';
    let params = [];
    
    if (category && category !== 'all') {
        query += ' WHERE category = ?';
        params.push(category);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    db.all(query, params, (err, posts) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar posts' });
        }
        
        // Converter tags de string para array
        const formattedPosts = posts.map(post => ({
            ...post,
            tags: post.tags ? post.tags.split(',') : [],
            featured: Boolean(post.featured)
        }));
        
        res.json({ posts: formattedPosts });
    });
});

// GET /api/posts/:id - Post específico
router.get('/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM posts WHERE id = ?', [id], (err, post) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar post' });
        }
        
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        
        // Incrementar views
        db.run('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);
        
        // Formatar resposta
        const formattedPost = {
            ...post,
            tags: post.tags ? post.tags.split(',') : [],
            featured: Boolean(post.featured)
        };
        
        res.json({ post: formattedPost });
    });
});

// POST /api/posts - Criar post (admin apenas)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
    const {
        title,
        slug,
        excerpt,
        content,
        category,
        image,
        featured = false,
        rating,
        tags = []
    } = req.body;
    
    // Validação
    if (!title || !category || !content) {
        return res.status(400).json({
            error: 'Título, categoria e conteúdo são obrigatórios'
        });
    }
    
    const author = req.user.name || req.user.username;
    const postSlug = slug || title.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
    
    db.run(`
        INSERT INTO posts (title, slug, excerpt, content, category, author, image, featured, rating, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        title,
        postSlug,
        excerpt,
        content,
        category,
        author,
        image,
        featured ? 1 : 0,
        rating,
        tagsString
    ], function(err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(400).json({ error: 'Slug já existe' });
            }
            return res.status(500).json({ error: 'Erro ao criar post' });
        }
        
        res.status(201).json({
            message: 'Post criado com sucesso',
            postId: this.lastID
        });
    });
});

// PUT /api/posts/:id - Atualizar post (admin apenas)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    const {
        title,
        slug,
        excerpt,
        content,
        category,
        image,
        featured,
        rating,
        tags
    } = req.body;
    
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
    
    db.run(`
        UPDATE posts SET 
            title = COALESCE(?, title),
            slug = COALESCE(?, slug),
            excerpt = COALESCE(?, excerpt),
            content = COALESCE(?, content),
            category = COALESCE(?, category),
            image = COALESCE(?, image),
            featured = COALESCE(?, featured),
            rating = COALESCE(?, rating),
            tags = COALESCE(?, tags),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `, [
        title,
        slug,
        excerpt,
        content,
        category,
        image,
        featured ? 1 : 0,
        rating,
        tagsString,
        id
    ], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar post' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        
        res.json({ message: 'Post atualizado com sucesso' });
    });
});

// DELETE /api/posts/:id - Deletar post (admin apenas)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar post' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        
        res.json({ message: 'Post deletado com sucesso' });
    });
});

// POST /api/posts/:id/like - Curtir post
router.post('/:id/like', (req, res) => {
    const { id } = req.params;
    
    db.run('UPDATE posts SET likes = likes + 1 WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao curtir post' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        
        res.json({ message: 'Post curtido com sucesso' });
    });
});

module.exports = router;

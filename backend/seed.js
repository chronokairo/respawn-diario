const { connectDB } = require('./middleware/auth');

const db = connectDB();

// Posts de exemplo para popular o banco
const samplePosts = [
    {
        title: "Cyberpunk 2077: Vale a Pena em 2025?",
        slug: "cyberpunk-2077-vale-pena-2025",
        excerpt: "Após anos de patches e melhorias, analisamos se o game da CD Projekt RED finalmente entregou o que prometeu.",
        content: "Cyberpunk 2077 teve um lançamento controverso em 2020, mas após anos de desenvolvimento contínuo, o jogo finalmente se tornou o que os fãs esperavam. Nesta análise completa, exploramos todas as melhorias implementadas...",
        category: "reviews",
        author: "Alex Gamer",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
        featured: 1,
        rating: 4.5,
        tags: "RPG,Cyberpunk,CD Projekt RED,PC,Console",
        views: 1250,
        likes: 89
    },
    {
        title: "Nintendo Direct: Todas as Novidades",
        slug: "nintendo-direct-novidades",
        excerpt: "Cobertura completa do último Nintendo Direct com anúncios bombásticos para o Switch.",
        content: "O Nintendo Direct de janeiro trouxe várias surpresas para os fãs da Big N. Confira todos os anúncios e nossas impressões...",
        category: "noticias",
        author: "Mari Console",
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=250&fit=crop",
        featured: 0,
        rating: null,
        tags: "Nintendo,Switch,Direct,Anúncios",
        views: 892,
        likes: 56
    },
    {
        title: "Guia Completo: Elden Ring DLC",
        slug: "guia-completo-elden-ring-dlc",
        excerpt: "Desvende todos os segredos da expansão Shadow of the Erdtree com nosso guia detalhado.",
        content: "A expansão de Elden Ring trouxe novos desafios e segredos. Neste guia completo, você encontrará tudo que precisa saber...",
        category: "guias",
        author: "João Souls",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop",
        featured: 1,
        rating: 5.0,
        tags: "Elden Ring,FromSoftware,DLC,Guia",
        views: 2150,
        likes: 145
    },
    {
        title: "CS2: Major de Paris - Análise Completa",
        slug: "cs2-major-paris-analise",
        excerpt: "Tudo sobre o Major de Counter-Strike 2 em Paris, com análise das equipes e principais jogadas.",
        content: "O Major de CS2 em Paris foi um evento épico. Analisamos as principais equipes, jogadas e momentos marcantes...",
        category: "esports",
        author: "Pedro Pro",
        image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=250&fit=crop",
        featured: 0,
        rating: null,
        tags: "Counter-Strike,eSports,Major,CS2",
        views: 743,
        likes: 34
    }
];

// Função para popular o banco
const seedDatabase = () => {
    console.log('🌱 Iniciando seed do banco de dados...');
    
    // Verificar se já existem posts
    db.get('SELECT COUNT(*) as count FROM posts', (err, result) => {
        if (err) {
            console.error('Erro ao verificar posts:', err);
            return;
        }
        
        if (result.count > 0) {
            console.log('📚 Posts já existem no banco, pulando seed...');
            db.close();
            return;
        }
        
        // Inserir posts de exemplo
        const stmt = db.prepare(`
            INSERT INTO posts (title, slug, excerpt, content, category, author, image, featured, rating, tags, views, likes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        samplePosts.forEach(post => {
            stmt.run([
                post.title,
                post.slug,
                post.excerpt,
                post.content,
                post.category,
                post.author,
                post.image,
                post.featured,
                post.rating,
                post.tags,
                post.views,
                post.likes
            ]);
        });
        
        stmt.finalize((err) => {
            if (err) {
                console.error('Erro ao inserir posts:', err);
            } else {
                console.log(`✅ ${samplePosts.length} posts de exemplo inseridos com sucesso!`);
            }
            db.close();
        });
    });
};

// Executar seed se arquivo for executado diretamente
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };

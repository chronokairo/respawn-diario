const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Exemplo de rota GET
app.get('/', (req, res) => {
    res.json({ message: 'Backend Express funcionando!' });
});

// Exemplo de rota POST
app.post('/data', (req, res) => {
    const { info } = req.body;
    res.json({ received: info });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
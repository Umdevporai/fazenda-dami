const express = require('express');
const bodyParser = require('body-parser');
const estoqueRoutes = require('./routes/estoqueRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - adicione ANTES das rotas!
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rotas
app.use('/api/estoque', estoqueRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
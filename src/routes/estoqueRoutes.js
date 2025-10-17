const express = require('express');
const router = express.Router();
const EstoqueController = require('../controllers/estoqueController');
const EstoqueModel = require('../models/estoqueModel');
const estoqueModel = new EstoqueModel(require('../config/database'));
const estoqueController = new EstoqueController(estoqueModel);

router.get('/', (req, res) => estoqueController.listarProdutos(req, res));
router.post('/', (req, res) => estoqueController.adicionarProduto(req, res));
router.delete('/:id', (req, res) => estoqueController.removerProduto(req, res));
router.post('/saida', (req, res) => estoqueController.saidaProduto(req, res));
router.put('/:id', (req, res) => estoqueController.editarProduto(req, res));
router.post('/entrada', (req, res) => estoqueController.entradaProduto(req, res));
router.post('/saida', (req, res) => estoqueController.saidaProduto(req, res));

// Novo: histórico de saídas
router.get('/historico-saida', (req, res) => estoqueController.historicoSaida(req, res));
router.get('/relatorio-saida-txt', (req, res) => estoqueController.relatorioSaidaTXT(req, res));
router.get('/relatorio-saida-pdf', (req, res) => estoqueController.relatorioSaidaPDF(req, res));


module.exports = router;
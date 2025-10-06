const express = require('express');
const router = express.Router();
const EstoqueController = require('../controllers/estoqueController');
const EstoqueModel = require('../models/estoqueModel');
const estoqueModel = new EstoqueModel(require('../config/database'));
const estoqueController = new EstoqueController(estoqueModel);

// Listar produtos
router.get('/', (req, res) => estoqueController.listarProdutos(req, res));

// Adicionar produto
router.post('/', (req, res) => estoqueController.adicionarProduto(req, res));

// Remover produto
router.delete('/:id', (req, res) => estoqueController.removerProduto(req, res));

module.exports = router;
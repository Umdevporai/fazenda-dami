class EstoqueController {
    constructor(estoqueModel) {
        this.estoqueModel = estoqueModel;
    }

    async adicionarProduto(req, res) {
        try {
            const produto = req.body;
            const resultado = await this.estoqueModel.criarProduto(produto);
            res.status(201).json({ message: 'Produto adicionado com sucesso', produto: resultado });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao adicionar produto', error: error.message });
        }
    }

    async removerProduto(req, res) {
        try {
            const { id } = req.params;
            const resultado = await this.estoqueModel.deletarProduto(id);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            res.status(200).json({ message: 'Produto removido com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao remover produto', error: error.message });
        }
    }

    async listarProdutos(req, res) {
        try {
            const produtos = await this.estoqueModel.obterProdutos();
            res.status(200).json(produtos);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar produtos', error: error.message });
        }
    }
}

module.exports = EstoqueController;
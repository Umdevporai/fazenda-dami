const db = require('../config/database').promise();

class EstoqueModel {
    async criarProduto(produto) {
        const [resultado] = await db.query('INSERT INTO estoque SET ?', produto);
        return resultado;
    }

    async deletarProduto(id) {
        const [resultado] = await db.query('DELETE FROM estoque WHERE id = ?', [id]);
        return resultado;
    }

    async obterProdutos() {
        const [produtos] = await db.query('SELECT * FROM estoque');
        return produtos;
    }
}

module.exports = EstoqueModel;

// Função para listar todos os produtos
exports.getAll = (callback) => {
  db.query('SELECT * FROM estoque', callback);
};

// Função para adicionar um novo produto
exports.create = (produto, callback) => {
  db.query('INSERT INTO estoque SET ?', produto, callback);
};

// Função para atualizar um produto
exports.update = (id, produto, callback) => {
  db.query('UPDATE estoque SET ? WHERE id = ?', [produto, id], callback);
};

// Função para remover um produto
exports.delete = (id, callback) => {
  db.query('DELETE FROM estoque WHERE id = ?', [id], callback);
};
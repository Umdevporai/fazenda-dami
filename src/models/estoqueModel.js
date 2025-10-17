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

    async atualizarProduto(id, dados) {
        const [resultado] = await db.query('UPDATE estoque SET ? WHERE id = ?', [dados, id]);
        return resultado;
    }

    async editarProduto(id, dados) {
        const [resultado] = await db.query('UPDATE estoque SET ? WHERE id = ?', [dados, id]);
        return resultado;
    }

    async atualizarProduto(id, dados) {
        const [resultado] = await db.query('UPDATE estoque SET ? WHERE id = ?', [dados, id]);
        return resultado;
    }

    async registrarSaida(produto_id, quantidade, unidade, responsavel = null) {
        const [resultado] = await db.query(
            'INSERT INTO historico_saida (produto_id, quantidade, unidade, responsavel) VALUES (?, ?, ?, ?)',
            [produto_id, quantidade, unidade, responsavel]
        );
        return resultado;
    }

    async obterHistoricoSaida({ produto_id = null, dataInicio = null, dataFim = null }) {
        let sql = 'SELECT hs.*, e.nome FROM historico_saida hs JOIN estoque e ON hs.produto_id = e.id WHERE 1=1';
        const params = [];
        if (produto_id) {
            sql += ' AND hs.produto_id = ?';
            params.push(produto_id);
        }
        if (dataInicio) {
            sql += ' AND hs.data_saida >= ?';
            params.push(dataInicio);
        }
        if (dataFim) {
            sql += ' AND hs.data_saida <= ?';
            params.push(dataFim);
        }
        sql += ' ORDER BY hs.data_saida DESC';
        const [rows] = await db.query(sql, params);
        return rows;
    }
}


module.exports = EstoqueModel;
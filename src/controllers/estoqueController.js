const PDFDocument = require('pdfkit');
const fs = require('fs');

class EstoqueController {
    constructor(estoqueModel) {
        this.estoqueModel = estoqueModel;
    }

    async relatorioSaidaPDF(req, res) {
        try {
            const { produto_id, dataInicio, dataFim } = req.query;
            const historico = await this.estoqueModel.obterHistoricoSaida({ produto_id, dataInicio, dataFim });

            const doc = new PDFDocument({ margin: 30, size: 'A4' });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=relatorio_saida.pdf');
            doc.pipe(res);

            doc.fontSize(16).text('Relatório de Saídas de Estoque', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Período: ${dataInicio || '...'} a ${dataFim || '...'}`, { align: 'center' });
            doc.moveDown();

            // Cabeçalho da tabela
            doc.fontSize(10);
            doc.text('Produto', 40, doc.y, { continued: true });
            doc.text('Quantidade', 130, doc.y, { continued: true });
            doc.text('Unidade', 200, doc.y, { continued: true });
            doc.text('Data', 270, doc.y, { continued: true });
            doc.text('Responsável', 380, doc.y);

            doc.moveDown(0.5);
            doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();

            // Escreve cada linha da tabela
            let startY = doc.y + 10;
            const rowHeight = 20;

            historico.forEach((row, i) => {
            const dataFormatada = new Date(row.data_saida)
                .toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace('T', ' ');
            doc.text(row.nome, 40, startY + i * rowHeight);
            doc.text(row.quantidade, 130, startY + i * rowHeight);
            doc.text(row.unidade, 200, startY + i * rowHeight);
            doc.text(dataFormatada, 270, startY + i * rowHeight);
            doc.text(row.responsavel || '', 380, startY + i * rowHeight);
            });

            doc.end();
        } catch (error) {
            res.status(500).json({ message: 'Erro ao gerar PDF', error: error.message });
        }
    }

    async adicionarProduto(req, res) {
        try {
            console.log('Recebido no cadastro:', req.body); // <-- Adicione esse log!
            const produto = req.body;
            const resultado = await this.estoqueModel.criarProduto(produto);
            res.status(201).json({ message: 'Produto adicionado com sucesso', produto: resultado });
        } catch (error) {
            console.error('Erro ao adicionar produto:', error); // <-- Mostra o erro no terminal
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

    async saidaProduto(req, res) {
        try {
            const { id, quantidade } = req.body;
            if (!id || !quantidade || quantidade <= 0) {
                return res.status(400).json({ message: 'ID e quantidade válidos são obrigatórios.' });
            }
            const produtos = await this.estoqueModel.obterProdutos();
            const produto = produtos.find(p => p.id == id);
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            if (produto.quantidade_total < quantidade) {
                return res.status(400).json({ message: 'Quantidade em estoque insuficiente.' });
            }
            const novaQuantidade = produto.quantidade_total - quantidade;
            const resultado = await this.estoqueModel.atualizarProduto(produto.id, { quantidade_total: novaQuantidade });
            return res.json({ message: `Saída registrada! Quantidade atual: ${novaQuantidade}` });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao registrar saída', error: error.message });
        }
    }

    async editarProduto(req, res) {
        try {
            const { id } = req.params;
            const { nome, quantidade_total, unidade, categoria, subcategoria, quantidade_minima, potes_fechados } = req.body;
            const dados = {};
            if (nome) dados.nome = nome;
            if (quantidade_total) dados.quantidade_total = quantidade_total;
            if (unidade) dados.unidade = unidade;
            if (categoria) dados.categoria = categoria;
            if (subcategoria) dados.subcategoria = subcategoria;
            if (quantidade_minima !== undefined) dados.quantidade_minima = quantidade_minima;
            if (potes_fechados !== undefined) dados.potes_fechados = potes_fechados;
            const resultado = await this.estoqueModel.editarProduto(id, dados);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            res.status(200).json({ message: 'Produto editado com sucesso.' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao editar produto', error: error.message });
        }
    }

    async entradaProduto(req, res) {
        try {
            const { id, quantidade } = req.body;
            if (!id || !quantidade || quantidade <= 0) {
                return res.status(400).json({ message: 'ID e quantidade válidos são obrigatórios.' });
            }
            const produtos = await this.estoqueModel.obterProdutos();
            const produto = produtos.find(p => p.id == id);
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            const novaQuantidade = produto.quantidade_total + quantidade;
            await this.estoqueModel.atualizarProduto(produto.id, { quantidade_total: novaQuantidade });
            return res.json({ message: `Entrada registrada! Quantidade atual: ${novaQuantidade}` });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao registrar entrada', error: error.message });
        }
    }

    async saidaProduto(req, res) {
        try {
            const { id, quantidade, unidade, responsavel } = req.body;
            if (!id || !quantidade || quantidade <= 0) {
                return res.status(400).json({ message: 'ID e quantidade válidos são obrigatórios.' });
            }
            const produtos = await this.estoqueModel.obterProdutos();
            const produto = produtos.find(p => p.id == id);
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }

            // Conversão automática de unidade (exemplo)
            let quantidadeConvertida = quantidade;
            if (produto.unidade === "L" && unidade === "ml") {
                quantidadeConvertida = quantidade / 1000;
            } else if (produto.unidade === "kg" && unidade === "g") {
                quantidadeConvertida = quantidade / 1000;
            }
            // Adicione outras conversões se quiser

            if (produto.quantidade_total < quantidadeConvertida) {
                return res.status(400).json({ message: 'Quantidade em estoque insuficiente.' });
            }
            const novaQuantidade = produto.quantidade_total - quantidadeConvertida;
            await this.estoqueModel.atualizarProduto(produto.id, { quantidade_total: novaQuantidade });

            // Salva histórico!
            await this.estoqueModel.registrarSaida(produto.id, quantidadeConvertida, produto.unidade, responsavel);

            return res.json({ message: `Saída registrada! Quantidade atual: ${novaQuantidade}` });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao registrar saída', error: error.message });
        }
    }

    async historicoSaida(req, res) {
        try {
            const { produto_id, dataInicio, dataFim } = req.query;
            const historico = await this.estoqueModel.obterHistoricoSaida({ produto_id, dataInicio, dataFim });
            res.status(200).json(historico);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar histórico', error: error.message });
        }
    }

    async relatorioSaidaTXT(req, res) {
        try {
            const { produto_id, dataInicio, dataFim } = req.query;
            const historico = await this.estoqueModel.obterHistoricoSaida({ produto_id, dataInicio, dataFim });

            // Monta TXT com tabela alinhada
            let txt = "Produto\tQuantidade\tUnidade\tData\t\t\tResponsável\n";
            for (const row of historico) {
                // Formata a data para YYYY-MM-DD HH:MM:SS
                const dataFormatada = new Date(row.data_saida)
                    .toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace('T', ' ');
                txt += `${row.nome}\t${row.quantidade}\t${row.unidade}\t${dataFormatada}\t${row.responsavel || ""}\n`;
            }
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename=relatorio_saida.txt');
            res.send(txt);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
        }
    }

    async relatorioSaidaCSV(req, res) {
        try {
            const { produto_id, dataInicio, dataFim } = req.query;
            const historico = await this.estoqueModel.obterHistoricoSaida({ produto_id, dataInicio, dataFim });

            // Monta CSV
            let csv = "Produto,Quantidade,Unidade,Data,Responsável\n";
            for (const row of historico) {
                // Formata a data para YYYY-MM-DD HH:MM:SS
                const dataFormatada = new Date(row.data_saida)
                    .toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace('T', ' ');
                csv += `"${row.nome}",${row.quantidade},${row.unidade},"${dataFormatada}","${row.responsavel || ""}"\n`;
            }
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=relatorio_saida.csv');
            res.send(csv);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
        }
    }
}

module.exports = EstoqueController;
# Estoque System

Este projeto é um sistema de gerenciamento de estoque desenvolvido em Node.js, utilizando um banco de dados MySQL. O objetivo é fornecer uma API para gerenciar produtos em estoque, permitindo adicionar, remover e listar produtos.

## Estrutura do Projeto

```
estoque-system
├── src
│   ├── app.js                  # Ponto de entrada da aplicação
│   ├── controllers             # Controladores para gerenciar a lógica de negócios
│   │   └── estoqueController.js # Controlador de estoque
│   ├── models                  # Modelos para interagir com o banco de dados
│   │   └── estoqueModel.js     # Modelo de estoque
│   ├── routes                  # Definição das rotas da API
│   │   └── estoqueRoutes.js    # Rotas de estoque
│   └── config                  # Configurações do projeto
│       └── database.js         # Configuração da conexão com o banco de dados
├── package.json                # Configuração do npm e dependências
├── .env                        # Variáveis de ambiente
└── README.md                   # Documentação do projeto
```

## Instalação

1. Clone o repositório:
   ```
   git clone <URL do repositório>
   ```

2. Navegue até o diretório do projeto:
   ```
   cd estoque-system
   ```

3. Instale as dependências:
   ```
   npm install
   ```

4. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=nome_do_banco
   ```

## Uso

Para iniciar o servidor, execute o seguinte comando:
```
npm start
```

A API estará disponível em `http://localhost:3000`.

## Funcionalidades

- **Adicionar Produto**: Permite adicionar um novo produto ao estoque.
- **Remover Produto**: Permite remover um produto existente do estoque.
- **Listar Produtos**: Permite listar todos os produtos disponíveis no estoque.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.
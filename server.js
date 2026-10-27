import express from 'express';
import dotenv from 'dotenv';
import con from './db.js';

dotenv.config();

const app = express();

// Middleware: habilita a leitura de payloads em formato JSON no corpo das requisições (req.body)
app.use(express.json());

// Middleware: serve arquivos estáticos (HTML, CSS, JS do frontend) a partir da pasta 'public'
app.use(express.static('./public'));

const PORTA = process.env.PORTA || 3000;

// =========================================================================
// TESTE DE CONEXÃO INICIAL COM O BANCO
// =========================================================================

try {
    await con.query("SELECT 1");
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
} catch (error) {
    console.error("Falha ao conectar com o banco de dados:", error.message);
}

// =========================================================================
// ROTAS DA API (CRUD)
// =========================================================================

// GET / - Rota raiz que entrega o arquivo index.html da pasta public
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "./public" });
});

// GET /tarefas - Retorna a lista de todas as tarefas cadastradas
app.get("/tarefas", async (req, res) => {
    try {
        const sql = "SELECT * FROM tarefas";
        const [resposta] = await con.query(sql);
        res.status(200).json(resposta);
    } catch (error) {
        console.error("Erro na rota GET /tarefas:", error);
        res.status(500).json({ error: "Erro interno ao buscar tarefas." });
    }
});

// POST /tarefas - Insere uma nova tarefa no banco de dados
app.post("/tarefas", async (req, res) => {
    try {
        const { nome, descricao, responsavel, data_tarefa, concluido } = req.body;

        // Comando SQL parametrizado (?) para prevenir SQL Injection
        const sql = "INSERT INTO tarefas (nome, descricao, responsavel, data_tarefa, concluido) VALUES (?, ?, ?, ?, ?)";
        
        const [resposta] = await con.query(sql, [
            nome,
            descricao,
            responsavel,
            data_tarefa,
            concluido
        ]);

        res.status(201).json({
            id: resposta.insertId,
            message: "Tarefa cadastrada com sucesso!"
        });
    } catch (error) {
        console.error("Erro na rota POST /tarefas:", error);
        res.status(500).json({ error: "Erro interno ao cadastrar tarefa." });
    }
});

// PUT /tarefas/:id - Atualiza os dados de uma tarefa existente pelo ID
app.put("/tarefas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, responsavel, data_tarefa, concluido } = req.body;

        const sql = "UPDATE tarefas SET nome = ?, descricao = ?, responsavel = ?, data_tarefa = ?, concluido = ? WHERE id = ?";
        
        const [resposta] = await con.query(sql, [
            nome,
            descricao,
            responsavel,
            data_tarefa,
            concluido,
            id
        ]);

        if (resposta.affectedRows > 0) {
            res.status(200).json({ message: "Tarefa atualizada com sucesso!" });
        } else {
            res.status(404).json({ message: "Tarefa não encontrada." });
        }
    } catch (error) {
        console.error("Erro na rota PUT /tarefas/:id:", error);
        res.status(500).json({ error: "Erro interno ao atualizar tarefa." });
    }
});

// DELETE /tarefas/:id - Remove uma tarefa do banco de dados pelo ID
app.delete("/tarefas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM tarefas WHERE id = ?";
        
        const [resposta] = await con.query(sql, [id]);

        if (resposta.affectedRows > 0) {
            res.status(200).json({ message: "Tarefa deletada com sucesso!" });
        } else {
            res.status(404).json({ message: "Tarefa não encontrada." });
        }
    } catch (error) {
        console.error("Erro na rota DELETE /tarefas/:id:", error);
        res.status(500).json({ error: "Erro interno ao deletar tarefa." });
    }
});

// Inicialização do servidor
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
import express from 'express';
import dotenv from 'dotenv';



////////////////////////////////////////////////////////////////////////

// recuperando informações do arquivo .env (variáveis de ambiente)
dotenv.config();
// cria a aplicação (servidor)
const app = express(); //definimos o nome de express como APP
// permite json no corpo das requisições
app.use(express.json()); //traduzimos o Express para o json poder ler
// definir a pasta de arquivos estáticos (frontend)
app.use(express.static('./public'));

//////////////////////////////////////////

//chamdas de metodos

const PORTA = process.env.PORTA; //definindo que ele vai chamar a prta vinda o ENV

//GET

app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "./public" }); //
}); /* alternativa O static transforma a pasta inteira em um servidor de arquivos.
  Serve o index.html, CSS, JS e imagens automaticamente.*/


/* • app.get('/'): Escuta o acesso ao endereço principal (ex: localhost:3000/).
• res.sendFile: Pega o arquivo físico e entrega para quem acessou.
• { root: "./public" }: Diz ao servidor em qual pasta o arquivo index.html está guardado.
*/

//////////////////////////////////////////////////////////////////////////

//GET

app.get("/tarefas", async (req, res) => {
    const sql = "SELECT * FROM tarefas";
    const [resposta] = await conexao.query(sql); // resposta de acordo com o aguardo da conexão
    res.json(resposta);
});

/*  app.get('/Tarefas'): Escuta o acesso a essa rota específica.
    SELECT * FROM registro: Comando SQL que traz todas as linhas e colunas da tabela de Registro.
    conexao.query(sql): Executa a busca no banco de dados e guarda o resultado em resposta.
    res.json(resposta): Envia os dados dos livros de volta para o cliente formatados como texto JSON.
    //o async e o await servem apenas para dizem que vai ver um await e o await vai mandar aguardar uma resposta neste caso do sql
*/

/////////////////////////////////////////////////////////////////////

//POST =posta nova informação ao banco de dados baseado nas informações que temos disponiveis nele
//POST

app.post("/tarefas", async (req, res) => {
    const {nome, descricao, responsavel, data_tarefa, concluido } = req.body;
    const sql = "INSERT INTO tarefas (nome, descricao, responsavel, data_tarefa, concluido) VALUES (?, ?, ?, ?, ?)"; //se comunica sobre onde colocar os valores dentro da tabela registro
    const [resposta] = await conexao.query(sql, [ //aguarda a resposta do sql
            nome,
            descricao,
            responsavel,
            data_tarefa,
            concluido
    ]);

    res.status(201).json({
        id: resposta.insertId,
        message: "Livro cadastrado com sucesso!"
    });
})
/////////////////////////////////////////////////////////
//PUT

app.put("/tarefa/:id", async (req, res) => {
    const id = req.params.id;
    const {nome, descricao, responsavel, data_tarefa, concluido} = req.body;

    const sql = "UPDATE livro SET nome = ?, descricao = ?, responsavel = ? data_tarefa = ?, concluido = ? WHERE id = ?";
    const [resposta] = await conexao.query(sql, [
        nome, 
        descricao, 
        responsavel, 
        data_tarefa, 
        concluido,
        id
    ]);
    if(resposta.affectedRows > 0) {
        res.json({"message": "Tarefa atualizado com sucesso"});
    } else {
        res.status(404).json({"message": "Tarefa não encontrado!"})
    }
});

///////////////////////////////////////////////

//DELETE
app.delete("/livro/:id", async (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM livro WHERE id = ?";
    
    // Executa a query no banco de dados
    const [resposta] = await conexao.query(sql, [id]);

    // Verifica se o Tarefa realmente existia e foi deletado
    if (resposta.affectedRows > 0) {
        res.json({ "message": "Tarefa deletado com sucesso!" });
    } else {
        res.status(404).json({ "message": "Tarefa não encontrado!" });
    }
});
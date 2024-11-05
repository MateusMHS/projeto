const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*', // Permitir solicitações de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mcdonalds'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao MySQL');
});

// Rota para inserir pedidos
app.post('/addPedido', (req, res) => {
    let { items, totalPreco, formaPagamento, nome, cpf } = req.body;
    let sql = 'INSERT INTO pedidos (items, totalPreco, formaPagamento, nome, cpf) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [JSON.stringify(items), totalPreco, formaPagamento, nome, cpf], (err, result) => {
        if (err) throw err;
        res.send('Pedido adicionado');
    });
});

// Rota para autenticar login do administrador 
app.post('/login', (req, res) => 
    { const { username, password } = req.body; let sql = 'SELECT * FROM admin WHERE username = ? AND password = ?'; 
db.query(sql, [username, password], 
    (err, results) => { if (err) throw err; if (results.length > 0) { res.json({ success: true }); } else { res.json({ success: false, message: 'Usuário ou senha incorretos' }); } }); }); 
    
// Rota para adicionar item 
app.post('/addItem', (req, res) => { const { name, price, category } = req.body; let sql = 'INSERT INTO lanche (nome, preco, categoria) VALUES (?, ?, ?)'; 
db.query(sql, [name, price, category], (err, result) => { if (err) throw err; res.send('Item adicionado'); }); }); 

// Rota para remover item 
app.delete('/removeItem/:id', (req, res) => { const id = req.params.id; 
    let sql = 'DELETE FROM lanche WHERE id = ?'; 
    db.query(sql, [id], (err, result) => { if (err) throw err; res.send('Item removido'); }); }); 
    
// Rota para atualizar item 
app.put('/updateItem/:id', (req, res) => { const id = req.params.id; const { nome, preco, categoria } = req.body; 
let sql = 'UPDATE lanche SET nome = ?, preco = ?, categoria = ? WHERE id = ?'; db.query(sql, [nome, preco, categoria, id], 
    (err, result) => { if (err) throw err; res.send('Item atualizado'); }); });

// Testar Conexão
app.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
});

app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});



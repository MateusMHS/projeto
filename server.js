const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'seu_banco_de_dados'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao MySQL');
});

// Rota para inserir itens selecionados
app.post('/addItems', (req, res) => {
    let items = req.body.items;
    let totalPreco = req.body.totalPreco;
    let sql = 'INSERT INTO pedidos (items, totalPreco) VALUES (?, ?)';
    db.query(sql, [JSON.stringify(items), totalPreco], (err, result) => {
        if (err) throw err;
        res.send('Pedido adicionado');
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

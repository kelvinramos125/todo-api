const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { values } = require('mysql2/lib/constants/charset_encodings');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'krb12345',
    database: 'todo'
});

try {
    connection.connect();
}catch (e) {
    console.log('Oops. Connection to MySQL failed');
    console.log(e);
}

console.log(connection);

const api = express();
api.use(express.static(__dirname + '/public'))
api.use(bodyParser.json());

api.listen(3000, () => {
    console.log('API up and running');
});

api.get('/task', (req,res) => {
    connection.query('SELECT * FROM task ORDER BY created DESC', (error, result) => {
        if (error) return res.json({ error: error});

        res.json({
            todo: results.filter(item => !item.completed),
            completed: results.filter(item => item.completed)
        });
    });
});

api.post('/task/:id/remove', (req, res) => {
    connection.query('DELETE FROM task WHERE id = ?', [req.params.id], (erro, results) => {
        if (error) return res.json({error: error});

        res.json({});
    })
})

api.post('/task/add', (req, res) =>{
    console.log(req.body);
    connection.query('INSERT INTO task (description) VALUES(?)', [req.body.item], (error, result) =>{
        if (error) return res.json({ error: error});

        connection.query('SELECT LAST_INSERT_ID() FROM task',(error, result) => {
            if (error) return res.json({ error: error});
        
            res.json({
                id: results[0]['LAST_INSERTED_ID'],
                description: req.body.item
            });
        })
    })
});
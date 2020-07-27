const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'krb12345',
    database: 'todo'
});

try {
    connection.connect();
} catch (e) {
    console.log('connection failed');
    console.log(e);
}

const api = express();
api.use(express.static(__dirname + '/public'));
api.use(bodyParser.json())

api.listen(3000, () => {
    console.log('API up and running!');
});

api.get('/task', (req, res) => {
    connection.query('SELECT * FROM task ORDER BY created DESC', (error, results) => {
        if (error) return res.json({ error: error });

        res.json(results);
    });
});

api.post('/task/add', (req, res) => {
    connection.query('INSERT INTO task (description) VALUES (?)', [req.body.item], (error, results) => {
        if (error) return res.json({ error: error });

        connection.query('SELECT LAST_INSERT_ID() FROM task', (error, results) => {
            if (error) return res.json({ error: error });

            res.json({
                id: results[0]['LAST_INSERT_ID()'],
                description: req.body.item
            });
        });
    });
});

api.post('/task/:id/update', (req, res) => {
    connection.query('UPDATE task SET completed = ? WHERE id = ?', [req.body.completed, req.params.id], (error, results) => {
        if (error) return res.json({ error: error });

        res.json({});
    })
})

api.post('/task/:id/remove', (req, res) => {
    connection.query('DELETE FROM task WHERE id = ?', [req.params.id], (error, results) => {
        if (error) return res.json({ error: error });

        res.json({});
    });
});
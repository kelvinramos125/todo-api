const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ' krb12345',
    database: 'todo'
});

try {
    connection.connect();
}catch (e) {
    console.log('Oops. Connection to MySQL failed');
    console.log(e);
}

const api = express();
api.use(express.static(__dirname + '/public'))
api.use(bodyParser.json());

api.listen(3000, () => {
    console.log('API up and running');
});

api.post('/add', (req, res) =>{
    console.log(req.body);
    res.send('It works!')
});
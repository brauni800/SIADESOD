const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'siadesod',
});

connection.connect(err => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log('DB connected');
});

module.exports = connection;
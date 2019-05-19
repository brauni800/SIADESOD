const mysql = require('mysql');

var connection;
if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'siadesod',
    });
}


connection.connect(err => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log('DB connected');
});

module.exports = connection;
const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Initialiser la connection
var connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

// Connexion à la BDD
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

setInterval(function () {
    connection.query('SELECT 1');
}, 300000);

module.exports = connection;
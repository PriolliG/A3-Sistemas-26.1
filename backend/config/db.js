const mysql = require('mysql2/promise');
require('dotenv').config();

// Config de conexao com o database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});

// testa internamente a conexao ao inicializar
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connection with database up!');
        connection.release(); // devolve a conexao p/a pool
    } catch (error) {
        console.log('Error when connecting to database: ', error.mesage);
        process.exit(1); // encerra se n conseguir se conectar ao banco     
    }
}
testConnection();

module.exports = pool;
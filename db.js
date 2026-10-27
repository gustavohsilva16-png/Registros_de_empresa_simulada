import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Cria a piscina de conexões com o MySQL
const con = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nome_do_seu_banco',
    port: process.env.DB_PORT || 3306
});

// Exportação padrão para bater com "import con from './db.js'"
export default con;
import mariadb from 'mariadb';

// Adicionado o 'export' aqui no início da função
export function conectarBanco() {
    const con = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
    
    return con;
}
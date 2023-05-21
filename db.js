import pg from 'pg';
const { Pool } = pg;

export const db = new Pool( {
    user: "postgres",
    password : "postgres",
    host: "localhost",
    port : 5432,
    database: "db_art"
})







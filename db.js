import pg from 'pg';
const { Pool } = pg;

export const db = new Pool( {
    user: "root",
    password : "3701Ooputih!",
    host: "46.243.226.3",
    port : 5432,
    database: "art_db"
})







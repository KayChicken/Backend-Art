import pg from 'pg';
const { Pool } = pg;

export const db = new Pool( {
    user: "user",
    password : "c7yvauQ7jDbZZVxToqxe7JNtb5P9fvbk",
    host: "dpg-chkuls3hp8uej70gf6bg-a.oregon-postgres.render.com",
    port : 5432,
    database: "db_salon"
})







const fn = require("knex");

const knex = fn({
    client: 'mysql2',
    connection: {
        host : '127.0.0.1',
        port : 3306,
        user : 'root',
        password : '',
        database : 'auction'
    },
    pool: { min: 0, max: 10 }
});
module.exports= knex;
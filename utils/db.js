const config = require('../config');
const mysql = require('mysql8');
const { promisify } = require("util");

const db = mysql.createPool({
    connectionLimit : config.mysql.pool,
    host            : config.mysql.host,
    port            : config.mysql.port,
    user            : config.mysql.user,
    password        : config.mysql.pass,
    database        : config.mysql.db
});

//Database test
db.getConnection((err, connection) => {
    if (err) {
        console.log(`  \x1b[31m[ERROR] Database failed to initialize: ${err.errno}, ${err.sqlMessage ? err.sqlMessage : ""}\x1b[0m`);
        process.exit(1);
    }
    if (connection)
        connection.release();
    console.log('  \x1b[32m[LOG] Database initialized successfully.\x1b[0m');
});

db.query = promisify(db.query);
module.exports = db;
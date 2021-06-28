const knex = require("knex")

const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "../scripts/database.db"
    }
})

module.exports = connectedKnex

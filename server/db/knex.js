const knex = require("knex")

const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "../scripts/database.db"
    },
    useNullAsDefault: true
})

module.exports = connectedKnex

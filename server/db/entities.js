const knex = require("./knex");

function insertEntity(entityName, entity) {
    return knex(entityName).insert(entity);
}

function getEntity(entityName, colName, value) {
    return knex(entityName).select("*").where(colName, value);
    //return knex(entityName).where(colName, value.select("*"));
}

function getAllEntities(entityName) {
    return knex(entityName).select("*");
}

function deleteEntity(entityName, colName, value) {
    return knex(entityName).where(colName, value).del();
}

function  updateEntity(entityName, colName, value, entity) {
    return knex(entityName).where(colName, value).update(entity);
}

module.exports = {
    insertEntity,
    getEntity,
    getAllEntities,
    deleteEntity,
    updateEntity
}
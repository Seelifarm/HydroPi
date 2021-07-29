const knex = require("./knex");

function insertEntity(entityName, entity) {
    console.info(`Insert ${JSON.stringify(entity)} into ${entityName}-table`)
    return knex(entityName).insert(entity);
}

function getEntity(entityName, colName, value) {
    // console.info(`Select from ${entityName}-table into ${entityName}-table`)
    return knex(entityName).select("*").where(colName, value);
}

function getAllEntities(entityName) {
    return knex(entityName).select("*");
}

function getLastEntity(entityName, colNameOrder){
    return knex.select('*').from(entityName).limit(1).orderBy(colNameOrder, 'desc')
}

function deleteEntity(entityName, colName, value) {
    return knex(entityName).where(colName, value).del();
}

function deleteSpecificEntity(entityName, colName, value, colName2, value2) {
    return knex(entityName).where(colName, value).andWhere(colName2, value2).del();
}

function updateEntity(entityName, colName, value, entity) {
    return knex(entityName).where(colName, value).update(entity);
}

module.exports = {
    insertEntity,
    getEntity,
    getAllEntities,
    getLastEntity,
    deleteSpecificEntity,
    deleteEntity,
    updateEntity
}
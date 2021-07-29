const knex = require("./knex");
const logger = require('../log/logger')(__filename.slice(__filename.lastIndexOf('/')+1))


function insertEntity(entityName, entity) {
    logger.verbose(`Insert ${JSON.stringify(entity)} into ${entityName}-table`)
    return knex(entityName).insert(entity);
}

function getEntity(entityName, colName, value) {
    logger.verbose(`Select * from ${entityName}-table where ${colName} = ${value}`)
    return knex(entityName).select("*").where(colName, value);
}

function getAllEntities(entityName) {
    logger.verbose(`Select * from ${entityName}-table`)
    return knex(entityName).select("*");
}

function getLastEntity(entityName, colNameOrder){
    logger.verbose(`Select last from ${entityName}-table sorted by ${colNameOrder}`)
    return knex.select('*').from(entityName).limit(1).orderBy(colNameOrder, 'desc')
}

function deleteEntity(entityName, colName, value) {
    logger.verbose(`Delete from ${entityName}-table where ${colName} = ${value}`)
    return knex(entityName).where(colName, value).del();
}

function deleteSpecificEntity(entityName, colName, value, colName2, value2) {
    logger.verbose(`Delete from ${entityName}-table where ${colName} = ${value} and ${colName2} = ${value2}`)
    return knex(entityName).where(colName, value).andWhere(colName2, value2).del();
}

function updateEntity(entityName, colName, value, entity) {
    logger.verbose(`Update ${JSON.stringify(entity)} in ${entityName}-table where ${colName} = ${value}`)
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
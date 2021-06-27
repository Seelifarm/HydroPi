const knex = require("./knex");

function createIrrigationPlan(irrigationPlan) {
    return knex("irrigationPlans").insert(irrigationPlan);
}

function getAllIrrigationPlans() {
    return knex("irrigationPlans").select("*");
}

function deleteIrrigationPlan(planId) {
    return knex("irrigationPlans").where("planID", planId).del();
}

function  updateIrrigationPlan(planId, irrigationPlan) {
    return knex("irrigationPlans").where("planID", planId).update(irrigationPlan);
}

module.exports = {
    createIrrigationPlan,
    getAllIrrigationPlans,
    deleteIrrigationPlan,
    updateIrrigationPlan
}
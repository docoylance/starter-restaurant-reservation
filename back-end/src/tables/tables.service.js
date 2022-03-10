const knex = require("../db/connection");

function list() {
  return knex("tables").select().orderBy("table_name");
}

function read(table_id) {
  return knex("tables").where({ table_id }).first();
}

function create(formData) {
  return knex("tables")
    .insert(formData)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function seatReservation(reservation_id, table_id) {
  // updates status for reservations table
  await knex("reservations").where(reservation_id).update({ status: "seated" });

  // updates reservation_id for tables table
  return knex("tables")
    .where({ table_id })
    .update(reservation_id, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

async function finishReservation(table_id) {
  const { reservation_id } = await read(table_id);
  // updates status for reservations table
  await knex("reservations")
    .where({ reservation_id })
    .update({ status: "finished" });

  // updates reservation_id for tables table
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id: null }, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = { list, create, read, seatReservation, finishReservation };

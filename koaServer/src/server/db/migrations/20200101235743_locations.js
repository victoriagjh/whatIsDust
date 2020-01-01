
exports.up = function(knex, Promise) {
  return knex.schema.createTable('locations', (table) => {
    table.increments().unique();
    table.string('name').notNullable();
    table.string('position').notNullable();
    table.timestamp('recorded_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('locations');
};

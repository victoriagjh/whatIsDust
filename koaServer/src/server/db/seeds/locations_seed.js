
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('locations').del()
    .then(() => {
      // Inserts seed entries
      return knex('locations').insert([
        {name: '휴먼스케잎', position: '(37,128)'},
      ]);
    });
};

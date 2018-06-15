const Knex = require('knex');

module.exports = async function createDatabase(databaseConfig) {
  const { connection } = databaseConfig;
  const config = Object.assign({}, databaseConfig, {
    connection: Object.assign({}, connection, {
      database: 'postgres',
    }),
  });
  const knex = Knex(config);
  await knex.raw(`DROP DATABASE ${databaseConfig.connection.database}`);
  await knex.destroy();
};

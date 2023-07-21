const sharedConfig = {
  client: "sqlite3",
  useNullAsDefault: null,
  seeds: { directory: "./data/seeds" },
  migrations: { directory: "./data/migrations" },
  pool: {
    afterCreate: (conn, done) => conn.run("PRAGMA foreign_keys = ON", done),
  },
};

module.exports = {
  development: {
    ...sharedConfig,
    connection: { filename: "./data/database.db3" },
  },
  testing: {
    ...sharedConfig,
    connection: { filename: "./data/testing.db3" }, //test yapmaya başladığımızda otomatik tesing.db3 dosyası oluşacak
  },
};

const { createPool } = require("mysql");
const { ports: { dbPort }, database: { host, user, password, name } } = require("../config/config.json");

module.exports = createPool({
  port: dbPort,
  host,
  user,
  password,
  database: name,
  connectionLimit: 10
});

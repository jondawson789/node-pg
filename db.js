/** Database setup for BizTime. */



const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://%2Fvar%2Frun%2Fpostgresql/biztime"
});

client.connect();


module.exports = client;




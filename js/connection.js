const Sequelize = require("sequelize");
const path = "delilah_resto"
const conn = new Sequelize (path, "root", "",{
    host: "localhost",
    dialect: "mysql"
});

conn.authenticate().then(()=>console.log("up and running")).catch(error=>{console.error("connection error", error)});

module.exports = conn;
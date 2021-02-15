const conn = require("./connection");
const Sequelize = require("sequelize");

const Order = conn.define("users", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: Sequelize.DataTypes.INTEGER,
    date: Sequelize.DataTypes.DATE,
    products_description: Sequelize.DataTypes.TEXT,
    payment_method: Sequelize.DataTypes.TEXT,
    total: Sequelize.DataTypes.FLOAT,
    user_id: {
        type: Sequelize.DataTypes.INTEGER,
        foreignKey: true
    },
    delivery_addres: Sequelize.DataTypes.TEXT,
    products: Sequelize.DataTypes.ARRAY
},{}
);

module.exports = Order
const conn = require("./connection");
const Sequelize = require("sequelize");

const Order = conn.define("orders", {
    order_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: Sequelize.DataTypes.INTEGER,
    date: Sequelize.DataTypes.DATE,
    products_description: Sequelize.DataTypes.TEXT,  //foreign key?
    payment_method: Sequelize.DataTypes.TEXT,
    total: Sequelize.DataTypes.FLOAT,
    user_id: {
        type: Sequelize.DataTypes.INTEGER,
        foreignKey: true
    },
    delivery_address: Sequelize.DataTypes.TEXT,
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
    }

},{}
);

module.exports = Order
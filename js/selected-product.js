const conn = require("./connection");
const Sequelize = require("sequelize");

const SelectedProduct = conn.define("selectedProducts", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: Sequelize.DataTypes.INTEGER,
    product_id: Sequelize.DataTypes.INTEGER,
    user_id: Sequelize.DataTypes.INTEGER,
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

module.exports = SelectedProduct
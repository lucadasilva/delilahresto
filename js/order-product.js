const conn = require("./connection");
const Sequelize = require("sequelize");
const Order = require("./order");
const Product = require("./product")

const OrderProduct = conn.define("orderProducts", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'order_id'
        }
    },
    product_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'product_id'
        }
    },
    quantity: Sequelize.DataTypes.INTEGER,
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
    },
},{}
);

module.exports = OrderProduct
const conn = require("./connection");
const Sequelize = require("sequelize");

const Product = conn.define("products", {
    product_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.DataTypes.TEXT,
    price: Sequelize.DataTypes.FLOAT,
    img_url: Sequelize.DataTypes.TEXT,
    description: Sequelize.DataTypes.TEXT,
    is_disabled: Sequelize.DataTypes.BOOLEAN,
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

module.exports = Product
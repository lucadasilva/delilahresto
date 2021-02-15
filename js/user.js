const conn = require("./connection");
const Sequelize = require("sequelize");

const User = conn.define("users", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: Sequelize.DataTypes.TEXT,
    password: Sequelize.DataTypes.TEXT,
    email: Sequelize.DataTypes.TEXT,
    delivery_address: Sequelize.DataTypes.TEXT,
    full_name: Sequelize.DataTypes.TEXT,
    phone: Sequelize.DataTypes.TEXT,
    is_admin: Sequelize.DataTypes.BOOLEAN,
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

module.exports = User
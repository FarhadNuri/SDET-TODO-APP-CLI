import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sql = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,  // Disable SQL query logging
    }
);

const User = sql.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    }, {
    tableName: 'users',
    timestamps: true,
});

const TodoList = sql.define('TodoList', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'todos',
    timestamps: true,
});


User.hasMany(TodoList, { foreignKey: 'userId' });
TodoList.belongsTo(User, { foreignKey: 'userId' });

async function initDB() {
    await sql.authenticate();
    await sql.sync();
    console.log('Database connected and synced successfully.');
}

async function closeDB() {
    await sql.close();
    console.log('Database connection closed successfully.');
}

export { sql, User, TodoList, initDB, closeDB };
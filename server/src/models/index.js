require('dotenv').config();
const {
    Pool
} = require('../../../node_modules/pg');

// Создаем пул соединений с базой данных
const pool = new Pool({
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: 5432,
    database: 'football',
});

// Экспортируем пул соединений для использования в моделях
module.exports = pool;
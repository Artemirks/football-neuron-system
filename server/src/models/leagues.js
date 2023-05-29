// Подключение к базе данных
const pool = require('../models');

//CRUD для лиг
// Создание новой лиги
const createLeague = async (id, name, dateLastMatch, scorePred) => {
    console.log(id, name, dateLastMatch, scorePred);
    const {
        rows
    } = await pool.query(
        'INSERT INTO public."League" ("ID", name, "Date_last_match", score_pred) VALUES ($1, $2, $3, $4)',
        [id, name, dateLastMatch, scorePred]
    );
    return rows[0];
};

// Получение списка всех лиг
const getAllLeagues = async () => {
    const {
        rows
    } = await pool.query('SELECT * FROM leagues');
    return rows;
};

// Получение информации о конкретной лиге
const getLeagueById = async (id) => {
    const {
        rows
    } = await pool.query('SELECT * FROM leagues WHERE id = $1', [id]);
    return rows[0];
};

// Обновление информации о лиге
const updateLeague = async (id, name, country) => {
    const {
        rows
    } = await pool.query(
        'UPDATE leagues SET name = $1, country = $2 WHERE id = $3 RETURNING *',
        [name, country, id]
    );
    return rows[0];
};

// Удаление лиги
const deleteLeague = async (id) => {
    const {
        rows
    } = await pool.query('DELETE FROM leagues WHERE id = $1 RETURNING *', [
        id,
    ]);
    return rows[0];
};

//Получение колчиества матчей по номеру лиги
const getCountMatchesByLeague = async (id) => {
    const {
        rows: [{
            matches_on_tour
        }]
    } = await pool.query('SELECT matches_on_tour from public."League" WHERE "ID" = $1', [
        id,
    ]);

    return matches_on_tour;
};

//Получение текущего состояние прогноща
const getCurrentStagePred = async (id) => {
    const {
        rows: [{
            score_pred
        }]
    } = await pool.query('SELECT score_pred from public."League" WHERE "ID" = $1', [
        id,
    ]);

    return score_pred;
};

const getNameLeague = async (id) => {
    const {
        rows: [{
            name
        }]
    } = await pool.query('SELECT name from public."League" WHERE "ID" = $1', [
        id,
    ]);

    return name;
};

const setTrueStagePred = async (id, status) => {
    const {
        rows
    } = await pool.query('UPDATE public."League" SET "score_pred" = $2 WHERE "ID" = $1', [
        id, status
    ]);

    return rows[0];
};
module.exports = {
    createLeague,
    getAllLeagues,
    getLeagueById,
    updateLeague,
    deleteLeague,
    getCountMatchesByLeague,
    getCurrentStagePred,
    setTrueStagePred,
    getNameLeague
};
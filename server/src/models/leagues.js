// Подключение к базе данных
const pool = require('../models');

//CRUD для лиг
// Создание новой лиги
const createleagues = async (id, name, dateLastMatch, scorePred) => {
    const {
        rows
    } = await pool.query(
        'INSERT INTO public."leagues" ("id", name, "Date_last_match", score_pred) VALUES ($1, $2, $3, $4)',
        [id, name, dateLastMatch, scorePred]
    );
    return rows[0];
};

// Получение списка всех лиг
const getAllleaguess = async () => {
    const {
        rows
    } = await pool.query('SELECT * FROM leaguess');
    return rows;
};

// Получение информации о конкретной лиге
const getleaguesByid = async (id) => {
    const {
        rows
    } = await pool.query('SELECT * FROM leaguess WHERE id = $1', [id]);
    return rows[0];
};

// Обновление информации о лиге
const updateleagues = async (id, name, country) => {
    const {
        rows
    } = await pool.query(
        'UPDATE leaguess SET name = $1, country = $2 WHERE id = $3 RETURNING *',
        [name, country, id]
    );
    return rows[0];
};

// Удаление лиги
const deleteleagues = async (id) => {
    const {
        rows
    } = await pool.query('DELETE FROM leaguess WHERE id = $1 RETURNING *', [
        id,
    ]);
    return rows[0];
};

//Получение колчиества матчей по номеру лиги
const getCountMatchesByleagues = async (id) => {
    const {
        rows: [{
            matches_on_tour
        }]
    } = await pool.query('SELECT matches_on_tour from public."leagues" WHERE "id" = $1', [
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
    } = await pool.query('SELECT score_pred from public."leagues" WHERE "id" = $1', [
        id,
    ]);

    return score_pred;
};

const getNameLeague = async (id) => {
    const {
        rows: [{
            name
        }]
    } = await pool.query('SELECT name from public."leagues" WHERE "id" = $1', [
        id,
    ]);

    return name;
};

const setTrueStagePred = async (id, status) => {
    const {
        rows
    } = await pool.query('UPDATE public."leagues" SET "score_pred" = $2 WHERE "id" = $1', [
        id, status
    ]);

    return rows[0];
};
module.exports = {
    createleagues,
    getAllleaguess,
    getleaguesByid,
    updateleagues,
    deleteleagues,
    getCountMatchesByleagues,
    getCurrentStagePred,
    setTrueStagePred,
    getNameLeague
};
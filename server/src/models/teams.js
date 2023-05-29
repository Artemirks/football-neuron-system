// Подключение к базе данных
const pool = require('../models');


//CRUD для команд
// Создание новой команды
const createTeam = async (id, name, leagueId) => {
    console.log(id, name, leagueId);
    const {
        rows
    } = await pool.query(
        'INSERT INTO public."Teams" ("ID", name, "league_id") VALUES ($1, $2, $3)',
        [id, name, leagueId]
    );
    return rows[0];
};

//Получение всех команд по ID лиги
const getAllTeamsByLeague = async (leagueId) => {
    const {
        rows
    } = await pool.query(
        'SELECT * from public."Teams" WHERE league_id = $1', [leagueId]
    );
    return rows;
};

//Получение имени по ID
const getNameTeamByID = async (teamId) => {
    const {
        rows: [{
            name
        }]
    } = await pool.query(
        'SELECT "name" from public."Teams" WHERE "ID" = $1', [teamId]
    );
    return name;
};

module.exports = {
    createTeam,
    getAllTeamsByLeague,
    getNameTeamByID
};
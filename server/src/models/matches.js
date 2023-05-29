const pool = require('./index');

// Получение списка всех матчей
const getMatches = async () => {
    const {
        rows
    } = await pool.query('SELECT * FROM matches');
    return rows;
};

// Получение информации о конкретном матче
const getMatchById = async (id) => {
    const {
        rows
    } = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
    return rows[0];
};

//Создание записи о матче
const createMatchDate = async (id, matchDate, championID, homeTeamID, awayTeamID, predictedHomeTeamGoals, predictedAwayTeamGoals, matchStatus) => {
    const {
        rows
    } = await pool.query('INSERT INTO public."Matches"("ID", "Match_date", "Championship_ID", "Home_team_ID", "Away_team_ID", "Predicted_home_team_goals", "Predicted_away_team_goals", "Match_status") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id, matchDate, championID, homeTeamID, awayTeamID, predictedHomeTeamGoals, predictedAwayTeamGoals, matchStatus]);
    return rows[0];
};

//Получение прогноза
const getListMatches = async (leagueId, status) => {
    const {
        rows
    } = await pool.query(
        'SELECT "ID", "Home_team_ID", "Away_team_ID", "Predicted_home_team_goals", "Predicted_away_team_goals", "Actual_home_team_goals", "Actual_away_team_goals", "Match_date" FROM public."Matches" WHERE "Match_status" = $2 and "Championship_ID" = $1 ORDER BY "Match_date"', [leagueId, status]
    );
    return rows;
};


const updateDataMatch = async (matchID, homeGoal, awayGoal) => {
    const {
        rows
    } = await pool.query('UPDATE public."Matches" SET "Actual_home_team_goals" = $2 , "Actual_away_team_goals" = $3 WHERE "ID" = $1;',
        [matchID, homeGoal, awayGoal]);
    return rows[0];
};

const updatePredWithNewXG = async (matchID, homePredGoal, awayPredGoal) => {
    const {
        rows
    } = await pool.query('UPDATE public."Matches" SET "Predicted_home_team_goals" = $2 , "Predicted_away_team_goals" = $3 WHERE "ID" = $1;',
        [matchID, homePredGoal, awayPredGoal]);
    return rows[0];
};

const deleteOldMatches = async (leagueID) => {
    const {
        rows
    } = await pool.query('DELETE FROM public."Matches" WHERE "Match_status" = \'Прошедший\' AND "Championship_ID" = $1 AND EXISTS (SELECT 1 FROM public."Matches" WHERE "Match_status" = \'Прогноз\' AND "Championship_ID" = $1);',
        [leagueID]);
    return rows[0];
};

const setLastStatus = async (leagueID) => {
    const {
        rows
    } = await pool.query('UPDATE public."Matches" SET "Match_status" = \'Прошедший\' WHERE "Championship_ID" = $1;', [leagueID]);
    return rows[0];
};

// Экспортируем методы для использования в контроллерах
module.exports = {
    getMatches,
    getMatchById,
    createMatchDate,
    getListMatches,
    updateDataMatch,
    deleteOldMatches,
    setLastStatus,
    updatePredWithNewXG
};
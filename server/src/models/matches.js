const pool = require('./index');

// Получение списка всех матчей
const getMatches = async () => {
    const {
        rows
    } = await pool.query('SELECT * FROM matches');
    return rows;
};

const getIDbyTeamIDAndLeague = async (id) => {
    const {
        rows
    } = await pool.query('SELECT id FROM leagues_teams WHERE id_team = $1', [id]);
    return rows[0].id;
}

// Получение информации о конкретном матче
const getMatchById = async (id) => {
    const {
        rows
    } = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
    return rows[0];
};

//Создание записи о матче
const createMatchDate = async (item, matchStatus) => {
    console.log(item)
    const {
        time,
        home_id,
        away_id,
        home_goals,
        away_goals,
        actual_home_goals,
        actual_away_goals
    } = item;

    const values = [
        time,
        home_id,
        away_id,
        home_goals,
        away_goals,
        actual_home_goals,
        actual_away_goals,
        matchStatus
    ];

    const formattedValues = values.map((value) => (value !== undefined ? value : null));
    const {
        rows
    } = await pool.query('INSERT INTO public."current_matches"("match_date", "id_league_team_home", "id_league_team_away", "pred_goals_home", "pred_goals_away", "actual_goals_home", "actual_goals_away", "match_type") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', formattedValues);
    return rows[0];
};

//Получение прогноза
const getListMatches = async (leagueId, status) => {
    const {
        rows
    } = await pool.query(
        'SELECT m."id", m."match_date", m."id_league_team_home", m."id_league_team_away", m."pred_goals_home", m."pred_goals_away", m."actual_goals_home", m."actual_goals_away" FROM public."current_matches" as m JOIN leagues_teams as lt ON m."id_league_team_home" = lt."id" WHERE m."match_type" = $2 and lt."id_league" = $1 ORDER BY m."match_date"', [leagueId, status]
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
    updatePredWithNewXG,
    getIDbyTeamIDAndLeague
};
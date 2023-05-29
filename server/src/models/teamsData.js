const pool = require('./index');

// Создание записи матча
const createTeamData = async (matchID, position, goalsScored, matchDate, teamID, matchRecency) => {
    const {
        rows
    } = await pool.query(
        'INSERT INTO public."Team_Data_for_1-15_Matches" ("Match_ID", "Position", "Goals_scored", "Match_date", "Team_ID", "Match_recency") VALUES ($1, $2, $3, $4, $5, $6)',
        [matchID, position, goalsScored, matchDate, teamID, matchRecency]
    );
    return rows[0];
};

// Обновление записи матча
const updateTeamData = async (matchID, teamID, shots, XG) => {
    const {
        rows
    } = await pool.query(
        'UPDATE public."Team_Data_for_1-15_Matches" SET "Shots_on_target" = $3, "Expected_Goals_XG" = $4 WHERE "Match_ID" = $1 and "Team_ID" = $2',
        [matchID, teamID, shots, XG]
    );
    return rows[0];
};

const getHomeNearData = async (teamID) => {
    const {
        rows
    } = await pool.query(
        'SELECT ROUND(AVG("Goals_scored")::numeric,4) as goalsScroredHN, ROUND(AVG("Shots_on_target")::numeric,4) as shotsOnTargetHN, ROUND(AVG("Expected_Goals_XG")::numeric,4) as expectedGoalsXGHN FROM public."Team_Data_for_1-15_Matches" WHERE "Team_ID" = $1 and "Match_recency" = \'near\' and "Position" = \'home\'',
        [teamID]
    );
    return rows[0];
};

const getHomeMiddleData = async (teamID) => {
    const {
        rows
    } = await pool.query(
        'SELECT ROUND(AVG("Goals_scored")::numeric,4) as goalsScroredHM, ROUND(AVG("Shots_on_target")::numeric,4) as shotsOnTargetHM, ROUND(AVG("Expected_Goals_XG")::numeric,4) as expectedGoalsXGHM FROM public."Team_Data_for_1-15_Matches" WHERE "Team_ID" = $1 and "Match_recency" = \'middle\' and "Position" = \'home\'',
        [teamID]
    );
    return rows[0];
};

const getHomeLongData = async (teamID) => {
    const {
        rows
    } = await pool.query(
        'SELECT ROUND(AVG("Goals_scored")::numeric,4) as goalsScroredHL, ROUND(AVG("Shots_on_target")::numeric,4) as shotsOnTargetHL, ROUND(AVG("Expected_Goals_XG")::numeric,4) as expectedGoalsXGHL FROM public."Team_Data_for_1-15_Matches" WHERE "Team_ID" = $1 and "Match_recency" = \'long\' and "Position" = \'home\'',
        [teamID]
    );
    return rows[0];
};

const getAwayNearData = async (teamID) => {
    const {
        rows
    } = await pool.query(
        'SELECT ROUND(AVG("Goals_scored")::numeric,4) as goalsScroredAN, ROUND(AVG("Shots_on_target")::numeric,4) as shotsOnTargetAN, ROUND(AVG("Expected_Goals_XG")::numeric,4) as expectedGoalsXGAN FROM public."Team_Data_for_1-15_Matches" WHERE "Team_ID" = $1 and "Match_recency" = \'near\' and "Position" = \'away\'',
        [teamID]
    );
    return rows[0];
};

const getAwayMiddleData = async (teamID) => {
    const {
        rows
    } = await pool.query(
        'SELECT ROUND(AVG("Goals_scored")::numeric,4) as goalsScroredAM, ROUND(AVG("Shots_on_target")::numeric,4) as shotsOnTargetAM, ROUND(AVG("Expected_Goals_XG")::numeric,4) as expectedGoalsXGAM FROM public."Team_Data_for_1-15_Matches" WHERE "Team_ID" = $1 and "Match_recency" = \'middle\' and "Position" = \'away\'',
        [teamID]
    );
    return rows[0];
};

const getAwayLongData = async (teamID) => {
    const {
        rows
    } = await pool.query(
        'SELECT ROUND(AVG("Goals_scored")::numeric,4) as goalsScroredAL, ROUND(AVG("Shots_on_target")::numeric,4) as shotsOnTargetAL, ROUND(AVG("Expected_Goals_XG")::numeric,4) as expectedGoalsXGAL FROM public."Team_Data_for_1-15_Matches" WHERE "Team_ID" = $1 and "Match_recency" = \'long\' and "Position" = \'away\'',
        [teamID]
    );
    return rows[0];
};

const updateMatchRecency = async (teamID, newStatus, oldStatus) => {
    const {
        rows
    } = await pool.query(
        'UPDATE public."Team_Data_for_1-15_Matches" SET "Match_recency" = $2 WHERE "ID" = (SELECT "ID" FROM public."Team_Data_for_1-15_Matches" WHERE "Team_ID" = $1 and "Match_recency" = $3 ORDER BY "Match_date" ASC LIMIT 1)', [teamID, newStatus, oldStatus]
    );
    return rows[0];
};

const deleteLastMatch = async (teamID) => {
    const {
        rows
    } = await pool.query(
        'DELETE FROM public."Team_Data_for_1-15_Matches" WHERE "ID" = (SELECT "ID" FROM public."Team_Data_for_1-15_Matches" WHERE "Team_ID" = $1 and "Match_recency" = \'long\' ORDER BY "Match_date" ASC LIMIT 1);', [teamID]
    );
    return rows[0];
};

// Экспортируем методы для использования в контроллерах
module.exports = {
    createTeamData,
    updateTeamData,
    getHomeNearData,
    getHomeMiddleData,
    getHomeLongData,
    getAwayNearData,
    getAwayMiddleData,
    getAwayLongData,
    updateMatchRecency,
    deleteLastMatch
};
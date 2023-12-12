const matchModel = require('../models/matches');

const getAllMatches = async (req, res) => {
    try {
        const matches = await matchModel.getMatches();
        res.status(200).json(matches);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

const createMatch = async (item) => {
    try {
        const item_todb = Object.fromEntries(
            Object.entries(item).filter(([_, value]) => value !== null)
        );
        item_todb.time = new Date(item_todb.time * 1000)
        await matchModel.createMatchDate(item_todb, 'Прогноз')
        //await matchModel.createMatchDate(id, matchDate, championID, homeTeamID, awayTeamID, predictedHomeTeamGoals, predictedAwayTeamGoals, matchStatus);
    } catch (err) {
        console.error(err.message);
    }
};

const getListMatches = async (leagueId, status) => {
    try {
        const predMatches = await matchModel.getListMatches(leagueId, status);
        return predMatches;
    } catch (err) {
        console.error(err.message);
    }
};

const updateDataMatch = async (matchID, homeGoal, awayGoal) => {
    try {
        await matchModel.updateDataMatch(matchID, homeGoal, awayGoal);
    } catch (err) {
        console.error(err.message);
    }
};

const updatePredWithNewXG = async (matchID, homePredGoal, awayPredGoal) => {
    try {
        await matchModel.updatePredWithNewXG(matchID, homePredGoal, awayPredGoal);
    } catch (err) {
        console.error(err.message);
    }
};

const deleteOldMatches = async (leagueID) => {
    try {
        await matchModel.deleteOldMatches(leagueID);
    } catch (err) {
        console.error(err.message);
    }
};

const setLastStatus = async (leagueID) => {
    try {
        await matchModel.setLastStatus(leagueID);
    } catch (err) {
        console.error(err.message);
    }
};

const getIDbyTeamIDAndLeague = async (teamId) => {
    try {
        const id = await matchModel.getIDbyTeamIDAndLeague(teamId)
        return id
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = {
    getAllMatches,
    createMatch,
    getListMatches,
    updateDataMatch,
    deleteOldMatches,
    setLastStatus,
    updatePredWithNewXG,
    getIDbyTeamIDAndLeague

};
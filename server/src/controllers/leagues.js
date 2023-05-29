const leagueModel = require('../models/leagues');

const createLeague = async (req, res) => {
    try {
        console.log(req.body);
        const {
            id,
            name,
            dateLastMatch,
            scorePred
        } = req.body;
        const league = await leagueModel.createLeague(id, name, dateLastMatch, scorePred);
        res.status(201).json(league);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getCountMatchesByLeague = async (leagueId) => {
    try {
        const countMatches = await leagueModel.getCountMatchesByLeague(leagueId);
        return countMatches;
    } catch (err) {
        console.error(err.message);
    }
};

const getCurrentStagePred = async (leagueId) => {
    try {
        const stagePred = await leagueModel.getCurrentStagePred(leagueId);
        return stagePred;
    } catch (err) {
        console.error(err.message);
    }
};

const getNameLeague = async (leagueId) => {
    try {
        const name = await leagueModel.getNameLeague(leagueId);
        return name;
    } catch (err) {
        console.error(err.message);
    }
}

const setTrueStagePred = async (id, status) => {
    try {
        await leagueModel.setTrueStagePred(id, status);
    } catch (err) {
        console.error(err.message);
    }
};

module.exports = {
    createLeague,
    getCountMatchesByLeague,
    getCurrentStagePred,
    setTrueStagePred,
    getNameLeague
    // другие методы CRUD
};
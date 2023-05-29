const teamModel = require('../models/teams');

const getAllTeams = async (leagueId) => {
    try {
        const teams = await teamModel.getAllTeamsByLeague(leagueId);
        return teams;
    } catch (err) {
        console.error(err.message);
    }
};

const getNameTeamByID = async (teamId) => {
    try {
        const name = await teamModel.getNameTeamByID(teamId);
        return name;
    } catch (err) {
        console.error(err.message);
    }
};

module.exports = {
    getAllTeams,
    getNameTeamByID
    // другие методы CRUD
};
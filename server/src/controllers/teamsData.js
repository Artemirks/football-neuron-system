const teamDataModel = require('../models/teamsData');


const createTeamData = async (matchID, position, goalsScored, matchDate, teamID, matchRecency) => {
    try {
        await teamDataModel.createTeamData(matchID, position, goalsScored, matchDate, teamID, matchRecency);
    } catch (err) {
        console.error(err.message);
    }
};

const updateTeamData = async (matchID, teamID, shots, XG) => {
    try {
        await teamDataModel.updateTeamData(matchID, teamID, shots, XG);
    } catch (err) {
        console.error(err.message);
    }
};

const getHomeNearData = async (teamID) => {
    try {
        const teamData = await teamDataModel.getHomeNearData(teamID);
        return teamData;
    } catch (err) {
        console.error(err.message);
    }
};

const getHomeMiddleData = async (teamID) => {
    try {
        const teamData = await teamDataModel.getHomeMiddleData(teamID);
        return teamData;
    } catch (err) {
        console.error(err.message);
    }
};

const getHomeLongData = async (teamID) => {
    try {
        const teamData = await teamDataModel.getHomeLongData(teamID);
        return teamData;
    } catch (err) {
        console.error(err.message);
    }
};

const getAwayNearData = async (teamID) => {
    try {
        const teamData = await teamDataModel.getAwayNearData(teamID);
        return teamData;
    } catch (err) {
        console.error(err.message);
    }
};

const getAwayMiddleData = async (teamID) => {
    try {
        const teamData = await teamDataModel.getAwayMiddleData(teamID);
        return teamData;
    } catch (err) {
        console.error(err.message);
    }
};

const getAwayLongData = async (teamID) => {
    try {
        const teamData = await teamDataModel.getAwayLongData(teamID);
        return teamData;
    } catch (err) {
        console.error(err.message);
    }
};

const updateMatchRecency = async (teamID, newStatus, oldStatus) => {
    try {
        await teamDataModel.updateMatchRecency(teamID, newStatus, oldStatus);
    } catch (err) {
        console.error(err.message);
    }
};

const deleteLastMatch = async (teamID) => {
    try {
        await teamDataModel.deleteLastMatch(teamID);
    } catch (err) {
        console.error(err.message);
    }
};

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
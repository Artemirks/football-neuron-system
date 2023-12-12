const apiFootball = require('../routes/api/api');
const teamDataController = require('../controllers/teamsData');
const teamController = require('../controllers/teams');
const neural = require('./neural');

//получение прогноза для команды
const getPredictionForTeams = async (leagueId) => {
    console.log(leagueId);
    const arrMatches = await apiFootball.getMatchesFromNext(leagueId);
    console.log(arrMatches);
    for (const item of arrMatches) {
        const teamIDs = Object.values(item.teams).map(team => team.id);
        const teamNames = await Promise.all(teamIDs.map(teamID => teamController.getNameTeamByID(teamID)));
        let currentTeam = 0;
        for (const team of Object.values(item.teams)) {
            const teamDataHN = await teamDataController.getHomeNearData(team.id);
            const teamDataHM = await teamDataController.getHomeMiddleData(team.id);
            const teamDataHL = await teamDataController.getHomeLongData(team.id);
            const teamDataAN = await teamDataController.getAwayNearData(team.id);
            const teamDataAM = await teamDataController.getAwayMiddleData(team.id);
            const teamDataAL = await teamDataController.getAwayLongData(team.id);
            const prediction = await neural.getPred({
                values: [+teamDataHN.goalsscroredhn, +teamDataAN.goalsscroredan, +teamDataHM.goalsscroredhm, +teamDataAM.goalsscroredam, +teamDataHL.goalsscroredhl, +teamDataAL.goalsscroredal, +teamDataHN.shotsontargethn, +teamDataHN.expectedgoalsxghn, +teamDataAN.shotsontargetan, +teamDataAN.expectedgoalsxgan, +teamDataHM.shotsontargethm, +teamDataHM.expectedgoalsxghm, +teamDataAM.shotsontargetam, +teamDataAM.expectedgoalsxgam, +teamDataHL.shotsontargethl, +teamDataHL.expectedgoalsxghl, +teamDataAL.shotsontargetal, +teamDataAL.expectedgoalsxgal],
                position: team.position
            });
            team.name = teamNames[currentTeam];
            team.prediction = prediction;
            currentTeam++;
        }
    }
    return arrMatches;
};

function poissonProbability(lambda, k) {
    // Функция для расчета вероятности по формуле Пуассона
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function factorial(n) {
    // Функция для расчета факториала числа
    if (n <= 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

function calculateProbability(homeGoalsAvg, awayGoalsAvg, result) {
    // Функция для расчета вероятности победы, ничьи или поражения
    let probability = 0;
    for (let homeGoals = 0; homeGoals <= 7; homeGoals++) {
        for (let awayGoals = 0; awayGoals <= 7; awayGoals++) {
            if (result === "home" && homeGoals > awayGoals) {
                probability += poissonProbability(homeGoalsAvg, homeGoals) * poissonProbability(awayGoalsAvg, awayGoals);
            } else if (result === "away" && homeGoals < awayGoals) {
                probability += poissonProbability(homeGoalsAvg, homeGoals) * poissonProbability(awayGoalsAvg, awayGoals);
            } else if (result === "draw" && homeGoals === awayGoals) {
                probability += poissonProbability(homeGoalsAvg, homeGoals) * poissonProbability(awayGoalsAvg, awayGoals);
            }
        }
    }
    return probability;
}

function calculateFactGoals(homeGoalsAvg, awayGoalsAvg) {
    // Функция для расчета вероятности обе забьют или нет
    let probability = 0;
    for (let homeGoals = 0; homeGoals <= 7; homeGoals++) {
        for (let awayGoals = 0; awayGoals <= 7; awayGoals++) {
            if (homeGoals > 0 && awayGoals > 0) {
                probability += poissonProbability(homeGoalsAvg, homeGoals) * poissonProbability(awayGoalsAvg, awayGoals);
            }
        }
    }
    return probability;
}

function calculateTotalGoals(homeGoalsAvg, awayGoalsAvg) {
    // Функция для расчета вероятности тотала голов
    let probability = 0;
    for (let homeGoals = 0; homeGoals <= 7; homeGoals++) {
        for (let awayGoals = 0; awayGoals <= 7; awayGoals++) {
            if (homeGoals + awayGoals > 2.5) {
                probability += poissonProbability(homeGoalsAvg, homeGoals) * poissonProbability(awayGoalsAvg, awayGoals);
            }
        }
    }
    return probability;
}

function calculateMostProbableScores(homeGoalsAvg, awayGoalsAvg, maxScores = 3) {
    const scores = [];

    for (let homeGoals = 0; homeGoals <= 7; homeGoals++) {
        for (let awayGoals = 0; awayGoals <= 7; awayGoals++) {
            const probability = poissonProbability(homeGoalsAvg, homeGoals) * poissonProbability(awayGoalsAvg, awayGoals);
            scores.push({
                homeGoals,
                awayGoals,
                probability
            });
        }
    }

    scores.sort((a, b) => b.probability - a.probability);

    return scores.slice(0, maxScores);
}

module.exports = {
    getPredictionForTeams,
    calculateProbability,
    calculateFactGoals,
    calculateTotalGoals,
    calculateMostProbableScores
};

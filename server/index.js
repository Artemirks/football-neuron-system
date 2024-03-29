const express = require('../node_modules/express');
const cors = require('../node_modules/cors');
const predinction = require('./src/neural/predictions');
const matchesController = require('./src/controllers/matches');
const teamController = require('./src/controllers/teams');
const leageController = require('./src/controllers/leagues');
const teamDataController = require('./src/controllers/teamsData');
const apiFootball = require('./src/routes/api/api');
const { getPred } = require('./src/neural/neural');


const app = express();

const corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));

app.get('/rfpl/last', async (req, res) => {
    try {
        const matches = await getPredMatchData(235, 'Прошедший');
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get(['/', '/rfpl/next'], async (req, res) => {
    try {
        /* if (await leageController.getCurrentStagePred(235)) {
            await getMatches(235);
        } */
        /* const predMatches = await getPred([[39, 10], [135, 10], [78, 9]]);
        console.log(predMatches)
        await predMatches.forEach(async (item) => {
            item.home_id = parseInt(await matchesController.getIDbyTeamIDAndLeague(item.home_id))
            item.away_id = parseInt(await matchesController.getIDbyTeamIDAndLeague(item.away_id))
            await matchesController.createMatch(item)
        }) */
        const matches = await getPredMatchData(235, 'Прогноз');
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/epl/last', async (req, res) => {
    try {
        const matches = await getPredMatchData(39, 'Прошедший');
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/epl/next', async (req, res) => {
    try {
        /* if (await leageController.getCurrentStagePred(39)) {
            await getMatches(39);
        } */
        const matches = await getPredMatchData(39, 'Прогноз');
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/bundes/last', async (req, res) => {
    try {
        const matches = await getPredMatchData(78, 'Прошедший');
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/bundes/next', async (req, res) => {
    try {
        /* if (await leageController.getCurrentStagePred(39)) {
            await getMatches(39);
        } */
        const matches = await getPredMatchData(78, 'Прогноз');
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/italy/last', async (req, res) => {
    try {
        const matches = await getPredMatchData(135, 'Прошедший');
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/italy/next', async (req, res) => {
    try {
        /* if (await leageController.getCurrentStagePred(39)) {
            await getMatches(39);
        } */
        const matches = await getPredMatchData(135, 'Прогноз');
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

async function getMatches(leagueID) {
    await leageController.setTrueStagePred(leagueID, false);
    const lastMatches = await matchesController.getListMatches(leagueID, 'Прогноз');
    let count = 0;
    for (const match in lastMatches) {
        count++;
        console.log(count);
        if (count == lastMatches.length / 2) {
            await new Promise(resolve => setTimeout(resolve, 60000)); // ожидание минуту
        }
        await updateMatchData(lastMatches[match], lastMatches.length);
        await teamDataController.updateMatchRecency(lastMatches[match].Home_team_ID, 'middle', 'near');
        await teamDataController.updateMatchRecency(lastMatches[match].Home_team_ID, 'long', 'middle');
        await teamDataController.deleteLastMatch(lastMatches[match].Home_team_ID);
        await teamDataController.updateMatchRecency(lastMatches[match].Away_team_ID, 'middle', 'near');
        await teamDataController.updateMatchRecency(lastMatches[match].Away_team_ID, 'long', 'middle');
        await teamDataController.deleteLastMatch(lastMatches[match].Away_team_ID);
    }
    await updatePred(leagueID);
    //await updatePredWithNewXG(leagueID);
    console.log('Готово');
}

async function updatePred(leagueId) {
    await matchesController.deleteOldMatches(leagueId);
    await matchesController.setLastStatus(leagueId);
    try {
        const result = await predinction.getPredictionForTeams(leagueId);

        await Promise.all(result.map(async (item) => {
            await matchesController.createMatch(
                item.fixture.id,
                item.fixture.dateTimeStap,
                leagueId,
                item.teams.home.id,
                item.teams.away.id,
                +item.teams.home.prediction.toFixed(3),
                +item.teams.away.prediction.toFixed(3),
                'Прогноз'
            );
            console.log(`${item.teams.home.name} - ${item.teams.away.name}:  ${item.teams.home.prediction.toFixed(3)}:${item.teams.away.prediction.toFixed(3)}`);
        }));
    } catch (error) {
        console.error(error);
        console.log('Ошибка при записи прогноза');
    }
}

async function updatePredWithNewXG(leagueId) {
    await predinction.getPredictionForTeams(leagueId).then(result => {
        result.forEach(item => {
            matchesController.updatePredWithNewXG(item.fixture.id, +item.teams.home.prediction.toFixed(3), +item.teams.away.prediction.toFixed(3));
            console.log(`${item.teams.home.name} - ${item.teams.away.name}:  ${item.teams.home.prediction.toFixed(3)}:${item.teams.away.prediction.toFixed(3)}`);
        });
    });
}
//updatePredWithNewXG(235);
//updatePredWithNewXG(39);
async function updateMatchData(match, countMatches) {
    await teamDataController.createTeamData(match.ID, 'home', match.Actual_home_team_goals, match.Match_date, match.Home_team_ID, 'near');
    await teamDataController.createTeamData(match.ID, 'away', match.Actual_away_team_goals, match.Match_date, match.Away_team_ID, 'near');
    await apiFootball.setShotsAndXG({
        fixtureID: match.ID
    }, match.Home_team_ID);
    await apiFootball.setShotsAndXG({
        fixtureID: match.ID
    }, match.Away_team_ID);
}

async function getPredMatchData(leagueId, status) {
    const result = await matchesController.getListMatches(leagueId, status);
    const matches = [];
    let goals = {};
    let countAlreadyScore = 0;
    const championshipName = await leageController.getNameLeague(leagueId);
    for (const index in result) {
        //goals = await checkDataMatch(result[index]);
        const homeName = await teamController.getNameTeamByID(result[index].id_league_team_home);
        const awayName = await teamController.getNameTeamByID(result[index].id_league_team_away);
        const percentHome = await predinction.calculateProbability(result[index].pred_goals_home, result[index].pred_goals_away, 'home');
        const percentAway = await predinction.calculateProbability(result[index].pred_goals_home, result[index].pred_goals_away, 'away');
        const percentDraw = await predinction.calculateProbability(result[index].pred_goals_home, result[index].pred_goals_away, 'draw');
        const bothGoal = await predinction.calculateFactGoals(result[index].pred_goals_home, result[index].pred_goals_away);
        const totalMoreGoal = await predinction.calculateTotalGoals(result[index].pred_goals_home, result[index].pred_goals_away);
        const mostProbableScores = await predinction.calculateMostProbableScores(result[index].pred_goals_home, result[index].pred_goals_away, 3);

        const date = new Date(result[index].match_date).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '');
        matches.push({
            homeID: result[index].id_league_team_home,
            awayID: result[index].id_league_team_away,
            homeName,
            awayName,
            championshipName,
            date,
            predictedHomeTeamGoals: result[index].pred_goals_home,
            predictedAwayTeamGoals: result[index].pred_goals_away,
            actualHomeGoal: result[index].actual_goals_home,
            actualAwayGoal: result[index].actual_goals_away,
            percentHome,
            percentAway,
            percentDraw,
            bothGoal,
            totalMoreGoal,
            mostProbableScores
        });
        /* if (goals.isAlreadyScore) {
            countAlreadyScore++;
        } */
    }
    /* if (status == 'Прогноз' && countAlreadyScore == result.length && !await leageController.getCurrentStagePred(leagueId)) {
        leageController.setTrueStagePred(leagueId, true);
    } */
    return matches;
}

async function checkDataMatch(matchData) {
    let goals = {};
    if (matchData.Match_date + 10400 < Date.now() / 1000 && matchData.Actual_home_team_goals == null) { //Получение актуального счета
        goals = await apiFootball.getGoalsFromMatch(matchData.ID);
        await matchesController.updateDataMatch(matchData.ID, goals.homeGoal, goals.awayGoal);
        goals.isAlreadyScore = false;
    } else if (matchData.Actual_home_team_goals != null) {
        goals.homeGoal = matchData.Actual_home_team_goals;
        goals.awayGoal = matchData.Actual_away_team_goals;
        goals.isAlreadyScore = true;
    } else {
        goals.homeGoal = null;
        goals.awayGoal = null;
        goals.isAlreadyScore = false;
    }
    return goals;
}
//apiFootball.dataFromNewTeamByLeague(39);

//Получение прогноза по лиге
/* predinction.getPredictionForTeams(235).then(result => {
    result.forEach(item => {
         matchesController.createMatch(item.fixture.id, item.fixture.dateTimeStap, 235, item.teams.home.id, item.teams.away.id, +item.teams.home.prediction.toFixed(3), +item.teams.away.prediction.toFixed(3), 'Прогноз');
        console.log(`${item.teams.home.name} - ${item.teams.away.name}:  ${item.teams.home.prediction.toFixed(3)}:${item.teams.away.prediction.toFixed(3)}`);
    });
}); */
app.listen(9000, () => {
    console.log('Server is running on port 9000');
});
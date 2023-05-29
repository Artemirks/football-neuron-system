const {
    response
} = require('../../../../node_modules/express');
const teamController = require('../../controllers/teams');
const teamDataController = require('../../controllers/teamsData');
const leagueControllet = require('../../controllers/leagues');
const currentSeason = '2022';
const apiKey = '55d8d0822bdb3026f52b479e85e3a447';

const dataFromNewTeamByLeague = async (leagueId) => {
    const teams = await teamController.getAllTeams(leagueId);
    let count = 0;
    let arrFictures;
    for (const i in teams) {
        count++;
        arrFictures = [];
        if (count > 22) {
            break;
        }
        if (count > 16) {
            const resopnse = await fetch(`https://v3.football.api-sports.io/fixtures?last=15&season=${currentSeason}&team=${teams[i].ID}`, {
                headers: {
                    'x-rapidapi-host': 'v3.football.api-sports.io',
                    'x-rapidapi-key': apiKey
                }
            });

            const data = await resopnse.json();
            let position;
            let goals;
            for (const matchIndex in data.response) {
                if (data.response[matchIndex].teams.home.id == teams[i].ID) {
                    position = 'home';
                } else {
                    position = 'away';
                }
                if (position == 'home') {
                    goals = data.response[matchIndex].goals.home;
                } else {
                    goals = data.response[matchIndex].goals.away;
                }
                arrFictures.push({
                    'fixtureID': data.response[matchIndex].fixture.id,
                    'position': position,
                    'goals': goals,
                    'matchDate': data.response[matchIndex].fixture.timestamp
                });
            }

            await Promise.all(arrFictures.map(async (fixture, index) => {
                let recency;
                if (index <= 4) {
                    recency = 'near';
                } else if (index >= 10) {
                    recency = 'long';
                } else {
                    recency = 'middle';
                }
                await setGoals(fixture.fixtureID, fixture.position, fixture.goals, fixture.matchDate, teams[i].ID, recency);
                if (index >= 9) {
                    await new Promise(resolve => setTimeout(resolve, 60000)); // ожидание минуту
                }
                await setShotsAndXG(fixture, teams[i].ID);
            }));

            console.log(`Данные команды ${teams[i].name} записаны`);
            await new Promise(resolve => setTimeout(resolve, 60000)); // ожидание минуту
        }
    }
};

const setGoals = async (fixtureID, position, goals, matchDate, teamsID, recency) => {
    console.log(fixtureID, position, goals, matchDate, teamsID, recency);
    await teamDataController.createTeamData(fixtureID, position, goals, matchDate, teamsID, recency);
};
const setShotsAndXG = async (item, teamID) => {
    const response = await fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${item.fixtureID}&team=${teamID}`, {
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': apiKey
        }
    });
    let data = await response.json();
    let currentXG;
    let currentShots;
    if (data.response[0] != undefined) {
        data = data.response[0].statistics;
        if (data.filter(obj => obj.type === 'expected_goals').length == 0 || data.filter(obj => obj.type === 'expected_goals')[0].value == null) {
            currentXG = item.goals;
        } else {
            currentXG = +(data.filter(obj => obj.type === 'expected_goals')[0].value);
        }
        currentShots = data[0].value;
    } else {
        currentXG = item.goals;
        currentShots = item.goals;
    }

    await teamDataController.updateTeamData(item.fixtureID, teamID, currentShots, currentXG);
};

const getMatchesFromNext = async (leagueId) => {
    const countMatches = await leagueControllet.getCountMatchesByLeague(leagueId);
    const resopnse = await fetch(`https://v3.football.api-sports.io/fixtures?next=${countMatches}&season=${currentSeason}&league=${leagueId}`, {
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': apiKey
        }
    });

    const data = await resopnse.json();
    const arrMatches = data.response.map((match) => ({
        fixture: {
            id: match.fixture.id,
            dateTimeStap: match.fixture.timestamp
        },
        teams: {
            home: {
                position: 'home',
                id: match.teams.home.id
            },
            away: {
                position: 'away',
                id: match.teams.away.id
            }
        }
    }));

    return arrMatches;
};

const getGoalsFromMatch = async (matchID) => {
    const resopnse = await fetch(`https://v3.football.api-sports.io/fixtures?id=${matchID}`, {
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': apiKey
        }
    });

    const data = await resopnse.json();
    const goals = {
        homeGoal: data.response[0].goals.home,
        awayGoal: data.response[0].goals.away
    };
    return goals;
};

module.exports = {
    dataFromNewTeamByLeague,
    getMatchesFromNext,
    getGoalsFromMatch,
    setShotsAndXG
};
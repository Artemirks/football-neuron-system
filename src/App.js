import './App.css';
import './components/TopMenu'
import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import TopMenu from './components/TopMenu';
import Footer from './components/Footer';

function App() {
  const [teams, setTeams] = useState([]);

  const WrapperInfo = styled(Paper)(({ theme }) => ({
    marginBottom: '4vw',
    padding: '0 0 10px 20px'
  }));

  const AllInfo = styled(Grid)(({ theme }) => ({
    justifyContent: 'space-around',
    [theme.breakpoints.down('lg')]: {
      justifyContent: 'space-between',
    },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.down(500)]: {
      padding: 0,
    }
  }));

  const TeamName = styled(Grid)(({ theme }) => ({
    width: '21vw',
    hyphens: 'auto',
    [theme.breakpoints.down(500)]: {
      fontSize: '14px',
    }
  }));

  const handleTeamsUpdate = (newTeams) => {
    setTeams(newTeams);
  };

  return (
    <div>
      <TopMenu onTeamsUpdate={handleTeamsUpdate}></TopMenu>
      <main className='css-19r6kue-MuiContainer-root'>
        <h1>Список прогнозов</h1>
        {teams && teams.length > 0 && (
          <h3>{teams[0].championshipName}</h3>
        )}
        {teams.map(team => {
          let koefMatch;
          let percentPred;
          if (team.actualHomeGoal != null) {
            if (
              (Math.sign(+team.predictedHomeTeamGoals - +team.predictedAwayTeamGoals) ===
                Math.sign(+team.actualHomeGoal - +team.actualAwayGoal) && Math.abs(+team.predictedHomeTeamGoals - +team.predictedAwayTeamGoals) > 0.1) ||
              (+team.actualHomeGoal - +team.actualAwayGoal === 0 &&
                Math.abs(+team.predictedHomeTeamGoals - +team.predictedAwayTeamGoals) < 0.3)
            ) {
              koefMatch = 1.15;
            } else {
              koefMatch = 0.65;
            }

            percentPred =
              (1 -
                (Math.abs(+team.actualHomeGoal - +team.predictedHomeTeamGoals) +
                  Math.abs(+team.actualAwayGoal - +team.predictedAwayTeamGoals)) /
                (+team.actualHomeGoal +
                  +team.predictedHomeTeamGoals +
                  +team.actualAwayGoal +
                  +team.predictedAwayTeamGoals)) *
              100;
            if (koefMatch === 1.15) {
              if (percentPred > 90) {
                koefMatch = 1.05;
              } else if (percentPred > 70) {
                koefMatch = 1.1;
              } else if (percentPred <= 55) {
                koefMatch = 1.25;
              }
            } else {
              if (percentPred > 70) {
                koefMatch = 0.75;
              }
            }
            percentPred *= koefMatch;
          }
          const dateTimeString = team.date;
          const regex = /(\d{2}-\d{2}-\d{4}) (\d{2}:\d{2})/;
          const match = dateTimeString.match(regex);

          const date = match[1];
          const time = match[2];

          return (
            <div>
              <Grid container alignItems="center" justifyContent="center" mb={1}>
                {date}
              </Grid>
              <WrapperInfo>
                <AllInfo container alignItems="center" mb={4} p={2}>
                  <div className="blockTime">
                    <Grid item>
                      <p>{time}</p>
                    </Grid>
                  </div>
                  <div className="teamInfo">
                    <div className="blockHome">
                      <TeamName item textAlign="right">
                        {team.homeName}
                      </TeamName>
                      <Grid item>
                        <img src={require(`./assets/${team.homeID}.png`)} alt="Home Team Logo" />
                      </Grid>
                    </div>
                    <div className="matchInfoWrapper">
                      <div className="matchInfo">
                        <div className="scoreLeft">
                          <Grid item>{team.predictedHomeTeamGoals.toFixed(2)}</Grid>
                        </div>
                        <div className="scoreRight">
                          <Grid item>{team.predictedAwayTeamGoals.toFixed(2)}</Grid>
                        </div>
                      </div>
                    </div>
                    <div className="blockAway">
                      <Grid item>
                        <img src={require(`./assets/${team.awayID}.png`)} alt="Away Team Logo" />
                      </Grid>
                      <TeamName item textAlign="left">
                        {team.awayName}
                      </TeamName>
                    </div>
                  </div>
                  <div className="actualData">
                    {team.actualHomeGoal != null && (
                      <div>
                        <span>Реальный счет и процент правильности прогноза</span>
                        <div>
                          <p>{team.actualHomeGoal}:{team.actualAwayGoal}</p>
                        </div>
                        <div>
                          <p>{percentPred.toFixed(0)}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                </AllInfo>
                <div>
                  <p>Вероятность победы хозяев - {(team.percentHome * 100).toFixed(0)}%</p>
                  <p>Вероятность ничьей - {(+(team.percentHome * 100).toFixed(0) + +(team.percentDraw * 100).toFixed(0) + +(team.percentAway * 100).toFixed(0) === 100) ? (team.percentDraw * 100).toFixed(0) : +(team.percentDraw * 100).toFixed(0) + 1}%</p>
                  <p>Вероятность победы гостей - {(team.percentAway * 100).toFixed(0)}%</p>
                </div>
              </WrapperInfo>
            </div>
          );
        })}
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;

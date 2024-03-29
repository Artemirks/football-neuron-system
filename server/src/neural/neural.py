import pandas as pd
from tensorflow.keras.models import load_model
import joblib
import http.client
import json
import re
import sys

def create_samples(data, match_data): #получение данных для прогнозирование
    x = []
    for _, row in data.iterrows():
        new_line = []
        team_data = match_data[(match_data['team_id'] == row['team_id']) & (match_data['time'] < row['time'])][-10::]
        home_data = team_data[team_data['position'] == 'home']
        away_data = team_data[team_data['position'] == 'away']
        points_last = match_data[(match_data['team_id'] == row['team_id']) & (match_data['time'] < row['time'])][-5::]['points'].sum()

        new_line.extend([row['team_id'], row['name'], row['time'], row['actual_goals'], home_data['goals'].mean(), away_data['goals'].mean(), home_data['shots'].mean(), away_data['shots'].mean(), home_data['xg'].mean(), away_data['xg'].mean(), points_last])
        x.extend([new_line]) 

    return x

def fetch_fixture_data(inputData, headers): #получние списка матчей
    json_data = []

    for league in inputData:
        conn.request("GET", f"/fixtures?next={league[1]}&league={league[0]}", headers=headers)
        res = conn.getresponse()
        data = res.read()
        league_data = json.loads(data)
        league_data = league_data['response']
        json_data += league_data

    return json_data

def calculate_diff_elo(x_home, x_away): #расчет разницы рейтинга эло
    x_home['diff_elo'] = x_home['elo'] - x_away['elo']
    x_away['diff_elo'] = x_away['elo'] - x_home['elo']

def preprocess_elo_data(elo_data, prev_elo_data):
    elo_data.set_index('id', inplace=True)
    elo_data['prev_elos'] = elo_data.apply(lambda row: prev_elo_data.loc[row.name]['prev_elos'] + row['prev_elos'] if row.name in prev_elo_data.index else row['prev_elos'], axis=1)
    elo_data.reset_index(inplace=True)

def process_row(row, all_elo): #получение рейтинга эло команды
    return int(all_elo[all_elo['id'] == row['team_id']]['elo_rating'])

def add_column_elo(frame, all_elo):
    frame['elo'] = frame.apply(lambda row: process_row(row, all_elo), axis=1)

match_data = pd.read_csv('server\\src\\neural\\match_data.csv',index_col='id')
match_data['points'] = match_data.apply(lambda row: 3 if row['goals'] > match_data[(match_data['fixtureID'] == row['fixtureID']) & (match_data['team_id'] != row['team_id'])]['goals'].max() else (0 if row['goals'] < match_data[(match_data['fixtureID'] == row['fixtureID']) & (match_data['team_id'] != row['team_id'])]['goals'].max() else 1), axis=1)

#inputData = json.loads(sys.stdin.read())
inputData = [[39, 10], [135, 10], [78, 9]]
conn = http.client.HTTPSConnection("v3.football.api-sports.io")

headers = {
    'x-rapidapi-host': "v3.football.api-sports.io",
    'x-rapidapi-key': "55d8d0822bdb3026f52b479e85e3a447"
}

json_data = fetch_fixture_data(inputData, headers)

home_teams = []
away_teams = []

for fixture in json_data:
    home_teams.append([fixture['teams']['home']['id'], fixture['fixture']['timestamp'], fixture['teams']['home']['name'], fixture['goals']['home']])
    away_teams.append([fixture['teams']['away']['id'], fixture['fixture']['timestamp'], fixture['teams']['away']['name'], fixture['goals']['away']])

home_teams = pd.DataFrame(home_teams, columns=['team_id', 'time', 'name', 'actual_goals'])
away_teams = pd.DataFrame(away_teams, columns=['team_id', 'time', 'name', 'actual_goals'])

x_home = create_samples(home_teams, match_data)
x_home = pd.DataFrame(x_home, columns=['team_id', 'name', 'time', 'actual_goals', 'mean_goals_home', 'mean_goals_away', 'shots_home', 'shots_away', 'xg_home', 'xg_away', 'points'])
x_away = create_samples(away_teams, match_data)
x_away = pd.DataFrame(x_away, columns=['team_id', 'name', 'time', 'actual_goals', 'mean_goals_home', 'mean_goals_away', 'shots_home', 'shots_away', 'xg_home', 'xg_away', 'points'])

elo_england_22 = pd.read_csv('server\\src\\neural\\elo/csv/England/2022/ratingElo2022_2023PL.csv')
elo_england_23 = pd.read_csv('server\\src\\neural\\elo/csv/England/2023/ratingElo2023_2024PL.csv')
elo_russian_22 = pd.read_csv('server\\src\\neural\\elo/csv/Russia/2022/ratingElo2022_2023RFPL.csv')
elo_russian_23 = pd.read_csv('server\\src\\neural\\elo/csv/Russia/2023/ratingElo2023_2024RFPL.csv')
elo_bundes_22 = pd.read_csv('server\\src\\neural\\elo/csv/Germany/2022/ratingElo2022_2023Bundes.csv')
elo_bundes_23 = pd.read_csv('server\\src\\neural\\elo/csv/Germany/2023/ratingElo2023_2024Bundes.csv')
elo_italy_22 = pd.read_csv('server\\src\\neural\\elo/csv/Italy/2022/ratingElo2022_2023Italy.csv')
elo_italy_23 = pd.read_csv('server\\src\\neural\\elo/csv/Italy/2023/ratingElo2023_2024Italy.csv')

preprocess_elo_data(elo_england_22, elo_england_23)
preprocess_elo_data(elo_russian_22, elo_russian_23)
preprocess_elo_data(elo_bundes_22, elo_bundes_23)
preprocess_elo_data(elo_italy_22, elo_italy_23)

all_elo = pd.concat([elo_england_23, elo_russian_23, elo_bundes_23, elo_italy_23])
all_elo.reset_index(inplace=True)

samples = [x_home, x_away]
for item in samples:
    add_column_elo(item, all_elo)

calculate_diff_elo(x_home, x_away)

x_home_predict = x_home.drop(['time', 'elo', 'name', 'actual_goals'], axis=1)
x_away_predict = x_away.drop(['time', 'elo', 'name', 'actual_goals'], axis=1)
scaler_home = joblib.load("server\\src\\neural\\scaler_home_new.save")
scaler_away = joblib.load("server\\src\\neural\\scaler_home_new.save")

x_home_predict = scaler_home.transform(x_home_predict)
x_away_predict = scaler_away.transform(x_away_predict)

loaded_model_home_neuron = load_model('server\\src\\neural\\home_model_new.h5')
loaded_model_away_neuron = load_model('server\\src\\neural\\away_model_new.h5')

neuron_home_value = loaded_model_home_neuron.predict(x_home_predict, verbose=0)
neuron_away_value = loaded_model_away_neuron.predict(x_away_predict, verbose=0)

data = []

for index, row in x_home.iterrows():
    home_goals = round(float(neuron_home_value[index][0]), 3)
    away_goals = round(float(neuron_away_value[index][0]), 3)
    data.append({
        "home_id": row['team_id'],
        "away_id": x_away.iloc[index]['team_id'],
        'home_goals': home_goals,
        'away_goals': away_goals,
        'actual_home_goals': home_teams.iloc[index]['actual_goals'],
        'actual_away_goals': away_teams.iloc[index]['actual_goals'],
        "time": home_teams.iloc[index]['time']
    })
print(json.dumps(data, default=str))

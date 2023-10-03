import pandas as pd


def calculate_team_elo(file_paths, league_ratings, kubok=None, save_elo=False, previus_data=None):
    def get_gap_koef(games, elo_rating):
        if games < 30 or elo_rating < 1900:
            return 40
        elif elo_rating > 2200:
            return 10
        return 20

    # Определение функции 'Elo_rating' для расчета изменений рейтинга команд
    def Elo_rating(row):
        # k = league_info.loc[row.league].league_koef #коэфициент лиги
        G = 1  # коэфициент голов
        real_home_result = real_away_result = 0.5
        home_team_rating = team_info.loc[row.home_team_id].elo_rating + 100
        away_team_rating = team_info.loc[row.away_team_id].elo_rating

        home_gap_koef = get_gap_koef(team_info.loc[row.home_team_id].games, team_info.loc[row.home_team_id].elo_rating)
        away_gap_koef = get_gap_koef(team_info.loc[row.away_team_id].games, team_info.loc[row.away_team_id].elo_rating)

        if abs(row.home_goals - row.away_goals) == 2:
            G = 1.5
        elif abs(row.home_goals - row.away_goals) > 2:
            G = (11 + abs(row.home_goals - row.away_goals)) / 8

        # Ожидаемый результат
        expected_home_result = 1 / (10 ** -((home_team_rating - away_team_rating) / 400) + 1)
        expected_away_result = 1 / (10 ** -((away_team_rating - home_team_rating) / 400) + 1)

        # Результат матча
        if (row.home_goals > row.away_goals):
            real_home_result = 1
            real_away_result = 0
        elif (row.home_goals < row.away_goals):
            real_home_result = 0
            real_away_result = 1

        change_home_rating = home_gap_koef * G * (real_home_result - expected_home_result)
        change_away_rating = away_gap_koef * G * (real_away_result - expected_away_result)

        change_home_rating = round(change_home_rating, 2)
        change_away_rating = round(change_away_rating, 2)
        return change_home_rating, change_away_rating

    league_info = pd.DataFrame()
    dfs = [pd.read_csv(file_path) for file_path in file_paths]
    # Добавление столбца 'league' для каждого DataFrame
    for i, df in enumerate(dfs):
        df['league'] = league_ratings[i][0]
        league_info.loc[league_ratings[i][0], 'init_rating'] = league_ratings[i][1]
    # Объединение лиг в фрейм
    all_df = pd.concat(dfs, ignore_index=True)

    team_info = pd.DataFrame(index=all_df['home_team_id'].unique())
    team_info['team_name'] = all_df.groupby('home_team_id')['home_team_name'].first()
    team_info['league'] = all_df.groupby('home_team_id')['league'].first()

    df_kubok_list = []

    if kubok:  # если есть данные кубка
        for kubok_data in kubok:
            df_kubok = pd.read_csv(kubok_data[0])
            df_kubok = df_kubok[
                df_kubok['home_team_id'].isin(team_info.index.to_list()) & df_kubok['away_team_id'].isin(
                    team_info.index.to_list())]
            df_kubok['league'] = kubok_data[1][0]
            league_info.loc[kubok_data[1][0], 'init_rating'] = kubok_data[1][1]
            df_kubok_list.append(df_kubok)  # Добавляем текущий DataFrame в список

    # Объединение всех данных в один DataFrame
    all_df = pd.concat([all_df] + df_kubok_list, ignore_index=True)
    all_df['home_goals'].fillna(1, inplace=True)
    all_df['away_goals'].fillna(1, inplace=True)

    # Сортировка данных по времени
    all_df.sort_values('timestamp', inplace=True)
    all_df.reset_index(drop=True, inplace=True)

    if previus_data:
        old_elo = pd.read_csv(previus_data, index_col=0)
        team_info['elo_rating'] = team_info.index.map(
            lambda x: old_elo.loc[x, 'elo_rating'] if x in old_elo.index else league_info.loc[
                team_info.loc[x, 'league'], 'init_rating'])
        team_info['games'] = team_info.index.map(lambda x: old_elo.loc[x, 'games'] if x in old_elo.index else 0)
    else:
        team_info['elo_rating'] = team_info['league'].map(league_info['init_rating'])
        team_info['games'] = 0

    if (save_elo):
        team_info['prev_elos'] = [{} for _ in range(len(team_info))]
    for _, row in all_df.iterrows():
        change_home, change_away = Elo_rating(row)
        if (save_elo):
            team_info.loc[team_info.index == row.home_team_id, 'prev_elos'].iloc[0][row.timestamp] = team_info.loc[
                row.home_team_id].elo_rating
            team_info.loc[team_info.index == row.away_team_id, 'prev_elos'].iloc[0][row.timestamp] = team_info.loc[
                row.away_team_id].elo_rating

        team_info.loc[team_info.index == row.home_team_id, 'elo_rating'] += change_home
        team_info.loc[team_info.index == row.home_team_id, 'games'] += 1

        team_info.loc[team_info.index == row.away_team_id, 'elo_rating'] += change_away
        team_info.loc[team_info.index == row.away_team_id, 'games'] += 1

    team_info.sort_values('elo_rating', ascending=False, inplace=True)
    return team_info
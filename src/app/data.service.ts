import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Ranking } from './ranking';
import { Competition } from './competition';
import { DatasTeam } from './datas-team';
import { Team } from './team';
import { Match } from './match';
import { Scores } from './scores';
import { VariablesGlobales } from './global-variables';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  requestOptions = {
    headers: new HttpHeaders({ 'X-Auth-Token': this.Global.token }),
  };

  BaseUrl = 'https://api.football-data.org/v4/';

  area: Array<{ name: string; flag: string }> = [];
  flag: Array<string> = [];

  //imports data from json files with flags from each country
  constructor(
    private httpClient: HttpClient,
    private Global: VariablesGlobales
  ) {
    fetch('../assets/area.json')
      .then((r) => r.json())
      .then((data) => {
        data.forEach((elem: any) => {
          elem.ids.forEach(
            (id: number) =>
              (this.area[id] = { name: elem.name, flag: elem.flag })
          );
        });
      });
    fetch('../assets/flag.json')
      .then((r) => r.json())
      .then((data) => (this.flag = data));
  }

  //lists the requests to the API

  getMatchesFromDate(dateFrom: string, dateTo: string): Observable<Match[]> {
    return this.httpClient
      .get(
        this.BaseUrl + 'matches?dateFrom=' + dateFrom + '&dateTo=' + dateTo,
        this.requestOptions
      )
      .pipe(map((data: any) => this.obj2ArrayMatchs(data)));
  }

  getMatchesFrom(code: string): Observable<Match[]> {
    return this.httpClient
      .get(
        this.BaseUrl + 'competitions/' + code + '/matches',
        this.requestOptions
      )
      .pipe(map((data: any) => this.obj2ArrayMatchs(data)));
  }

  getAllCompetitions(): Observable<Competition[]> {
    return this.httpClient
      .get(this.BaseUrl + 'competitions', this.requestOptions)
      .pipe(map((data: any) => this.obj2ArrayCompetitions(data)));
  }

  getCompetitionFrom(code: string): Observable<Competition> {
    return this.httpClient
      .get(
        this.BaseUrl + 'competitions/' + code + '/standings',
        this.requestOptions
      )
      .pipe(map((data: any) => this.obj2Competition(data)));
  }

  getAllTeams(): Observable<Team[]> {
    return this.httpClient
      .get(this.BaseUrl + 'teams?limit=500', this.requestOptions)
      .pipe(map((data: any) => this.obj2ArrayTeams(data)));
  }

  getTeamFrom(code: string): Observable<Team> {
    return this.httpClient
      .get(this.BaseUrl + 'teams/' + code, this.requestOptions)
      .pipe(map((data: any) => this.obj2Team(data)));
  }

  getMatchesFromEquipe(code: string): Observable<Match[]> {
    return this.httpClient
      .get(this.BaseUrl + 'teams/' + code + '/matches', this.requestOptions)
      .pipe(map((data: any) => this.obj2ArrayMatchs(data)));
  }

  getContains(
    search: string,
    values: Array<Competition | Team>
  ): Array<Competition | Team> {
    return values.filter(
      (el: Competition | Team) =>
        (el &&
          el.name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >=
            0) ||
        (el.class == 'Competition'
          ? el.areaName
              .toLocaleLowerCase()
              .indexOf(search.toLocaleLowerCase()) >= 0
          : false)
    );
  }

  protected obj2ArrayTeams(obj: any): Team[] {
    return obj['teams'].map((el: any) => this.setTeam(el));
  }

  protected obj2ArrayCompetitions(obj: any): Competition[] {
    return obj['competitions'].map((el: any) =>
      this.setCompetition(el, el.area)
    );
  }

  protected obj2Competition(obj: any): Competition {
    return this.setCompetition(
      obj.competition,
      obj.area,
      obj.season,
      obj.standings.map((el: any) => this.setRanking(el, obj.area))
    );
  }

  protected obj2Team(obj: any): Team {
    return this.setTeam(obj, obj.area);
  }

  protected obj2ArrayMatchs(obj: any): Match[] {
    return obj['matches'].map((el: any) => this.setMatch(el));
  }

  protected setTeam(
    team: any,
    area?: any,
    scores?: Scores,
    datas?: DatasTeam
  ): Team {
    let Team: Team = {
      class: 'Team',
      code: team.id,
      name: team.name,
      shortName: team.shortName,
      logo: team.crest,
      areaName: this.area[team.id]
        ? this.area[team.id].name
        : area && area.name
        ? area.name
        : '',
      areaFlag: this.area[team.id]
        ? this.area[team.id].flag
        : area && area.flag
        ? area.flag
        : '',
      competitions: team.runningCompetitions?.map((competition: any) =>
        this.setCompetition(competition)
      ),
      score: scores,
      datas: datas,
    };
    return Team;
  }

  protected setCompetition(
    competition: any,
    area?: any,
    season?: any,
    rankings?: Ranking[]
  ): Competition {
    return {
      class: 'Competition',
      id: competition.id,
      name: competition.name,
      code: competition.code,
      logo: competition.emblem?.endsWith('SAM.svg')
        ? area?.flag
        : competition.emblem?.endsWith('EUR.svg')
        ? 'https://www.flashscore.com/res/image/data/2i69RRV1-zJXmWPjA.png'
        : competition.emblem,
      type: competition.type,
      areaName: area?.name ?? 'World',
      areaFlag: area?.flag?.endsWith('CLI.svg')
        ? 'https://www.flashscore.com/res/_fs/build/world.b7d16db.png'
        : area?.flag ??
          'https://www.flashscore.com/res/_fs/build/world.b7d16db.png',
      startDate: season ? season.startDate : undefined,
      endDate: season ? season.endDate : undefined,
      currMatchDay: season
        ? competition.type == 'LEAGUE'
          ? season.currentMatchday
          : undefined
        : undefined,
      nbTeams: rankings ? rankings![0].data!.length : undefined,
      rankings: rankings,
    };
  }

  protected setRanking(el: any, area: any): Ranking {
    return {
      class: 'Team',
      type: el.type,
      group: el.group,
      stage: el.stage,
      data: el.table.map((el: any) =>
        this.setTeam(el.team, area, undefined, {
          position: el.position,
          playedGames: el.playedGames,
          form: typeof el.form === 'string' ? el.form.split(',') : [''],
          won: el.won,
          draw: el.draw,
          lost: el.lost,
          points: el.points,
          goalsFor: el.goalsFor,
          goalsAgainst: el.goalsAgainst,
          goalDifference: el.goalDifference,
        })
      ),
    };
  }

  protected setMatch(el: any): Match {
    return {
      id: el.id,
      competition: this.setCompetition(el.competition, el.area),
      duration: el.score.duration,
      winner: el.score.winner,
      homeTeam: this.setTeam(el.homeTeam, el.area, {
        halfTime: el.score.halfTime.home ?? 0,
        regularTime:
          el.score.fullTime.home -
          (el.score.extraTime ? el.score.extraTime.home : 0) -
          (el.score.penalties ? el.score.penalties.home : 0),
        fullTime:
          el.score.fullTime.home -
          (el.score.penalties ? el.score.penalties.home : 0),
        penalties: el.score.penalties ? el.score.penalties.home : 0,
      }),
      awayTeam: this.setTeam(el.awayTeam, el.area, {
        halfTime: el.score.halfTime.away ?? 0,
        regularTime:
          el.score.fullTime.away -
          (el.score.extraTime ? el.score.extraTime.away : 0) -
          (el.score.penalties ? el.score.penalties.away : 0),
        fullTime:
          el.score.fullTime.away -
          (el.score.penalties ? el.score.penalties.away : 0),
        penalties: el.score.penalties ? el.score.penalties.away : 0,
      }),
      matchday: ['ROUND_1', 'LAST_64'].includes(el.stage)
        ? 1
        : ['ROUND_2', 'LAST_32'].includes(el.stage)
        ? 2
        : ['ROUND_3', 'LAST_16'].includes(el.stage)
        ? 3
        : ['ROUND_4', 'QUALIFICATION_ROUND_1', 'QUARTER_FINALS'].includes(
            el.stage
          )
        ? 4
        : ['ROUND_5', 'QUALIFICATION_ROUND_2', 'SEMI_FINALS'].includes(el.stage)
        ? 5
        : [
            'ROUND_6',
            'QUALIFICATION_ROUND_3',
            'BRONZE',
            'THIRD_PLACE',
            'FINAL',
          ].includes(el.stage)
        ? 6
        : ['PLAYOFF_ROUND'].includes(el.stage)
        ? 7
        : el.matchday,
      date: el.utcDate,
      group: el.group,
      stage: [
        'ROUND_1',
        'ROUND_2',
        'ROUND_3',
        'ROUND_4',
        'ROUND_5',
        'ROUND_6',
      ].includes(el.stage)
        ? 'GROUP_STAGE'
        : [
            'QUALIFICATION_ROUND_1',
            'QUALIFICATION_ROUND_2',
            'QUALIFICATION_ROUND_3',
            'PLAYOFF_ROUND',
          ].includes(el.stage)
        ? 'QUALIFICATION'
        : [
            'FINAL',
            'BRONZE',
            'THIRD_PLACE',
            'SEMI_FINALS',
            'QUARTER_FINALS',
            'LAST_16',
            'LAST_32',
            'LAST_64',
          ].includes(el.stage)
        ? 'FINAL_PHASE'
        : el.stage,
      status: el.status,
    };
  }
}

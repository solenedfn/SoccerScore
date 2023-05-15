import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { Bracket } from '../bracket';
import { Ranking } from '../ranking';
import { Competition } from '../competition';
import { DataService } from '../data.service';
import { Match } from '../match';
import { VariablesGlobales } from '../global-variables';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {

  competition!: Competition
  currRankings: Array<Ranking> = []

  matches: Array<Match> = []
  currMatches: Array<Match> = []

  stage: Array<string> = []
  currStage: string = ''

  matchday: Array<number> = []
  currMatchDay: number = 1;

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private router: Router, private Global: VariablesGlobales) { }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      map((params: ParamMap) => params.get('id') ?? ''),
      switchMap((id: string) => forkJoin({
        competition: this.dataService.getCompetitionFrom(id),
        matches: this.dataService.getMatchesFrom(id)
      }))
    ).subscribe({
      next: ({ competition, matches }) => {
        this.competition = competition
        this.matches = matches
        this.stage = this.setStages(this.matches)
        this.matchday = this.setMatchdays(this.matches)
        this.addBracket()
        this.currMatchDay = this.competition.currMatchDay ?? this.matchday[this.matchday.length - 1]
        this.currStage = this.stage[this.stage.length - 1]
        this.currMatches = this.matches.filter(match => match.stage == this.currStage && match.matchday == this.currMatchDay)
        this.currRankings = this.competition.rankings!.filter(rankings => rankings.stage == this.currStage || rankings.stage == 'SCORERS')
      },
      error: () => this.router.navigate(['/home'])
    })
    this.Global.intervalID = setInterval(() => this.dataService.getMatchesFrom(this.competition.code).subscribe(matches => {
      this.matches = matches
      this.currMatches = this.matches.filter(match => match.stage == this.currStage && match.matchday == this.currMatchDay)
    }), 30000)
  }



  addBracket() {
    this.stage.forEach((stage: string) => {
      let brackets: Array<Ranking> = []
      if (stage != 'GROUP_STAGE' && stage != 'REGULAR_SEASON') {
        this.matchday.forEach((matchday: number) => {
          let matches = this.matches.filter((match: Match) => match.stage == stage && match.matchday == matchday)
          if (this.competition.code == 'WC' && matchday == 6) {
            matches.shift()
          }
          let bracket: Array<Bracket> = []
          matches.forEach(match => {
            let rencontre = bracket.find((rencontre: Bracket) => rencontre.team1?.code == match.awayTeam.code && rencontre.team2?.code == match.homeTeam.code)
            if (rencontre) {
              bracket.splice(bracket.indexOf(rencontre), 1)
              rencontre.scores?.push([match.awayTeam.score!, match.homeTeam.score!])
              rencontre.duration?.push(match.duration)
              rencontre.status?.push(match.status)
              if (match.awayTeam.score!.fullTime + rencontre.scores![0][0].fullTime > match.homeTeam.score!.fullTime + rencontre.scores![0][1].fullTime) {
                rencontre.winner = rencontre.team1
              } else if (match.awayTeam.score!.fullTime + rencontre.scores![0][0].fullTime < match.homeTeam.score!.fullTime + rencontre.scores![0][1].fullTime) {
                rencontre.winner = rencontre.team2
              } else if (match.awayTeam.score!.penalties > match.homeTeam.score!.penalties) {
                rencontre.winner = rencontre.team1
              } else if (match.awayTeam.score!.penalties < match.homeTeam.score!.penalties) {
                rencontre.winner = rencontre.team2
              }
              bracket.push(rencontre)
            } else {
              bracket.push({
                team1: match.homeTeam,
                team2: match.awayTeam,
                scores: [[match.homeTeam.score!, match.awayTeam.score!]],
                duration: [match.duration],
                status: [match.status],
                winner: (match.homeTeam.score!.fullTime > match.awayTeam.score!.fullTime) ? match.homeTeam :
                  (match.homeTeam.score!.fullTime < match.awayTeam.score!.fullTime) ? match.awayTeam :
                    (match.homeTeam.score!.penalties > match.awayTeam.score!.penalties) ? match.homeTeam :
                      (match.homeTeam.score!.penalties < match.awayTeam.score!.penalties) ? match.awayTeam :
                        undefined
              })
            }
          })
          if (bracket.length > 0) {
            brackets.push({ class: 'Bracket', type: matchday.toString(), group: '', stage: stage, data: bracket })
          }
        })
        if (brackets.length > 1) {
          this.sortBracket(brackets)
        }
        this.competition.rankings?.push(...brackets)
      }
    })
  }

  sortBracket(b_: Array<Ranking>, last?: Ranking) {
    if (last) {
      let newb: Array<Bracket> = [];
      (last?.data as Array<Bracket>).forEach((c: Bracket) => {
        let e = (b_[b_.length - 1].data as Array<Bracket>).filter((b: Bracket) => b.winner?.code == c.team1?.code || b.winner?.code == c.team2?.code)
        if (e.length == 0) {
          e.push({ team1: c.team1, scores: [[]], duration: ['REGULAR'], status: ['FINISHED'], winner: c.team1 })
          e.push({ team1: c.team2!, scores: [[]], duration: ['REGULAR'], status: ['FINISHED'], winner: c.team2 })
        } else if (e.length == 1) {
          if (e[0].winner?.code == c.team1?.code) {
            e.push({ team1: c.team2!, scores: [[]], duration: ['REGULAR'], status: ['FINISHED'], winner: c.team2 })
          } else {
            e.push({ team1: c.team1, scores: [[]], duration: ['REGULAR'], status: ['FINISHED'], winner: c.team1 })
          }
        }
        e.sort((a: Bracket) => {
          if (a.winner?.code == c.team1?.code) {
            return -1;
          } else {
            return 1;
          }
        })
        newb.push(...e)
      })
      b_[b_.length - 1].data = newb
    }
    if (b_.length > 1) {
      this.sortBracket(b_.slice(0, b_.length - 1), b_[b_.length - 1])
    }
  }

  label(ranking: Ranking): string {
    switch (ranking.stage) {
      case 'REGULAR_SEASON':
        switch (ranking.type) {
          case 'TOTAL':
            return 'Global'
          case 'HOME':
            return 'Home'
          case 'AWAY':
            return 'Away'
        }
        break;
      case 'GROUP_STAGE':
        return 'Groupe ' + ranking.group.charAt(ranking.group.length - 1);
      case 'PRELIMINARY_ROUND':
      case 'FINAL_PHASE':
      case 'QUALIFICATION':
        switch (ranking.type) {
          case this.matchday[this.matchday.length - 1].toString():
            return 'Finales';
          case this.matchday[this.matchday.length - 2].toString():
            return '1/2';
          case this.matchday[this.matchday.length - 3].toString():
            return '1/4';
          case this.matchday[this.matchday.length - 4].toString():
            return '1/8';
          case this.matchday[this.matchday.length - 5].toString():
            return '1/16';
          case this.matchday[this.matchday.length - 6].toString():
            return '1/32';
        }
        break;
    }
    return ''
  }

  changeStage(stage: string) {
    this.currStage = stage
    this.currMatches = this.matches.filter((match: Match) => match.stage == this.currStage)
    this.matchday = this.setMatchdays(this.currMatches)
    this.currMatchDay = this.currMatches[this.currMatches.length - 1].matchday
    this.currMatches = this.currMatches.filter((match: Match) => match.matchday == this.currMatchDay)
    this.currRankings = this.competition.rankings!.filter(
      (classement: Ranking) =>
        classement.stage == this.currStage
    );
  }

  setStages = (matches: Match[]) => [...new Set(matches.map((match: Match) => match.stage).filter(x => x != null))]

  setMatchdays = (matches: Match[]) => {
    let list = [...new Set(matches.map((match: Match) => match.matchday).filter(x => x != null))].sort((a: number, b: number) => a - b)
    let last = list[list.length - 1]
    for (let i = 0; i < 6 - last; i++) {
      list.push(list[list.length - 1] + i + 1)
    }
    return list
  }

  changeMatchDay(day: number) {
    this.currMatchDay = this.matchday[this.matchday.indexOf(this.currMatchDay + day)] ?? this.currMatchDay + day
    this.currMatches = this.matches.filter((match: Match) => match.matchday == this.currMatchDay && match.stage == this.currStage)
    if (!this.currMatches.length) {
      this.currMatchDay = this.matchday[this.matchday.indexOf(this.currMatchDay - day)]
      this.currMatches = this.matches.filter((match: Match) => match.matchday == this.currMatchDay && match.stage == this.currStage)
    }
  }

}

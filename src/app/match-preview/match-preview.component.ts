import { Component, Input, OnInit } from '@angular/core';
import { Match } from '../match';
import { Router } from '@angular/router';
import { VariablesGlobales } from '../global-variables';

@Component({
  selector: 'app-match-preview',
  templateUrl: './match-preview.component.html',
  styleUrls: ['./match-preview.component.css']
})
export class MatchPreviewComponent implements OnInit {

  @Input() match!: Match;
  @Input() type!: string;
  minutes: string = '';

  constructor(private router: Router, private Global: VariablesGlobales) { }

  ngOnInit(): void { //Shows the match live time
    let n = Math.ceil(((new Date()).getTime() - (new Date(this.match.date)).getTime()) / 1000 / 60)
    if (n > 141) {
      this.minutes = 120 + ' + ' + (n - 125)
    } else if (n > 126) {
      n -= 21
      this.minutes = n.toString()
    } else if (n > 125) {
      this.minutes = 105 + ' + ' + (n - 125)
    } else if (n > 110) {
      n -= 20
      this.minutes = n.toString()
    } else if (n > 105) {
      this.minutes = 90 + ' + ' + (n - 105)
    } else if (n > 60) {
      n -= 15
      this.minutes = n.toString()
    } else if (n > 45) {
      this.minutes = 45 + ' + ' + (n - 45)
    } else {
      this.minutes = n.toString()
    }
  }
}

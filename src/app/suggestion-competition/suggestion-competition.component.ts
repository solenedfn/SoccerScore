import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Competition } from '../competition';
import { Team } from '../team';
import { VariablesGlobales } from '../global-variables';

@Component({
  selector: 'app-suggestion-competition',
  templateUrl: './suggestion-competition.component.html',
  styleUrls: ['./suggestion-competition.component.css']
})
export class SuggestionCompetitionComponent implements OnInit {

  @Input() suggestion!: Competition | Team;

  constructor(private router: Router, private Global: VariablesGlobales) { }

  ngOnInit(): void { }

  detailSuggestion() {
    clearInterval(this.Global.intervalID)
    if (this.suggestion.class == 'Competition') {
      this.router.navigate(['/competition', this.suggestion.code])
    }
  }

}

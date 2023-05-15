import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VariablesGlobales } from '../global-variables';

@Component({
  selector: 'app-team-ranking',
  templateUrl: './team-ranking.component.html',
  styleUrls: ['./team-ranking.component.css'],
})
export class TeamRankingComponent implements OnInit {
  @Input() teams: Array<any> = [];

  constructor(private router: Router, private Global: VariablesGlobales) {}

  ngOnInit(): void {}
}

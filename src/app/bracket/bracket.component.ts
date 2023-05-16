import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VariablesGlobales } from '../global-variables';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.css'],
})
export class BracketComponent implements OnInit {
  @Input() bracket: Array<any> = [];

  constructor(private router: Router, private Global: VariablesGlobales) {}

  ngOnInit(): void {}

  detailTeam(id: string) {
    clearInterval(this.Global.intervalID);
    this.router.navigate(['/team', id]);
  }
}

import { Component, OnInit } from '@angular/core'
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { filter } from 'rxjs'
import { Competition } from '../competition'
import { DataService } from '../data.service'
import { Team } from '../team'
import { VariablesGlobales } from '../global-variables'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  searchForm: UntypedFormGroup
  searchCtrl: FormControl<string>
  searchControl = new FormControl('')

  suggestions: Array<Competition | Team> = []
  competitions: Array<Competition> = []
  teams: Array<Team> = []

  constructor(private dataService: DataService, private router: Router, private Global: VariablesGlobales) {
    this.searchCtrl = new FormControl('', { nonNullable: true })
    this.searchForm = new UntypedFormGroup({ search: this.searchCtrl })
  }

  ngOnInit() {
    this.dataService.getAllCompetitions().subscribe((competitions: Competition[]) => this.competitions = competitions)
    this.dataService.getAllTeams().subscribe((teams: Team[]) => this.teams = teams)
    this.searchCtrl.valueChanges.pipe(
      filter((val: string) => typeof val === 'string' && val.length > 2)
    ).subscribe((val: string) => this.suggestions = [...this.dataService.getContains(val, this.competitions), ...this.dataService.getContains(val, this.teams)])
  }

  detailChampionnats(id: string) {
    clearInterval(this.Global.intervalID)
    this.router.navigate(['/competition', id])
  }
}

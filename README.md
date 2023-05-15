# WinIsen

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# How to launch the project 

## Launch a ng serve
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Load a chrome session without CORS
Run `"~\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="c:/ChromeDevSession"` to load a chrome session without CORS

## Open the webiste
Follow the displayed link : http://localhost:4200 on your chrome session without CORS

## Problem on odds 
If you are not able to see the odds, you need to register on the website https://www.football-data.org/ and get an API key. Then, you need to subscribe as `Odds Add-On` and start a free trial. After that, you need to replace the API key in the variable token in file `src\app\variablesGlobale.ts` by your own API key.

# How to use the project

## Home Page
The home page is the page where you can see the list of the matches. You can filter the matches by the date. You can also sort the matches by the leagues. You can also see the odds of the match. If you click on the teams, you will be redirected to the page of the team. If you click on `Compétition`, you will be redirected to the page of the league.

## League Page
The league page is the page where you can see the list of the matches of the league sort by matchday, the classement and top scorers of the league. You can also see the odds of the match. If you click on the teams, you will be redirected to the page of the team. If you click on the players, you will be redirected to the page of the player.

## Team Page
The team page is the page where you can see the list of the past matches, the next matches, the players and current Competitions of the team. Matches are sort by the leagues. You can also see the odds of the match. If you click on the teams, you will be redirected to the page of the team.  If you click on the players, you will be redirected to the page of the player. If you click on the leagues, you will be redirected to the page of the league.

## Player Page
The player page is the page where you can see the list of the past matches of the player. Matches are sort by the leagues. You can also see the odds of the match. If you click on the teams, you will be redirected to the page of the team.

## About Page
The about page is the page where you can see the information about the project.

## Done

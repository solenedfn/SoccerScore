import { Team } from "./team";
import { Scores } from "./scores";

export interface Bracket {
    team1: Team;
    team2?: Team;

    scores?: Scores[][];
    duration: string[];
    status: string[];

    winner?: Team;
}

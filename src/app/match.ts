import { Competition } from "./competition";
import { Team } from "./team";

export interface Match {
    id: number;
    competition: Competition;
    duration: string;
    winner: string;
    homeTeam: Team;
    awayTeam: Team;
    matchday: number;
    date: string;
    group: string;
    stage: string;
    status: string;
}

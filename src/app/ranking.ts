import { Bracket } from "./bracket";
import { Team } from "./team";

export interface Ranking {
        class: string;
        type: string;
        group: string;
        stage: string;
        data: Array<Team | Bracket>;
}

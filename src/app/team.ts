import { Competition } from "./competition";
import { DatasTeam } from "./datas-team";
import { Scores } from "./scores";

export interface Team {
    class: string;

    code: number;
    name: string;
    shortName: string;
    logo: string;

    areaName: string;
    areaFlag: string;

    competitions?: Array<Competition>;

    score?: Scores;

    datas?: DatasTeam;
}

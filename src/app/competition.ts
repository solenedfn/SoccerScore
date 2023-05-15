import { Ranking } from "./ranking";

export interface Competition {
    class: string;

    id: number;
    name: string;
    code: string;
    logo: string;
    type: string;

    areaName: string;
    areaFlag: string;

    startDate?: string;
    endDate?: string;
    currMatchDay?: number;
    nbTeams?: number;

    rankings?: Array<Ranking>;
}

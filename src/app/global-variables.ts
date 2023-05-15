import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class VariablesGlobales {
    intervalID: NodeJS.Timer | undefined;
    token: string = 'f1373154d73b40e6a08d1df66bd55919';
}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getNewViewId = function () {
    return (new Date().getTime()) + Math.random().toString(36);
  }

}

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvService {
  apiUrl: string = '';

  constructor() {
    this.apiUrl = window["envConfig"]?.apiUrl || "http://localhost:30090";
  }

}
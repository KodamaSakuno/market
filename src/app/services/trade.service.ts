import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { Trade } from '../types/Trade';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  constructor() { }

  getTrades() {
    return of([
      new Trade({
        value: '100',
        amount: '1000',
      }),
      new Trade({
        value: '150',
        amount: '1500',
      }),
      new Trade({
        value: '100',
        amount: '1000',
      }),
    ]);
  }
}

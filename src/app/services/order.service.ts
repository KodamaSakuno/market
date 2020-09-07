import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { Order } from '../types/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  getOrders() {
    return of([
      new Order({
        value: '100000000000000000000',
        amount: '1000000000000000000000',
        decimals: 18,
        symbol: 'NRC',
      }),
      new Order({
        value: '150000000000000000000',
        amount: '1500000000000000000000',
        decimals: 18,
        symbol: 'NRC',
      }),
      new Order({
        value: '100000000000000000000',
        amount: '1000000000000000000000',
        decimals: 18,
        symbol: 'NRC',
      }),
    ]);
  }
}

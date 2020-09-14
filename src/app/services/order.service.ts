import { Injectable } from '@angular/core';
import { defer } from 'rxjs';

import { ContractService } from './contract.service';
import { Order, OrderDto } from '../types/Order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private contractService: ContractService) { }

  getOrders() {
    return defer(async () => {
      const { result } = await this.contractService.callPromise(environment.marketAddress, 'getAllOrders');

      return (result as Array<OrderDto>).map(dto => new Order(dto));
    });
  }
}

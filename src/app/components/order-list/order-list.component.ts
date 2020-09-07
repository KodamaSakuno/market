import { Component, OnInit } from '@angular/core';

import { OrderService } from '../../services/order.service';
import { Order } from '../../types/Order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.styl']
})
export class OrderListComponent implements OnInit {

  orders: Array<Order> = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

}

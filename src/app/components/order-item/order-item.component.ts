import { Component, OnInit, Input } from '@angular/core';

import { Order } from '../../types/Order';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.styl']
})
export class OrderItemComponent implements OnInit {
  @Input()
  order!: Order;

  constructor() { }

  ngOnInit(): void {
  }

}

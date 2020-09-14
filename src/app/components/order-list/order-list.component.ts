import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from '../../services/order.service';
import { Order } from '../../types/Order';
import { AddOrderModalComponent } from '../add-order-modal/add-order-modal.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.styl']
})
export class OrderListComponent implements OnInit {

  orders: Array<Order> = [];

  constructor(private orderService: OrderService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  addOrder() {
    this.modalService.open(AddOrderModalComponent);
  }
}

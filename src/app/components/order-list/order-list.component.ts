import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from '../../services/order.service';
import { MarketService } from 'src/app/services/market.service';
import { Order } from '../../types/Order';
import { AddOrderModalComponent } from '../add-order-modal/add-order-modal.component';
import { RemoveOrderModalComponent } from '../remove-order-modal/remove-order-modal.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.styl']
})
export class OrderListComponent implements OnInit {

  @Input()
  isDetail = false;
  @Output()
  isDetailChange = new EventEmitter<boolean>();

  orders: Array<Order> = [];

  constructor(private orderService: OrderService, private modalService: NgbModal, public marketService: MarketService) {
    this.orderService.orders$.subscribe(orders => {
      this.orders = orders;
    });
  }

  ngOnInit(): void {
    this.orderService.getOrders();
  }

  async addOrder() {
    const modal = this.modalService.open(AddOrderModalComponent);
    modal.componentInstance.orders = this.orders;

    await modal.result;

    this.orderService.getOrders();
  }
  async removeOrder() {
    await this.modalService.open(RemoveOrderModalComponent).result;

    this.orderService.getOrders();
  }

  toggleDetail() {
    this.isDetail = !this.isDetail;
    this.isDetailChange.emit(this.isDetail);
  }
}

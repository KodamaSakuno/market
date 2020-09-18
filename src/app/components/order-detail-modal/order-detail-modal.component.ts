import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';

import { Order } from '../../types/Order';
import { OrderDetailPayCurrencyModalComponent } from '../order-detail-pay-currency-modal/order-detail-pay-currency-modal.component';
import { OrderDetailPayTokenModalComponent } from '../order-detail-pay-token-modal/order-detail-pay-token-modal.component';
import { OrderService } from '../../services/order.service';
import { MarketService } from '../../services/market.service';
import { WalletService } from '../../services/wallet.service';
import { RemoveOrderModalComponent } from '../remove-order-modal/remove-order-modal.component';

@Component({
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.styl']
})
export class OrderDetailModalComponent implements OnInit {

  order!: Order;

  cancellable = false;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private orderService: OrderService, private marketService: MarketService, private walletService: WalletService) { }

  ngOnInit(): void {
    this.cancellable = this.order.owner === this.walletService.address && !this.order.trader;
  }

  async payCurrency() {
    const modal = this.modalService.open(OrderDetailPayCurrencyModalComponent);

    const remaining = this.order.value.minus(this.order.paidValue);
    const min = this.order.trader !== null ?
      BigNumber.min(remaining, this.order.value.div(new BigNumber(10))) :
      this.order.value.div(new BigNumber(100)).times(new BigNumber(this.marketService.config.deposit));

    Object.assign(modal.componentInstance, {
      isNewTrader: this.order.trader === null,
      min,
      max: remaining,
      value: remaining,
      args: [this.order.id],
    });

    await modal.result;

    this.orderService.getOrders();
    this.order = await this.orderService.getOrder(this.order.id);
  }
  async payToken() {
    const modal = this.modalService.open(OrderDetailPayTokenModalComponent);

    const remaining = this.order.amount.minus(this.order.paidAmount);
    const min = this.order.trader !== null ?
      BigNumber.min(remaining, this.order.amount.div(new BigNumber(10))) :
      this.order.amount.div(new BigNumber(100)).times(new BigNumber(this.marketService.config.deposit));

    Object.assign(modal.componentInstance, {
      isNewTrader: this.order.trader === null,
      min,
      max: remaining,
      amount: remaining,
      order: this.order,
    });

    await modal.result;

    this.orderService.getOrders();
    this.order = await this.orderService.getOrder(this.order.id);
  }

  async cancelOrder() {
    const modal = this.modalService.open(RemoveOrderModalComponent);

    modal.componentInstance.args = [this.order.id];

    await modal.result;

    this.orderService.getOrders();
    this.activeModal.close();
  }

}

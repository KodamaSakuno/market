import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, pairwise } from 'rxjs/operators';

import { TokenService } from '../../services/token.service';
import { MarketService } from '../../services/market.service';
import { AddOrderPayCurrencyModalComponent } from '../add-order-pay-currency-modal/add-order-pay-currency-modal.component';
import { AddOrderPayTokenModalComponent } from '../add-order-pay-token-modal/add-order-pay-token-modal.component';
import { Order } from 'src/app/types/Order';

@Component({
  selector: 'app-add-order-modal',
  templateUrl: './add-order-modal.component.html',
  styleUrls: ['./add-order-modal.component.styl']
})
export class AddOrderModalComponent implements OnInit {

  private _value = new BigNumber(NaN);
  get value() {
    return this._value;
  }
  set value(val: BigNumber) {
    this._value = val;
    this.input(1);
  }

  private _amount = new BigNumber(NaN);
  get amount() {
    return this._amount;
  }
  set amount(val: BigNumber) {
    this._amount = val;
    this.input(2);
  }

  private _ratio = 0;
  get ratio() {
    return this._ratio;
  }
  set ratio(val: number) {
    this._ratio = val;
    this.input(3);
  }

  private _ratioReversed = 0;
  get ratioReversed() {
    return this._ratioReversed;
  }
  set ratioReversed(val: number) {
    this._ratioReversed = val;
    this.input(4);
  }

  _pair = new Array<1 | 2 | 3 | 4>();

  orders: Array<Order> = [];

  get protected() {
    let { ratioProtectRange, valueProtectRange } = this.marketService.config;
    const { decimals } = this.tokenService;
    const ten = new BigNumber(10);

    const valueLiteral = this.value.div(ten.pow(18));
    const amountLiteral = this.amount.div(ten.pow(decimals));
    const targetRatio = amountLiteral.div(valueLiteral);

    for (const order of this.orders) {
      const ratio = order.amount.div(ten.pow(decimals)).div(order.value.div(ten.pow(18)));
      const ratioDelta = ratio.div(100).times(ratioProtectRange);

      console.warn(targetRatio.toNumber())

      if (targetRatio.gte(ratio.minus(ratioDelta)) && targetRatio.lte(ratio.plus(ratioDelta)))
        return true;

      const valueDelta = order.value.div(100).times(valueProtectRange);

      if (this.value.gte(order.value.minus(valueDelta)) && this.value.lte(order.value.plus(valueDelta)))
        return true;
    }

    return false;
  }

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, public tokenService: TokenService, private marketService: MarketService) {
  }

  ngOnInit(): void {
  }

  private input(type: 1 | 2 | 3 | 4) {
    if (this._pair.length == 0) {
      this._pair.push(type);
      return;
    }

    const last = this._pair[this._pair.length - 1];
    if (last != type) {
      if ((last == 3 && type == 4) || (last == 4 && type == 3))
        this._pair[this._pair.length - 1] = type;
      else
        this._pair.push(type);

      if (this._pair.length < 2)
        return;

      if (this._pair.length === 3)
        this._pair.shift();
    }

    const [a, b] = [...this._pair].sort();
    const { decimals } = this.tokenService;
    const ten = new BigNumber(10);

    const valueLiteral = this.value.div(ten.pow(18));
    const amountLiteral = this.amount.div(ten.pow(decimals));

    if (a == 1 && b == 2) {
      this._ratio = amountLiteral.div(valueLiteral).toNumber();
      this._ratioReversed = valueLiteral.div(amountLiteral).toNumber();
    } else if (a == 1 && b == 3) {
      this._amount = valueLiteral.times(this.ratio).times(ten.pow(decimals));
      this._ratioReversed = 1 / this.ratio;
    } else if (a == 1 && b == 4) {
      this._ratio = 1 / this.ratioReversed;
      this._amount = valueLiteral.times(this.ratio).times(ten.pow(decimals));
    } else if (a == 2 && b == 3) {
      this._ratioReversed = 1 / this.ratio;
      this._value = amountLiteral.div(this.ratio).times(ten.pow(18));
    } else if (a == 2 && b == 4) {
      this._ratio = 1 / this.ratioReversed;
      this._value = amountLiteral.div(this.ratio).times(ten.pow(18));
    }
  }

  async payCurrency() {
    const modal = this.modalService.open(AddOrderPayCurrencyModalComponent);

    Object.assign(modal.componentInstance, {
      max: this.value,
      deposit: this.value.div(100).times(this.marketService.config.deposit),
      value: this.value,
      args: [this.tokenService.contractAddress, this.value.toString(10), this.amount.toString(10)],
    });

    await modal.result;

    this.activeModal.close();
  }
  async payToken() {
    const modal = this.modalService.open(AddOrderPayTokenModalComponent);

    Object.assign(modal.componentInstance, {
      max: this.amount,
      deposit: this.amount.div(100).times(this.marketService.config.deposit),
      amount: this.amount,
      orderValueArg: this.value.toString(10),
      orderAmountArg: this.amount.toString(10),
    });

    await modal.result;

    this.activeModal.close();
  }

}

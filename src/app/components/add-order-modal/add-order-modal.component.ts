import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';

import { TokenService } from '../../services/token.service';
import { PayCurrencyModalComponent } from '../pay-currency-modal/pay-currency-modal.component';
import { PayTokenModalComponent } from '../pay-token-modal/pay-token-modal.component';

@Component({
  selector: 'app-add-order-modal',
  templateUrl: './add-order-modal.component.html',
  styleUrls: ['./add-order-modal.component.styl']
})
export class AddOrderModalComponent implements OnInit {

  private _value = '';
  get value() {
    return this._value;
  }
  set value(val: string) {
    this._value = val;
    this._valueBn = new BigNumber(val);
  }

  private _valueBn = new BigNumber(NaN);
  get isValueValid() {
    return !this._valueBn.isNaN();
  }

  private _amount = '';
  get amount() {
    return this._amount;
  }
  set amount(val: string) {
    this._amount = val;
    this._amountBn = new BigNumber(val);
  }

  private _amountBn = new BigNumber(NaN);
  get isAmountValid() {
    return !this._amountBn.isNaN();
  }

  get isPayable() {
    return this.isValueValid && this.isAmountValid;
  }

  get ratio() {
    if (!this.isValueValid || !this.isAmountValid)
      return '';

    return '1:' + this._amountBn.div(this._valueBn).toString();
  }

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private tokenService: TokenService) { }

  ngOnInit(): void {
  }

  payCurrency() {
    const modal = this.modalService.open(PayCurrencyModalComponent);

    Object.assign(modal.componentInstance, {
      max: this.value,
      value: this.value,
      args: [this.tokenService.contractAddress, this._valueBn.times(new BigNumber(10).pow(18)).toString(10), this._amountBn.times(new BigNumber(10).pow(this.tokenService.decimals)).toString(10)],
    });

  }
  payToken() {
    const modal = this.modalService.open(PayTokenModalComponent);

    Object.assign(modal.componentInstance, {
      max: this.amount,
      amount: this.amount,
      orderValueArg: this._valueBn.times(new BigNumber(10).pow(18)).toString(10),
      orderAmountArg: this._amountBn.times(new BigNumber(10).pow(this.tokenService.decimals)).toString(10),
    });
  }

}

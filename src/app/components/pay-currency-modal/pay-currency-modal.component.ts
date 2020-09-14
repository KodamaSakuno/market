import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';

import { MarketService } from '../../services/market.service';

@Component({
  selector: 'app-pay-currency-modal',
  templateUrl: './pay-currency-modal.component.html',
  styleUrls: ['./pay-currency-modal.component.styl']
})
export class PayCurrencyModalComponent implements OnInit {

  deposit = new BigNumber(NaN);
  max!: BigNumber;

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

  get valueArg() {
    return this._valueBn;
  }

  args!: any[];

  constructor(public activeModal: NgbActiveModal, public marketService: MarketService) { }

  ngOnInit(): void {
  }

}

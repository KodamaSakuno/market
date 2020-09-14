import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';

import { MarketService } from '../../services/market.service';
import { TokenService } from '../../services/token.service';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-pay-token-modal',
  templateUrl: './pay-token-modal.component.html',
  styleUrls: ['./pay-token-modal.component.styl']
})
export class PayTokenModalComponent implements OnInit {

  deposit = new BigNumber(NaN);
  max!: BigNumber;

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

  get amountArg() {
    return this._amountBn.times(new BigNumber(10).pow(this.tokenService.decimals)).toString(10);
  }

  orderValueArg!:string;
  orderAmountArg!:string;

  allowance = new BigNumber(NaN);

  get currentAllowanceArg() {
    return this.allowance.times(new BigNumber(10).pow(this.tokenService.decimals)).toString(10);
  }

  get isInsuffientAllowance() {
    return this.allowance.lt(this._amountBn);
  }

  constructor(public activeModal: NgbActiveModal, public marketService: MarketService,
    public tokenService: TokenService, private walletService: WalletService) { }

  ngOnInit(): void {
    this.refreshAllowance();
  }

  refreshAllowance() {
    this.allowance = new BigNumber(NaN);

    this.tokenService.getAllowance(this.walletService.address!, this.marketService.contractAddress).subscribe(allowance => {
      this.allowance = allowance;
    });
  }
}

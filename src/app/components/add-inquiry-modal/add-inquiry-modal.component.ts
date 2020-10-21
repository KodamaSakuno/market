import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BigNumber from 'bignumber.js';

import { MarketService } from '../../services/market.service';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-add-inquiry-modal',
  templateUrl: './add-inquiry-modal.component.html',
  styleUrls: ['./add-inquiry-modal.component.styl']
})
export class AddInquiryModalComponent implements OnInit {
  private _selected: string | null = null;
  get selected() {
    return this._selected!;
  }
  set selected(val: string) {
    if (val === 'nas')
      this.token = null;
    else if (val === 'nax')
      this.token = environment.tokenAddress;
    else
      throw new Error('Impossible route');

    this._selected = val;
  }

  token: string | null = null;

  minValue = new BigNumber(0);
  minAmount = new BigNumber(0);

  constructor(public activeModal: NgbActiveModal, public marketService: MarketService, public tokenService: TokenService) { }

  ngOnInit(): void {
    this.minValue = new BigNumber(this.marketService.config.minValue);
    this.minAmount = new BigNumber(this.marketService.config.minAmount);
  }
}

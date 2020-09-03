import { Component, OnInit } from '@angular/core';

import { WalletService } from '../../wallet.service';

@Component({
  selector: 'app-wallet-unlocker',
  templateUrl: './wallet-unlocker.component.html',
  styleUrls: ['./wallet-unlocker.component.styl']
})
export class WalletUnlockerComponent implements OnInit {

  constructor(public walletService: WalletService) {
  }

  ngOnInit(): void {
  }

}

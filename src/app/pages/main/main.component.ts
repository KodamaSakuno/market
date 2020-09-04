import { Component, OnInit } from '@angular/core';

import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.styl']
})
export class MainComponent implements OnInit {

  isAvailable = false;

  constructor(private walletService: WalletService) {
    this.walletService.isAvailable.subscribe(isAvailable => {
      this.isAvailable = isAvailable;
    });
    this.walletService.checkBinded();
  }

  ngOnInit(): void {
  }
}

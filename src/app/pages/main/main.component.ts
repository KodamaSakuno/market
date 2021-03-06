import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { WalletService } from '../../services/wallet.service';
import { TokenService } from '../../services/token.service';
import { MarketService } from '../../services/market.service';
import { environment } from 'src/environments/environment';
import { ManualComponent } from 'src/app/components/manual/manual.component';
import { ManualEnComponent } from 'src/app/components/manual-en/manual-en.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.styl']
})
export class MainComponent implements OnInit {

  isAvailable = false;

  isDetailOrderList = false;

  get marketContractExplorerUrl() {
    return environment.explorerPrefix + this.marketService.contractAddress;
  }
  get managerExplorerUrl() {
    return environment.explorerPrefix + environment.proxyAddress;
  }

  constructor(private walletService: WalletService, private tokenService: TokenService, private marketService: MarketService, private modalService: NgbModal) {
    this.walletService.isAvailable.subscribe(isAvailable => {
      this.isAvailable = isAvailable;
      if (isAvailable)
        this.marketService.initialize();
    });
    this.walletService.checkBinded();
  }

  ngOnInit(): void {
    this.tokenService.initialize();
  }

  showManual() {
    this.modalService.open(ManualComponent);
  }
  showEnglishManual() {
    this.modalService.open(ManualEnComponent);
  }
}

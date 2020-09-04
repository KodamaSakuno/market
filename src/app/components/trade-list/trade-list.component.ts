import { Component, OnInit } from '@angular/core';

import { TradeService } from '../../services/trade.service';
import { Trade } from '../../types/Trade';

@Component({
  selector: 'app-trade-list',
  templateUrl: './trade-list.component.html',
  styleUrls: ['./trade-list.component.styl']
})
export class TradeListComponent implements OnInit {

  trades: Array<Trade> = [];

  constructor(private tradeService: TradeService) { }

  ngOnInit(): void {
    this.tradeService.getTrades().subscribe(trades => {
      this.trades = trades;
    });
  }

}

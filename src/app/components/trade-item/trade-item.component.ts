import { Component, OnInit, Input } from '@angular/core';

import { Trade } from '../../types/Trade';

@Component({
  selector: 'app-trade-item',
  templateUrl: './trade-item.component.html',
  styleUrls: ['./trade-item.component.styl']
})
export class TradeItemComponent implements OnInit {
  @Input()
  trade!: Trade;

  constructor() { }

  ngOnInit(): void {
  }

}

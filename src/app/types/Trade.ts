import { BigNumber } from 'bignumber.js';

export type TradeDto = {
  value: string,
  amount: string,
}

export class Trade {
  value: BigNumber;
  amount: BigNumber;

  constructor(dto: TradeDto) {
    this.value = new BigNumber(dto.value);
    this.amount = new BigNumber(dto.amount);
  }
}

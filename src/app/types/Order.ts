import { BigNumber } from 'bignumber.js';

export type OrderDto = {
  value: string,
  amount: string,
  symbol: string,
  decimals: number,
}

export class Order {
  value: BigNumber;
  amount: BigNumber;
  symbol: string;

  constructor(dto: OrderDto) {
    this.value = new BigNumber(dto.value).div(new BigNumber(10).pow(18));
    this.amount = new BigNumber(dto.amount).div(new BigNumber(10).pow(dto.decimals));
    this.symbol = dto.symbol;
  }
}

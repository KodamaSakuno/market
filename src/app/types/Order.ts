import { BigNumber } from 'bignumber.js';

export type OrderDto = {
  id: string,
  owner: string,
  type: string,
  trader: string | null,
  token: string,
  value: string,
  amount: string,
  paidValue: string,
  paidAmount: string,
  symbol: string,
  decimals: number,
}

export const enum PaidState {
  Unpaid,
  DepositPaid,
  AllPaid,
}

export class Order {
  id: string;
  owner: string;
  type: string;
  trader: string | null;
  value: BigNumber;
  amount: BigNumber;
  paidValue: BigNumber;
  paidAmount: BigNumber;
  decimals: number;
  symbol: string;

  get ratio() {
    return this.amount.div(this.value);
  }

  get currencyPaidState() {
    if (this.paidValue.eq(new BigNumber(0)))
      return PaidState.Unpaid;

    if (this.paidValue.eq(this.value))
      return PaidState.AllPaid;

    return PaidState.DepositPaid;
  }
  get tokenPaidState() {
    if (this.paidAmount.eq(new BigNumber(0)))
      return PaidState.Unpaid;

    if (this.paidAmount.eq(this.amount))
      return PaidState.AllPaid;

    return PaidState.DepositPaid;
  }

  constructor(dto: OrderDto) {
    this.id = dto.id;
    this.owner = dto.owner;
    this.type = dto.type;
    this.trader = dto.trader;
    this.value = new BigNumber(dto.value).div(new BigNumber(10).pow(18));
    this.amount = new BigNumber(dto.amount).div(new BigNumber(10).pow(dto.decimals));
    this.paidValue = new BigNumber(dto.paidValue).div(new BigNumber(10).pow(18));
    this.paidAmount = new BigNumber(dto.paidAmount).div(new BigNumber(10).pow(dto.decimals));
    this.decimals = dto.decimals;
    this.symbol = dto.symbol;
  }
}

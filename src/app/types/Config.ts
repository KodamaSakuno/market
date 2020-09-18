import BigNumber from 'bignumber.js';

export type Config = {
  minValue: string | BigNumber,
  maxValue: string | BigNumber,
  minAmount: string | BigNumber,
  maxAmount: string | BigNumber,
  a: number,
  b: number,
  deposit: number,
}

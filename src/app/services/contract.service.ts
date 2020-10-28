import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { defer } from 'rxjs';

import { WalletService } from './wallet.service';

function randomCode(len: number) {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; len > i; i += 1) {
      let e = Math.random() * chars.length;
      e = Math.floor(e);
      result += chars.charAt(e);
  }

  return result;
};

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private _timeoutIds: Map<symbol, number>;

  constructor(private walletService: WalletService, private httpClient: HttpClient) {
    this._timeoutIds = new Map<symbol, number>();
  }

  call(contractAddress: string, method: string, args: any[] = []) {
    return defer(() => this.callPromise(contractAddress, method, args));
  }
  async callPromise(contractAddress: string, method: string, args: any[] = []) {
    const { nonce } = await this.httpClient.post('/api/nebulas/account_state', { address: this.walletService.address }).toPromise<any>();

    const { result, execute_err, estimate_gas } = await this.httpClient.post('/api/nebulas/call', {
      from: this.walletService.address!,
      to: contractAddress,
      value: '0',
      gasLimit: '200000',
      gasPrice: '20000000000',
      nonce: parseInt(nonce) + 1,
      contract: {
        function: method,
        args: JSON.stringify(args),
      },
    }).toPromise<any>();

    if (execute_err !== '') {
      throw new Error(execute_err);
    }

    return {
      result: JSON.parse(result),
      estimate_gas,
    };
  }

  generateQRDataForCall(qrcodeInstance: symbol, to: string, value: string | BigNumber, func: string, args: any[] = []) {
    let timeoutId = this._timeoutIds.get(qrcodeInstance);
    if (timeoutId)
      clearInterval(timeoutId);

    const serialNumber = randomCode(32);
    const promise = new Promise((resolve, reject) => {
      const checkPayInfo = async (serialNumber: string) => {
        const res = await this.httpClient.post('/api/nebulas/pay_info', { serialNumber }).toPromise<any>();
        console.info(res);
        if (res.code !== 0) {
          if (typeof res.msg === 'string' && res.msg.endsWith('does not exist'))
            return;

          clearInterval(timeoutId);
          this._timeoutIds.delete(qrcodeInstance);
          return;
        }

        const { status } = res.data;

        if (status === 0)
          reject(res.data.execute_error);
        else if (status === 1)
          resolve();
        else if (status === 2) {
          return;
        }

        clearInterval(timeoutId);
        this._timeoutIds.delete(qrcodeInstance);
      };

      this._timeoutIds.set(qrcodeInstance, timeoutId = setInterval(() => checkPayInfo(serialNumber), 5000));
    });

    if (typeof value === 'string')
      value = new BigNumber(value);

    return {
      data: JSON.stringify({
        category: 'jump',
        des: 'confirmTransfer',
        pageParams: {
          serialNumber,
          goods: {
            name: "test",
            desc: "test goods",
          },
          pay: {
            currency: 'NAS',
            to,
            value,
            payload: {
              type: 'call',
              function: func,
              args: JSON.stringify(this._formatArgs(args)),
            },
          },
          callback: 'https://pay.nebulas.io/api/mainnet/pay',
        },
      }),
      promise,
    };
  }

  private _formatArgs(args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const item = args[i];

      if (item instanceof BigNumber)
        args[i] = item.toString(10);
      else if (Array.isArray(item))
        this._formatArgs(item);
    }

    return args;
  }
}

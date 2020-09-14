import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { defer } from 'rxjs';

import { environment } from 'src/environments/environment';

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
  private _neb: Neb;
  private _nebPay: NebPay;

  private _timeoutIds: Map<symbol, NodeJS.Timeout>;

  constructor(private walletService: WalletService) {
    this._neb = new Neb();
    this._neb.setRequest(new HttpRequest('https://testnet.nebulas.io'));

    this._nebPay = new NebPay();

    this._timeoutIds = new Map<symbol, NodeJS.Timeout>();
  }

  async call(contractAddress: string, method: string, args: any[] = []) {
    return defer(() => this.callPromise(contractAddress, method, args));
  }
  async callPromise(contractAddress: string, method: string, args: any[] = []) {
    const { nonce } = await this._neb.api.getAccountState(this.walletService.address!);
    const { result, execute_err, estimate_gas } = await this._neb.api.call({
      from: this.walletService.address!,
      to: contractAddress,
      value: '0',
      gasLimit: new BigNumber('200000', 10).toNumber(),
      gasPrice: new BigNumber('20000000000', 10).toNumber(),
      nonce: parseInt(nonce) + 1,
      contract: {
        function: method,
        args: JSON.stringify(args),
      },
    });

    if (execute_err !== '') {
      throw new Error(execute_err);
    }

    return {
      result: JSON.parse(result),
      estimate_gas,
    };
  }

  generateQRDataForCall(qrcodeInstance: symbol, to: string, value: string, func: string, args: any[] = []) {
    let timeoutId = this._timeoutIds.get(qrcodeInstance);
    if (timeoutId)
      clearTimeout(timeoutId);

    const serialNumber = randomCode(32);
    const promise = new Promise((resolve, reject) => {
      const checkPayInfo = async (sn: string) => {
        const res = JSON.parse(await this._nebPay.queryPayInfo(sn, { callback: NebPay.config.testnetUrl }));
        console.info(res);
        if (res.code !== 0) {
          reject();
          return;
        }

        if (res.data.status === 1)
          resolve();
        else if (res.data.status === 2) {
          this._timeoutIds.set(qrcodeInstance, setTimeout(() => checkPayInfo(sn), 5000));
        }
      };

      checkPayInfo(serialNumber);
    });

    return {
      data: JSON.stringify({
        category: 'jump',
        des: 'confirmTransfer',
        pageParams: {
          serialNumber,
          pay: {
            currency: 'NAS',
            to,
            value: new BigNumber(value).times(new BigNumber(10).pow(18)).toString(10),
            payload: {
              type: 'call',
              function: func,
              args: JSON.stringify(args),
            },
            gasLimit: '200000',
            gasPrice: '20000000000',
          },
        },
        callback: 'https://pay.nebulas.io/api/pay',
      }),
      promise,
    };
  }
  callWithPay(to: string, method: string, value: string, args: any[]) {
    return new Promise((resolve, reject) => {
      const checkPayInfo = async (sn: string) => {
        const res = JSON.parse(await this._nebPay.queryPayInfo(sn, { callback: NebPay.config.testnetUrl }));
        console.info(res);
        if (res.code !== 0) {
          reject();
          return;
        }

        if (res.data.status === 1)
          resolve();
        else if (res.data.status === 2)
          setTimeout(() => checkPayInfo(sn), 5000);
      };

      this._nebPay.call(to, value, method, JSON.stringify(args), {
        gasLimit: '200000',
        gasPrice: '20000000000',
        callback: NebPay.config.testnetUrl,
        listener: (sn: string) => checkPayInfo(sn),
      });
    });
  }
}

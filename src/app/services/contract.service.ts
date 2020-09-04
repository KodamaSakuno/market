import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';

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

  constructor(private walletService: WalletService) {
    this._neb = new Neb();
    this._neb.setRequest(new HttpRequest('https://testnet.nebulas.io'));

    this._nebPay = new NebPay();
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

  generateQRDataForCall(to: string, value: string, func: string, args: any[] = []) {
    return JSON.stringify({
      category: 'jump',
      des: 'confirmTransfer',
      pageParams: {
        serialNumber: randomCode(32),
        pay: {
          currency: 'NAS',
          to,
          value,
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
    });
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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Buffer } from 'safe-buffer';
import Base58 from 'bs58';
import jsSHA from 'jssha';

const WalletKey = 'wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  address: string | null = null;

  isAvailable = new Subject<boolean>();

  constructor() {
    this.address = localStorage.getItem(WalletKey);

    if (!this._isValidAddress(this.address)) {
      this.address = null;
      localStorage.removeItem(WalletKey);
    }
  }

  checkBinded() {
    this.isAvailable.next(!!this.address);
  }

  bind(address: string) {
    if (!this._isValidAddress(address)) {
      alert('地址无效');
      return;
    }

    this.address = address;
    localStorage.setItem(WalletKey, address);

    this.isAvailable.next(false);
    this.isAvailable.next(true);
  }

  private _isValidAddress(addr: string | null) {
    if (!addr)
      return false;

    const AddressLength = 26;
    const AddressPrefix = 25;
    const NormalType = 87;
    const ContractType = 88;

    const address = Base58.decode(addr);
    if (address.length != AddressLength)
      return false;

    const buffer = Buffer.from(address);
    if (buffer.readUIntBE(0, 1) !== AddressPrefix)
        return false;

    const t = buffer.readUIntBE(1, 1);
    if (t !== NormalType && t !== ContractType)
        return false;

    const content = buffer.slice(0, 22);
    const checksum = buffer.slice(-4);

    const contentHash = this._sha3(content).slice(0, 4);
    return Buffer.compare(contentHash, checksum) === 0;
  }
  private _sha3(content: Buffer) {
    const shaObj = new jsSHA("SHA3-256", "HEX");

    shaObj.update(content.toString("hex"));

    return Buffer.from(shaObj.getHash("HEX"), "hex");
  }

}

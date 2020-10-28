import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Buffer } from 'safe-buffer';
import Base58 from 'bs58';
import jsSHA from 'jssha';
import BigNumber from 'bignumber.js';

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

    const buffer = Base58.decode(addr);

    if (buffer.length != AddressLength)
      return false;

    if (buffer.readUIntBE(0, 1) !== AddressPrefix)
        return false;

    const t = buffer.readUIntBE(1, 1);
    if (t !== NormalType && t !== ContractType)
        return false;

    const content = addr.slice(0, 22);
    const checksum = addr.slice(-4);

    return Buffer.compare(this._sha3(content).slice(0, 4), Buffer.from(checksum)) === 0;
  }
  private _sha3(content: string) {
    const shaObj = new jsSHA("SHA3-256", "HEX");

    shaObj.update(this._toBuffer(content).toString("hex"));

    return Buffer.from(shaObj.getHash("HEX"), "hex");
  }

  private _toBuffer(v: any) {
    function isHexString(value: any, length?: number) {
      if (typeof(value) !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
          return false;
      }

      if (length && value.length !== 2 + 2 * length) { return false; }

      return true;
    }
    function intToHex(i: any) {
      var hex = i.toString(16); // eslint-disable-line

      return '0x' + padToEven(hex);
    }

    // returns buffer from int
    function intToBuffer(i: any) {
        var hex = intToHex(i);

        return new Buffer(hex.slice(2), 'hex');
    }
    function padToEven(value: any) {
      var a = value; // eslint-disable-line

      if (typeof a !== 'string') {
          throw new Error('padToEven only support string');
      }

      if (a.length % 2) {
          a = '0' + a;
      }

      return a;
    }
    function isHexPrefixed(str: any) {
      if (typeof str !== 'string') {
        throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " + (typeof str) + ", while checking isHexPrefixed.");
      }

      return str.slice(0, 2) === '0x';
    }

    // returns hex string without 0x
    function stripHexPrefix(str: any) {
      if (typeof str !== 'string') {
        return str;
      }
      return isHexPrefixed(str) ? str.slice(2) : str;
    }
    function isBigNumber(obj: any) {
      return obj instanceof BigNumber ||
        (obj && obj.constructor && obj.constructor.name === 'BigNumber');
    }

    if (!Buffer.isBuffer(v)) {
      if (Array.isArray(v)) {
        v = Buffer.from(v);
      } else if (typeof v === 'string') {
        if (isHexString(v)) {
          v = Buffer.from(padToEven(stripHexPrefix(v)), 'hex');
        } else {
          v = Buffer.from(v);
        }
      } else if (typeof v === 'number') {
        v = intToBuffer(v);
      } else if (v === null || v === undefined) {
        v = Buffer.allocUnsafe(0);
      } else if (isBigNumber(v)) {
        // TODO: neb number is a big int, not support if v is decimal, later fix it.
        v = Buffer.from(padToEven(v.toString(16)), 'hex');
      } else if (v.toArray) {
        v = Buffer.from(v.toArray());
      } else if (v.subarray) {
        v = Buffer.from(v);
      } else if (v === null || typeof v === "undefined") {
        v = Buffer.allocUnsafe(0);
      } else {
        throw new Error('invalid type');
      }
    }
    return v;
  }
}

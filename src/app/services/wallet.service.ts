import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  address: string | null = null;

  isAvailable = new Subject<boolean>();

  constructor() {
    this.address = localStorage.getItem("wallet");
  }

  checkBinded() {
    this.isAvailable.next(!!this.address);
  }

  bind(address: string) {
    this.address = address;
    localStorage.setItem("wallet", address);

    this.isAvailable.next(!!address);
  }
}

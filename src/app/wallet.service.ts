import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  address: string | null = null;

  constructor() {
    this.address = localStorage.getItem("wallet");
  }

  bind(address: string) {
    this.address = address;
    localStorage.setItem("wallet", address);
  }
}

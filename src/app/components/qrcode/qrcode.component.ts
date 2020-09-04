import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.styl']
})
export class QrcodeComponent implements OnInit {
  @Input()
  to?: string;

  @Input()
  value = "0";

  @Input()
  func?: string;

  private _args: any[] = [];
  get args() {
    return this._args;
  }
  @Input()
  set args(val: any[]) {
    this._args = val;

    this.refresh();
  }

  qrdata!: string;

  constructor(private contractService: ContractService) { }

  ngOnInit(): void {
    this.refresh();
  }

  private refresh() {
    if (!this.to || !this.func)
      throw new Error("Parameter(s) missed");

    this.qrdata = this.contractService.generateQRDataForCall(this.to, this.value, this.func, this.args);
  }

  useExtension() {
    if (!this.to || !this.func || !this.args)
      throw new Error("Parameter(s) missed");

    this.contractService.callWithPay(this.to, this.func, this.value, this.args);
  }

}

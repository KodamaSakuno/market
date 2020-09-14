import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PayCurrencyModalComponent } from '../pay-currency-modal/pay-currency-modal.component';
import { PayTokenModalComponent } from '../pay-token-modal/pay-token-modal.component';

@Component({
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.styl']
})
export class OrderDetailModalComponent implements OnInit {

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  payCurrency() {
    const modal = this.modalService.open(PayCurrencyModalComponent);
  }
  payToken() {
    const modal = this.modalService.open(PayTokenModalComponent);
  }

}

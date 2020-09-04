import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { InquiryService } from '../../services/inquiry.service';
import { Inquiry } from '../../types/Inquiry';
import { AddInquiryModalComponent } from '../add-inquiry-modal/add-inquiry-modal.component';
import { RemoveAllInquiriesModalComponent } from '../remove-all-inquiries-modal/remove-all-inquiries-modal.component';

@Component({
  selector: 'app-inquiry-list',
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./inquiry-list.component.styl']
})
export class InquiryListComponent implements OnInit {
  inquiries: Array<Inquiry> = [];

  constructor(private inquiryService: InquiryService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.inquiryService.getInquiries().subscribe(inquiries => {
      this.inquiries = inquiries;
    });
  }

  addInquiry() {
    this.modalService.open(AddInquiryModalComponent);
  }
  removeAllInquiries() {
    this.modalService.open(RemoveAllInquiriesModalComponent);
  }

}

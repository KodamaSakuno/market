import { Injectable } from '@angular/core';
import { defer } from 'rxjs';

import { Inquiry, InquiryDto } from '../types/Inquiry';
import { ContractService } from './contract.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {

  constructor(private contractService: ContractService) { }

  getInquiries() {
    return defer(async () => {
      const { result } = await this.contractService.callPromise(environment.marketAddress, 'getAllInquiries');

      return (result as Array<InquiryDto>).map(dto => new Inquiry(dto));
    });
  }
}

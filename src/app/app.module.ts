import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppIconsModule } from './app-icons.module';

import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { WalletUnlockerComponent } from './components/wallet-unlocker/wallet-unlocker.component';
import { TradeListComponent } from './components/trade-list/trade-list.component';
import { TradeItemComponent } from './components/trade-item/trade-item.component';
import { TradeInputModalComponent } from './components/trade-input-modal/trade-input-modal.component';
import { InquiryListComponent } from './components/inquiry-list/inquiry-list.component';
import { InquiryItemComponent } from './components/inquiry-item/inquiry-item.component';
import { InquiryDetailModalComponent } from './components/inquiry-detail-modal/inquiry-detail-modal.component';
import { IntegerPipe } from './integer.pipe';
import { AddInquiryModalComponent } from './components/add-inquiry-modal/add-inquiry-modal.component';
import { QrcodeComponent } from './components/qrcode/qrcode.component';
import { RemoveAllInquiriesModalComponent } from './components/remove-all-inquiries-modal/remove-all-inquiries-modal.component';
import { TestTokenComponent } from './components/test-token/test-token.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    WalletUnlockerComponent,
    TradeListComponent,
    TradeItemComponent,
    TradeInputModalComponent,
    InquiryListComponent,
    InquiryItemComponent,
    InquiryDetailModalComponent,
    IntegerPipe,
    AddInquiryModalComponent,
    QrcodeComponent,
    RemoveAllInquiriesModalComponent,
    TestTokenComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    QRCodeModule,
    HttpClientModule,
    AppRoutingModule,
    AppIconsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

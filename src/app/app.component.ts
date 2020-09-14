import { Component, OnInit } from '@angular/core';

import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {

  constructor(private tokenService: TokenService) { }

  ngOnInit() {
    this.tokenService.initialize();

  }
}

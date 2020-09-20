import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.styl']
})
export class TxsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goback() {
    this.router.navigate(['']);
  }

}

import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.less']
})
export class TransactionComponent implements OnInit {

  @Input() studentId: number;

  constructor(
    private http: HttpService
  ) { }

  ngOnInit() {
  }

  @ViewChild('table') table: TableComponent;
  refund(id) {
    this.http.post('/student/serviceRevoke', { paramJson: JSON.stringify({ id }) }, true).then(r => this.table._request());
  }

}

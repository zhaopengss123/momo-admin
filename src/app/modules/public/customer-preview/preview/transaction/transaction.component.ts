import { NzMessageService } from 'ng-zorro-antd';
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
    private http: HttpService,
    private message: NzMessageService
  ) { 
    this.http.post('/student/getCollectorAndRecommender').then(res => this.teacherList = res.data.collectorList);
  }

  ngOnInit() {
  }

  @ViewChild('table') table: TableComponent;
  refund(id) {
    this.http.post('/student/serviceRevoke', { paramJson: JSON.stringify({ id }) }, true).then(r => this.table._request());
  }

  showModal: boolean;
  changeLoading: boolean;
  transactionId: number;
  teacherList: any[] = [];
  teacherId: number;
  changeEnter() {
    if (this.teacherId) {
      this.changeLoading = true;
      this.http.post('/student/updateSale', { paramJson: JSON.stringify({ id: this.transactionId, salespersonId: this.teacherId }) }).then(res => {
        this.changeLoading = false;
        this.showModal = false;
        this.table._request();
      })
    } else {
      this.message.warning('请选择所属销售');
    }
  }

}

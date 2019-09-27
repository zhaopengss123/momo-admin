import { NzMessageService, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { AppointComponent } from '../../appoint/appoint.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.less']
})
export class TransactionComponent implements OnInit {

  @Input() studentInfo: any = {};

  @Input() cardList: any[] = [];

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private drawerRef: NzDrawerRef,
    private drawer: NzDrawerService
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

  
  /* -------------- 点击预约校验 -------------- */
  openCard(cardInfo) {
    let hasInUserCard = this.cardList.some(c => c.status === 0);
    if (hasInUserCard) {
      this.message.warning('还有卡未使用完');
    } else {
      this.http.post('/student/studentInfoIsComplete', {
        paramJson: JSON.stringify({
          studentId: this.studentInfo.studentId, buttonName: 'isReserve'
        }),
      }).then(res => {
        if (res.result == 1000) {
          this.appoint({ studentInfo: this.studentInfo, cardInfo});
        } else {
          this.message.warning(res.message);
        }
      });
    }
  }
  @DrawerCreate({ content: AppointComponent, width: 1148, closable: false }) appoint: ({ studentInfo: any, cardInfo }) => void;

}

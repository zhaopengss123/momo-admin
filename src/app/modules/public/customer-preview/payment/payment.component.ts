import { DetailedComponent } from './detailed/detailed.component';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.less']
})
export class PaymentComponent implements OnInit {

  @ViewChild('cardTypeTable') cardTypeTable: TableComponent;

  @Input() id: number;

  cardTypeCategoryId = null;
  serviceTypeCategoryId = null

  cardTypeList: any[] = [];
  serviceList: any[] = [];

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef,
    private drawer: NzDrawerService
  ) { 
    this.http.post('/commodity/card/getCardTypeCategory').then(res => this.cardTypeList = res.data.list);
    this.http.post('/commodity/service/showServiceTypeCategory').then(res => this.serviceList = res.data.list)
  }

  studentInfo: any = {};
  ngOnInit() {
    this.http.post('/student/getNewStudent', { id: this.id }).then(res => this.studentInfo = res.data.studentInfo);
  }

  showPayment: boolean;

  isInit = true;
  cardInfo = {};
  serviceInfo = {};
  select(e, type) {
    this.showPayment = false;
    this.cardInfo = {};
    this.serviceInfo = {};
    setTimeout(() => {
      this.isInit = false;
      this.showPayment = true;
      this[type] = e;
    }, 300);
  }

  @DrawerClose() close: (bool?) => void;

}

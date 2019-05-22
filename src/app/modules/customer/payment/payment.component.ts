import { DetailedComponent } from './detailed/detailed.component';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';

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

  ngOnInit() {
  }

  select(e, type) {
    if (e[0]) {
      let params = { id: this.id };
      params[type] = e[0];
      this.drawer.create({
        nzTitle: '结算清单',
        nzWidth: 420,
        nzBodyStyle: { 'padding-bottom': '40px' },
        nzContent: DetailedComponent,
        nzContentParams: params
      }).afterClose.subscribe(res => res && this.drawerRef.close(res))
    }
  }

}

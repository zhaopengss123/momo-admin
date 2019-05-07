import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { UpdateComponent } from './update/update.component';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageComponent;

  queryNode: QueryNode[] = [
    {
      label       : '通道名',
      key         : 'placeName',
      type        : 'input'
    },
    {
      label       : '设备号',
      key         : 'serialNum',
      type        : 'input'
    },
    {
      label       : '区域属性',
      key         : 'publicPlaceFlag',
      type        : 'select',
      options     : [ { name: '公共区', id: 1 }, { name: '非公共区', id: 0 } ]
    },
    {
      label       : '班级',
      key         : 'classId',
      type        : 'select',
      optionKey   : { label: 'className', value: 'id' },
      optionsUrl  : '/message/listClassMessage'
    }
  ];

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) { }

  ngOnInit() {
  }
  
  update(info = {}) {
    const drawer = this.drawer.create({
      nzWidth: 720,
      nzTitle: '监控管理',
      nzContent: UpdateComponent,
      nzContentParams: { info }
    });
    drawer.afterClose.subscribe(res => res && this.listPage.eaTable._request());
  }

  delete(ids) {
    this.http.post('/monitor/updateMonitorMessage', { paramJson: JSON.stringify({ ids, monitorStatus: 1 })}).then(res => {
      this.listPage.eaTable._request();
    })
  }

}

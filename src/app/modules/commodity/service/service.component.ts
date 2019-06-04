import { QueryNode } from '../../../ng-relax/components/query/query.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { NzMessageService, NzDrawerService } from 'ng-zorro-antd';
import { UpdateComponent } from './update/update.component';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.less']
})
export class ServiceComponent implements OnInit {

  @ViewChild('table') table: TableComponent;

  @DrawerCreate({ title: '服务', content: UpdateComponent }) update: ({ cardTypeInfo}?) => void;

  queryNode: QueryNode[] = [
    {
      label : '服务名称',
      key   : 'serviceName',
      type  : 'input'
    },
    {
      label   : '服务类型',
      key     : 'serviceTypeCategoryId',
      type    : 'tag',
      isRadio : true,
      optionsUrl: '/commodity/service/showServiceTypeCategory'
    },
    {
      label       : '总销量',
      key         : 'totalSalesVolume',
      type        : 'between',
      valueKey    : ['minCount','maxCount']
    },
    {
      label       : '售价',
      key         : 'price',
      type        : 'between',
      valueKey    : ['minPrice','maxPrice']
    }
  ]

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private drawer: NzDrawerService
  ){ }

  ngOnInit() {
  }

  change(serviceTypeId, isOnline) {
    this.http.post('/commodity/service/updateServiceTypeStatus', { paramJson: JSON.stringify({ serviceTypeId, isOnline }) }, true).then(res => this.table._request())
  }



  delete(serviceTypeId) {
    this.http.post('/commodity/service/deleteServiceType', { paramJson: JSON.stringify({ serviceTypeId }) }, true).then(res => this.table._request());
  }
}

import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { UpdateComponent } from './update/update.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent implements OnInit {

  @ViewChild('table') table: TableComponent

  queryNode: QueryNode[] = [
    {
      label       : '学籍名称',
      key         : 'cardTypeName',
      type        : 'input',
    },
    {
      label   : '学籍类型',
      key     : 'cardTypeCategoryId',
      type    : 'tag',
      isRadio : true,
      optionsUrl: '/commodity/card/getCardTypeCategory'
    },
    {
      label   : '状态',
      key     : 'isOnline',
      type    : 'tag',
      isRadio : true,
      options : [{ name: '已上架', id: 1 }, { name: '未上架', id: 0 }]
    },
    {
      label       : '总销量',
      key         : 'salesVolume',
      type        : 'between',
      valueKey    : ['minCount','maxCount'],
    },
    {
      label       : '售价',
      key         : 'price',
      type        : 'between',
      valueKey    : ['minPrice','maxPrice'],
    }
  ];

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) { }

  ngOnInit() {
  }

  @DrawerCreate({ title: '卡项信息', content: UpdateComponent }) update: ({ cardTypeInfo}?) => void;

  delete(cardTypeId) {
    this.http.post('/commodity/card/deleteCardType', { paramJson: JSON.stringify({ cardTypeId }) }, true).then(res => this.table._request());
  }

  change(cardTypeId, isOnline) {
    this.http.post('/commodity/card/updateCardTypeStatus', { paramJson: JSON.stringify({ cardTypeId, isOnline }) }, true).then(res => this.table._request())
  }

}

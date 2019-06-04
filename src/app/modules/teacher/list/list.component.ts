import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UpdateComponent } from './update/update.component';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageComponent;

  queryNode: QueryNode[] = [
    {
      label: '状态',
      key: 'status',
      type: 'select',
      default: 1,
      options: [ {name: '在校', id: 1 }, { name: '离职', id: 2 } ]
    },
    {
      label: '老师名称',
      key: 'name',
      type: 'input'
    },
    {
      label: '手机号',
      key: 'mobilePhone',
      type: 'input'     
    }
  ];

  constructor(
    private drawer: NzDrawerService
  ) { }

  ngOnInit() {}

  @DrawerCreate({ width: 720, title: '老师信息', content: UpdateComponent }) update: ({ id: number }?) => void;

}

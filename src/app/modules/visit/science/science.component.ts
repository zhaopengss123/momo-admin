import { Component, OnInit, ViewChild  } from '@angular/core';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { TextUpdateComponent } from './text-update/text-update.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';
@Component({
  selector: 'app-science',
  templateUrl: './science.component.html',
  styleUrls: ['./science.component.less']
})
export class ScienceComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageComponent;

  @ViewChild('EaTable') table;

  queryNode: QueryNode[] = [
    {
      label: '关键词',
      key: 'queryContent',
      type: 'input',
      placeholder: '根据学号、姓名、手机号查询'
    },
    {
      label: '分类',
      key: 'classificationId',
      type: 'select',
      optionKey: { label: 'classificationName', value: 'id' }
    },
    {
      label: '适用月龄',
      key: 'memberFromId',
      type: 'select',
      optionKey: { label: 'monthOldName', value: 'id' }
    }
  ];
  tableNode = ['标题' , '分类', '适用月龄', '操作'];
  classList: any[];
  monthList: any[];
  constructor(
    private drawer: NzDrawerService,
    private http: HttpService,

  ) { 
  }

  ngOnInit() {
    this.http.post('/baiKe/classification').then(res => {
      this.classList = res.data;
      this.queryNode[1].options = res.data;
    });
    this.http.post('/baiKe/monthOld').then(res => {
      this.monthList = res.data;
      this.queryNode[2].options = res.data;
    });
  }
  addCustomers({ Info }){
      this.addCustomer({ Info });
  }
  showCustomer({ Info }){
    let sInfo = JSON.parse(JSON.stringify(Info));
    sInfo.isReadonly  = true;
    this.addCustomer({ Info: sInfo });
  }
  @DrawerCreate({ title: '文章详情', content: TextUpdateComponent }) addCustomer: ({ Info }?) => void;
}

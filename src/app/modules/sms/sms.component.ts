import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService , NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.less']
})
export class SmsComponent implements OnInit {
  @ViewChild('listPage') listPage: ListPageComponent;

  @ViewChild('EaTable') table;

  listCourseType:any[] = [];
  queryNode: QueryNode[] = [
    {
      label: '账号',
      key: 'account',
      type: 'input',
      placeholder: '请输入账号'
    },
    {
      label: '手机号',
      key: 'mobile',
      type: 'input',
      placeholder: '请输入手机号'
    },
    {
      label: '开始时间',
      type: 'datepicker',
      key: 'startTime'
    },
    {
      label: '结束时间',
      type: 'datepicker',
      key: 'endTime'
    },

  ];

  tableNode = ['手机号' , '发送内容', '发送类型', '是否模版发送', '模版名' , '短信类型', '计费', '请求状态', '说明', '发送时间  '];

  constructor() { }

  ngOnInit() { 
  }

}

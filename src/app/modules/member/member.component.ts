import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';
import { HttpService } from 'src/app/ng-relax/services/http.service';


@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.less']
})
export class MemberComponent implements OnInit {
  @ViewChild('listPage') listPage: ListPageComponent;

  @ViewChild('EaTable') table;

  listCourseType:any[] = [];
  queryNode: QueryNode[] = [
    {
      label: '用户名',
      key: 'userName',
      type: 'input',
      placeholder: '请输入用户名'
    },
    {
      label: '手机号',
      key: 'phone',
      type: 'input',
      placeholder: '请输入手机号'
    },

    {
      label: '是否可用',
      key: 'isUse',
      type: 'select',
      options : [{ name: '可用', id: 1 }, { name: '不可用', id: 0 }]
    }
  ];

  tableNode = ['用户头像','用户名', '手机号','用户性别', '国家', '省份','城市','可用状态' ,'建档时间', '更新时间','总金额','操作'];

  constructor(
    private http: HttpService,
  ) { }

  ngOnInit() {
  }
  savePrice(data){ 
    this.http.post(`/console/user/updateTotal`,{
      userId : data.id,
      userOpenId: data.openId,
      reducePrice: data.reducePrice
    },true).then(res => {
      this.table._request();
      if(res.returnCode == 'SUCCESS'){
        this.table._request();
      }
    })
  }
}

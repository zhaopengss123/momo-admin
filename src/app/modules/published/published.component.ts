import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService , NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';

@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.less']
})
export class PublishedComponent implements OnInit {
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
      label: 'openId',
      key: 'openId',
      type: 'input',
      placeholder: '请输入用户openId'
    },
    {
      label: '道具名',
      key: 'propsConfigName',
      type: 'input',
      placeholder: '请输入道具名'
    },
    {
      label: '星光',
      key: 'starlight',
      type: 'input',
      placeholder: '请输入星光'
    },
    {
      label: '标题',
      key: 'titleDescribe',
      type: 'input',
      placeholder: '请输入标题'
    },
    {
      label: '单价',
      key: 'unitPrice',
      type: 'input',
      placeholder: '请输入单价'
    },
    {
      label: '类型',
      key: 'releaseType',
      type: 'select',
      options : [{ name: '售卖', id: 1 }, { name: '求购', id: 0 }]
    },
    {
      label: '特权',
      key: 'privilege',
      type: 'select',
      options : [{ name: '特权', id: 1 }, { name: '非特权', id: 0 }]
    },
    {
      label: '支付状态',
      key: 'payStatus',
      type: 'select',
      options : [{ name: '支付成功', id: 1 }, { name: '待支付', id: 0 }, { name: '已关闭', id: 2 }]
    },
    {
      label: '发布状态',
      key: 'releaseStatus',
      type: 'select',
      options : [{ name: '上架', id: 1 }, { name: '下架', id: 0 }, { name: '待付款', id: 2 }, { name: '交易关闭', id: 3 }, { name: '待审核', id: 4 }, { name: '审核通过', id: 5 }, { name: '审核失败', id: 6 }]
    },
    {
      label: '开始时间',
      type: 'datepicker',
      key: 'startCreateTime'
    },
    {
      label: '结束时间',
      type: 'datepicker',
      key: 'endCreateTime'
    },
  ];

  tableNode = ['用户头像', '用户名', '道具名', '自行上传图片' , '标题', '单价', '原始库存', '剩余库存', '发布类型', '服务费', '保证金', '总金额', '支付状态', '超时时间', '支付时间  ', '支付金额', '发布状态', '下架时间  ', '发布时间', '更新时间','状态'];

  constructor() { }

  ngOnInit() { 
  }

}

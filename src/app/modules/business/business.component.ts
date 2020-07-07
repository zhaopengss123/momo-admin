import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService , NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.less']
})
export class BusinessComponent implements OnInit {
  @ViewChild('listPage') listPage: ListPageComponent;

  @ViewChild('EaTable') table;

  listCourseType:any[] = [];
  queryNode: QueryNode[] = [
    {
      label: '用户昵称',
      key: 'userName',
      type: 'input',
      placeholder: '请输入用户昵称'
    },
    {
      label: 'openId',
      key: 'openId',
      type: 'input',
      placeholder: '请输入openId'
    },
    {
      label: '手机号',
      key: 'phone',
      type: 'input',
      placeholder: '请输入手机号'
    },

    {
      label: '交易类型',
      key: 'transactionType',
      type: 'select',
      options : [{ name: '发布道具支付', id: 0 }, { name: '购买发布道具', id: 1 }, { name: '取消订单结算', id: 2 }, { name: '发布道具手动下架结算', id: 3 }, { name: '未支付售卖下架', id: 4 }, { name: '未支付求购下架 ', id: 5 }, { name: '售卖求购未支付，求购下架', id: 6 }, { name: '售卖道具结算', id: 7 }, { name: '提现', id: 8 }]
    },
    {
      label: '交易开始时间',
      type: 'datepicker',
      key: 'startTransactionTime'
    },
    { 
      label: '交易结束时间',
      type: 'datepicker',
      key: 'endTransactionTime'
    },
  ];

  tableNode = ['用户头像' , '用户昵称', '手机号', '道具名', '订单号' , '发布道具订单号', '提现订单号', '金额类型', '原始总金额', '金额', '当前总金额','说明公式',  '交易类型','交易状态 ', '交易说明', '系统说明', '创建时间  ', '更新时间'];

  constructor() { }

  ngOnInit() { 
  }

}

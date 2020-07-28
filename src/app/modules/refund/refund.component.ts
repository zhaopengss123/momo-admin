import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.less']
})
export class RefundComponent implements OnInit {
  @ViewChild('listPage') listPage: ListPageComponent;

  @ViewChild('EaTable') table;

  listCourseType:any[] = [];
  queryNode: QueryNode[] = [
    {
      label: '订单号',
      key: 'orderNo',
      type: 'input',
      placeholder: '请输入订单号'
    },
    {
      label: '退款订单号',
      key: 'outRefundNo',
      type: 'input',
      placeholder: '请输入退款订单号'
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

  tableNode = ['微信订单号','支付订单号', '退款单号','订单总金额', '退款总金额', '退款原因','业务结果','退款时间'];

  constructor(
  ) { }

  ngOnInit() {
  }

}
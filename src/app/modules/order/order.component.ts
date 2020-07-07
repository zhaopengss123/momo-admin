import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService , NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnInit {
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
      label: '道具名',
      key: 'propsConfigName',
      type: 'input',
      placeholder: '请输入道具名'
    },
    {
      label: '卖家用户名',
      key: 'sellUserName',
      type: 'input',
      placeholder: '请输入卖家用户名'
    },
    {
      label: '买家用户名',
      key: 'buyUserName',
      type: 'input',
      placeholder: '请输入买家用户名'
    },
    {
      label: '卖家openId',
      key: 'sellOpenId',
      type: 'input',
      placeholder: '请输入卖家openId'
    },
    {
      label: '买家openId',
      key: 'buyOpenId',
      type: 'input',
      placeholder: '请输入买家openId'
    },
    {
      label: '单价',
      key: 'unitPrice',
      type: 'input',
      placeholder: '请输入单价'
    },
    {
      label: '订单状态',
      key: 'orderStatus',
      type: 'select',
      options : [{ name: '待付款', id: 1 }, { name: '待发货', id: 3 }, { name: '已发货', id: 4 }, { name: '待确认', id: 5 }, { name: '交易成功', id: 6 }, { name: '交易关闭', id: 7 }, { name: '申诉中', id: 8 }, { name: '申诉成功', id: 9 }, { name: '申述失败', id: 10 }]
    }
  ];

  tableNode = [ '订单号', '道具图片' , '道具名', '用户上传图片', '类型' , '售卖者', '购买者', '单价', '购买数', '服务费', '保证金', '总金额', '订单状态', '说明', '支付状态', '支付超时时间  ', '支付时间  ', '支付金额', '申诉时间','申诉结束时间','申诉原因','操作'];

  constructor(
    private http: HttpService,
  ) { }

  ngOnInit() { 
  }
  updateOrderAppeal(data){
      this.http.post(`/console/propsOrder/updateOrderAppeal`,{
        orderId: data.id,
        orderNo: data.orderNo
      },true).then(res => {
        if(res.returnCode == "SUCCESS"){
          this.table._request();
        }
      });
  }

}

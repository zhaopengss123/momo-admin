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

  //编辑回显数据
  drawerData = {}; 

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
      options : [
        {
          name : '游泳',
          id   : 1
        },
        {
          name : '日托',
          id   : 2
        }
      ] 
    },
    {
      label       : '总销量',
      key         : 'totalSalesVolume',
      type        : 'between',
      valueKey    : ['minCount','maxCount'],
      placeholder : ['最小值','最大值']
    },
    {
      label       : '售价',
      key         : 'price',
      type        : 'between',
      valueKey    : ['minPrice','maxPrice'],
      placeholder : ['最小值','最大值']
    }
  ]

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private drawer: NzDrawerService
    ){
      
    }

  ngOnInit() {
    this.http.post('/commodity/service/showServiceTypeCategory').then( res => {
      this.queryNode[1].options = res.data.list;
    })
  }

  /*-------------- 获取服务类型列表数据 --------------*/
  query(paramJson){
    this.http.post('/commodity/service/serviceTypeList', { paramJson: JSON.stringify(paramJson) }).then(res => {
    })
  }

  /*-------------- 查询条件表单提交按钮 --------------*/
  submit(ev) {
    console.log(ev);
  }

  /*-------------- 上架功能 --------------*/
  upperShelf(id) {
    var paramJson = {
      "serviceTypeId" : id, //服务Id
      "isOnline"      : 1   //是否上架 1为上架
    }
    this.http.post('/commodity/service/updateServiceTypeStatus', {paramJson : JSON.stringify(paramJson)}).then( res => {
      if (res.result == 1000) {
        this.message.create('success', '已上架');
        this.table._request();
      }
    })
  }

  /*-------------- 下架功能 --------------*/
  lowerShelf(id) {
    var paramJson = {
      "serviceTypeId" : id, //服务Id
      "isOnline"      : 0   //是否上架 1为上架
    }
    this.http.post('/commodity/service/updateServiceTypeStatus', {paramJson : JSON.stringify(paramJson)}).then( res => {
      if (res.result == 1000) {
        this.message.create('success', '已下架');
        this.table._request();
      }
    })
  }

  /*-------------- 删除功能 --------------*/
  delete(data) {
    if (data.count != 0) {
      this.message.create('warning', '该服务已被使用，不可删除！');
      return;
    }
    var paramJson = {
      "serviceTypeId" : data.serviceTypeId
    }
    //删除
    this.http.post('/commodity/service/deleteServiceType', {paramJson : JSON.stringify(paramJson)}).then( res => {
      if (res.result == 1000) {
        this.message.create('success', '删除成功');
        this.table._request();
      }
    })
    
  }

}

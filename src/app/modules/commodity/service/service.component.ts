import { QueryNode } from '../../../ng-relax/components/query/query.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { isTemplateRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.less']
})
export class ServiceComponent implements OnInit {

  @ViewChild('table') table: TableComponent;

  formModel: FormGroup

  optionList = [];//回显服务类型展示数据

  /*-------------- 抽屉 --------------*/
  visible = false;
  childrenVisible = false;

  vegetables = ['asparagus', 'bamboo', 'potato', 'carrot', 'cilantro', 'potato', 'eggplant'];

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
      key     : 'serviceType',
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
      placeholder : ['最小值','最大值'],
      isHide      : true
    },
    {
      label       : '售价',
      key         : 'price',
      type        : 'between',
      valueKey    : ['minPrice','maxPrice'],
      placeholder : ['最小值','最大值'],
      isHide      : true
    }
  ]

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder()
    ){
      this.formModel = this.fb.group({
        selectedVal    : [1],
        name           : [, [Validators.required]],
        price          : [, [Validators.required]],
        lowestDiscount : [, [Validators.required]],
        description    : [, [Validators.required]]
      }) 
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
      this.table._request();
    })
  }

  /*-------------- 下架功能 --------------*/
  lowerShelf(id) {
    var paramJson = {
      "serviceTypeId" : id, //服务Id
      "isOnline"      : 0   //是否上架 1为上架
    }
    this.http.post('/commodity/service/updateServiceTypeStatus', {paramJson : JSON.stringify(paramJson)}).then( res => {
      this.table._request();
    })
  }

  /*-------------- 删除功能 --------------*/
  delete(id) {
    var paramJson = {
      "serviceTypeId" : id
    }
    var flag;
    flag = confirm('您确定要删除该服务吗？')
    if(flag){
      //删除
      this.http.post('/commodity/service/deleteServiceType', {paramJson : JSON.stringify(paramJson)}).then( res => {
        this.table._request();
      })
    }
  }

  /*-------------- 添加服务提交按钮 --------------*/
  addSubmit(type) {
    if(this.formModel['invalid']){
      for (let i in this.formModel['controls']) {
        this.formModel['controls'][i].markAsDirty();
        this.formModel['controls'][i].updateValueAndValidity();
      }
    }else{
      var str = this.formModel.value['description'];
      str = str.substr(3,str.length-7);
      var paramJson = {
        "isOnline"              : type || this.drawerData['isOnline'] || 0, //是否上线
        "lowestDiscount"        : this.formModel.value['lowestDiscount'],   //最低折扣
        "price"                 : this.formModel.value['price'],            //售价
        "serviceDesc"           : str,                                      //服务描述
        "serviceName"           : this.formModel.value['name'],             //服务名称
        "serviceTypeCategoryId" : this.formModel.value['selectedVal'],      //服务类型分类ID
        "serviceTypeId"         : this.drawerData['serviceTypeId'],         //服务类型id
      }
      if(!paramJson.serviceTypeId){delete paramJson.serviceTypeId};
      this.http.post('/commodity/service/saveService', {paramJson : JSON.stringify(paramJson)}).then( res => {
        this.visible = false;
        this.table._request();
      })
    }
  }

  /*-------------- 抽屉的那些方法 --------------*/
  open(data = null): void {
    if(!data){
      this.formModel.patchValue({
        selectedVal    : 1,
        name           : '',
        price          : '',
        lowestDiscount : '',
        description    : ''
      });
      this.http.post('/commodity/service/showServiceTypeCategory').then( res => {
        this.optionList = res.data.list;
      })
    }
    if(data){
      //回显数据
      this.drawerData = data;
      this.formModel.patchValue({
        name: this.drawerData['serviceName'],
        price: this.drawerData['price'],
        lowestDiscount: this.drawerData['lowestDiscount'],
        description: this.drawerData['description']
      });
      //列表信息展示
      this.http.post('/commodity/service/showServiceTypeCategory').then( res => {
        this.optionList = res.data.list;
        for(let item of this.optionList){
          if(item.serviceTypeCategoryName == data.serviceTypeCategoryName){
            this.formModel.patchValue({
              selectedVal : item.serviceTypeCategoryId
            })
          } 
        }
      })
    }
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  openChildren(): void {
    this.childrenVisible = true;
  }

  closeChildren(): void {
    this.childrenVisible = false;
  }

}

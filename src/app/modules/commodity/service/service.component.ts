import { QueryNode } from '../../../ng-relax/components/query/query.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.less']
})
export class ServiceComponent implements OnInit {

  @ViewChild('table') table: TableComponent;

  formModel: FormGroup

  optionList = [];//回显服务类型展示数据

  isEdit = false;//是不是编辑

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
    private fb: FormBuilder = new FormBuilder(),
    private message: NzMessageService
    ){
      this.formModel = this.fb.group({
        selectedVal    : [1, Validators.required],
        name           : [, [Validators.required, this.nameLengthValidator]],
        price          : [, [Validators.required, this.priceValidator]],      //售价
        lowestDiscount : [, [Validators.required, this.discountValidator]],   //最低折扣
        introduce      : [, [Validators.required]]
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

  /*-------------- 添加服务提交按钮 --------------*/
  addSubmit(type) {
    if(this.formModel['invalid']){
      for (let i in this.formModel['controls']) {
        this.formModel['controls'][i].markAsDirty();
        this.formModel['controls'][i].updateValueAndValidity();
      }
    }else{
      var str = this.formModel.value['introduce'];
      str = str.substr(3,str.length-7);
      var paramJson = {
        "isOnline"              : type || this.drawerData['isOnline'] || 0,  //是否上线
        "lowestDiscount"        : this.formModel.value['lowestDiscount']/10, //最低折扣
        "price"                 : this.formModel.value['price'],             //售价
        "serviceDesc"           : str,                                       //服务描述
        "serviceName"           : this.formModel.value['name'],              //服务名称
        "serviceTypeCategoryId" : this.formModel.value['selectedVal'],       //服务类型分类ID
        "serviceTypeId"         : this.drawerData['serviceTypeId'],          //服务类型id
      }
      if(!paramJson.serviceTypeId){delete paramJson.serviceTypeId};
      //新增不传id
      if (!this.isEdit) { delete paramJson.serviceTypeId; }
      this.http.post('/commodity/service/saveService', {paramJson : JSON.stringify(paramJson)}).then( res => {
        if (res.result == 1000) {
          this.message.create('success', '操作成功');
          this.visible = false;
          this.table._request();
        }
      })
    }
  }
  
  /*-------------- 抽屉的那些方法 --------------*/
  open(data = null): void {
    
    if (data) {
      this.isEdit = true;//编辑
    } else {
      this.isEdit = false;//新增
    }

    //重置表单
    for (let i in this.formModel['controls']) {
      this.formModel['controls'][i].reset();
      this.formModel['controls'][i].updateValueAndValidity();
    }

    if(!data){
      this.formModel.patchValue({
        selectedVal    : 1,
        name           : '',
        price          : '',
        lowestDiscount : '',
        introduce      : ''
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
        introduce: this.drawerData['serviceDesc']
      });
      //列表信息展示
      this.http.post('/commodity/service/showServiceTypeCategory').then( res => {
        this.optionList = res.data.list;
        for(let item of this.optionList){
          if(item.name == data.serviceTypeCategoryName){
            this.formModel.patchValue({
              selectedVal : parseInt(item.id)
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

  /*-------------- 长度必须大于2小于等于30(名称) --------------*/
  nameLengthValidator(val: FormControl) {
    var valid;
    if (val.value != '') {
      var str = String(val.value);
      if (str.length >= 2 && str.length <= 30) {
        valid = true;
      }
    }
    return valid ? null : {info:'名称长度必须为2-30个字符'}
  }

  /*-------------- 大于0的数字最多两位小数(售价) --------------*/
  priceValidator(num: FormControl) {
    var valid;
    var reg = /^[0-9]+(.[0-9]{1,2})?$/;
    if (reg.test(num.value) && num.value > 0) {
      valid = true;
    }
    return valid ? null : {info:'请输入正确的售价'}
  }

  /*-------------- 不允许折扣大于10小于0(最低折扣) --------------*/
  discountValidator(num: FormControl):any {
    var valid;
    var reg = /^[0-9]+(.[0-9]{1,2})?$/;
    if (num.value >= 0 && num.value <= 10 && reg.test(num.value) ) {
      valid = true;
    }
    return valid ? null : {num:true}
  }

}

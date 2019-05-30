import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, AbstractControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-student-status',
  templateUrl: './student-status.component.html',
  styleUrls: ['./student-status.component.less'],
})
export class StudentStatusComponent implements OnInit {
  @ViewChild('table') table: TableComponent;
  /* 选项 */
  queryNode: QueryNode[] = [
    {
      label       : '学籍项名称',
      key         : 'cardTypeName',
      type        : 'input',
      placeholder : '请输入学籍名称'
    },
    {
      label   : '学籍类型',
      key     : 'cardTypeCategoryId',
      type    : 'tag',
      isRadio : true,
      options : [
        {
          name : '次卡',
          id   : 1
        },
        {
          name : '月卡',
          id   : 2
        }
      ]
    },
    {
      label       : '总销量',
      key         : 'salesVolume',
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

  isEdit = false;
  radioValue = 1;
  drawerFormModel: FormGroup;
  monthFormModel: FormGroup;
  dataSet = [];
  private isShrink: boolean = true;
  shrinkText = '收起选项    ∧';
  cardTypeList = [];
  sievesResult = [];
  salesMinValue:number; //总销量最小值
  salesMaxValue:number; //总销量最大值
  priceMinValue:number; //售价最小值
  priceMaxValue:number; //售价最大值
  flag = '1';           //切换flag值
  dataList = [];        //编辑回显数据存储用于提交ID
  openIsSelect = false; //是否可以切换
  contentList = [
    {id:1, name:1},
    {id:2, name:2},
    {id:3, name:3},
    {id:4, name:4},
    {id:5, name:5},
    {id:6, name:6},
    {id:7, name:7},
    {id:8, name:8},
    {id:9, name:9},
    {id:10, name:10},
    {id:11, name:11},
    {id:12, name:12},
    {id:13, name:13},
    {id:14, name:14},
    {id:15, name:15},
    {id:16, name:16},
    {id:17, name:17},
    {id:18, name:18},
    {id:19, name:19},
    {id:20, name:20},
    {id:21, name:21},
    {id:22, name:22},
    {id:23, name:23},
    {id:24, name:24},
    {id:25, name:25},
    {id:26, name:26},
    {id:27, name:27},
    {id:28, name:28},
    {id:29, name:29},
    {id:30, name:30},
    {id:31, name:31},
    {id:32, name:32},
    {id:33, name:33},
    {id:34, name:34},
    {id:35, name:35},
    {id:36, name:36},
  ];     //内容列表

  /*-------------- 分页 --------------*/
  queryParams: any = {
    pageNo: 1,
    totalCount: 0
  };

  loadData(pi: number): void {
    this.queryParams.pageNo = pi;
  }

  /*-------------- 抽屉 --------------*/
  visible = false;
  childrenVisible = false;

  vegetables = ['asparagus', 'bamboo', 'potato', 'carrot', 'cilantro', 'potato', 'eggplant'];

  open(data = null): void {
    if (data) {
      this.openIsSelect = false;
      this.isEdit = true;//编辑
    } else {
      this.openIsSelect = true;
      this.isEdit = false;//新增
    }
    //重置表单
    for (let i in this.monthFormModel['controls']) {
      this.monthFormModel['controls'][i].reset();
      this.monthFormModel['controls'][i].updateValueAndValidity();
    }
    for (let i in this.drawerFormModel['controls']) {
      this.drawerFormModel['controls'][i].reset();
      this.drawerFormModel['controls'][i].updateValueAndValidity();
    }

    //是否是编辑
    if(!data){
      this.drawerFormModel.patchValue({
        studentStatusType : '1', //卡类型
        name              : '',  //卡名称
        days              : '',  //天数
        price             : '',  //售价
        discount          : '',  //最低折扣
        introduce         : ''   //卡描述
      });
      this.monthFormModel.patchValue({
        studentStatusType : '1', //卡类型
        name              : '',  //卡名称
        selectedValue     : 1,   //月数
        price             : '',  //售价
        discount          : '',  //最低折扣
        introduce         : ''   //卡描述
      })
    }
    if(data){
      this.flag = data.type+'';
      var month = parseInt(data.month);
      if (this.flag == '1') {
        //编辑功能回显
        this.drawerFormModel.patchValue({
          studentStatusType : data.type + '',      //卡类型
          name              : data.cardTypeName,   //卡名称
          days              : data.day,            //天数
          price             : data.price,          //售价
          discount          : data.lowestDiscount, //最低折扣
          introduce         : data.cardDesc        //卡描述
        })
      } else if (this.flag == '2') {
        //编辑功能回显
        this.monthFormModel.patchValue({
          studentStatusType : data.type + '',      //卡类型
          name              : data.cardTypeName,   //卡名称
          selectedValue     : month || 1,          //月数
          price             : data.price,          //售价
          discount          : data.lowestDiscount, //最低折扣
          introduce         : data.cardDesc        //卡描述
        })
      }
      this.dataList = data;
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

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private message: NzMessageService
  ){
  }

  ngOnInit(): void {
    /*-------------- 有限次学籍 --------------*/
    this.drawerFormModel = this.fb.group({
      studentStatusType : [''],                                                 //学籍类型
      name              : [, [Validators.required, this.nameLengthValidator]],  //名称
      days              : [, [Validators.required, this.positiveInteger]],      //天数(有限次)
      price             : [, [Validators.required, this.priceValidator]],       //售价
      discount          : [, [Validators.required, this.discountValidator]],    //允许最低折扣
      introduce         : [, [Validators.required]]                             //学籍项介绍
    })
    /*-------------- 不限次学籍 --------------*/
    this.monthFormModel = this.fb.group({
      studentStatusType : [''],                                                 //学籍类型
      selectedValue     : [1, [Validators.required]],                           //内容(不限次)
      name              : [, [Validators.required, this.nameLengthValidator]],  //名称
      price             : [, [Validators.required, this.priceValidator]],       //售价
      discount          : [, [Validators.required, this.discountValidator]],    //允许最低折扣
      introduce         : [, [Validators.required]]                             //学籍项介绍
    })
    //动态显示查询条件
    this.http.post('/commodity/card/getCardTypeCategory').then( res => {
      this.queryNode[1].options = res.data.list
    })
  }

  /*-------------- 点击学籍类型根据条件查询 --------------*/
  tabSieves(condition) {
    var conditionText = '';
    var temp = [];
    switch(condition){
      case 1:
        conditionText = '全部';
        break;
      case 2:
        conditionText = '次卡';
        break;
      case 3:
        conditionText = '月卡';
        break;
    }
    if(conditionText == '全部'){
      this.sievesResult = this.cardTypeList;
      return;
    }
    for(var item of this.cardTypeList){
      if(item.cardTypeCategoryName == conditionText){
        temp.push(item)
      }
    }
    //筛选结果
    this.sievesResult = temp;
  }

  /*-------------- 删除 --------------*/
  delete(data) {
    if (data.count != 0) {
      this.message.create('warning', '该学籍已被使用，不可删除！');
      return;
    }
    var paramJson = {
      "cardTypeId" : data.cardTypeId
    }
    this.http.post('/commodity/card/deleteCardType', {paramJson : JSON.stringify(paramJson)}).then( res => {
      if (res.result == 1000) {
        this.message.create('success', '删除成功');
        this.table._request();
      }
    })
  }

  /*-------------- 提交按钮 --------------*/
  drawerSubmit(type) {

    var cardTypeCategoryId; //cardTypeCategoryId

    //调取接口学籍类型列表
    this.http.post('/commodity/card/getCardTypeCategory').then(res => {
      //有限次学籍
      if(this.flag == '1'){
        if(this.drawerFormModel['invalid']){
          for (let i in this.drawerFormModel['controls']) {
            this.drawerFormModel['controls'][i].markAsDirty();
            this.drawerFormModel['controls'][i].updateValueAndValidity();
          }
        }else{
          //有限次学籍(次卡)
          for (let item of res.data.list) {
            if (item.name == '次卡') {
              cardTypeCategoryId = item.id;
            }
          }
          var str = this.drawerFormModel.value['introduce'];
          str = str.substr(3,str.length-7);
          var param = {
            "cardDesc"           :  str,                                           //卡描述
            "cardTypeName"       :  this.drawerFormModel.value['name'],            //卡名称
            "lowestDiscount"     :  this.drawerFormModel.value['discount']/10,     //最低折扣
            "price"              :  this.drawerFormModel.value['price'],           //售价
            "isOnline"           :  type || this.drawerFormModel['isOnline'] || 0, //是否上线
            "type"               :  1,                                             //卡类型 1卡次
            "cardTypeId"         :  this.dataList['cardTypeId'],                   //Id
            "day"                :  this.drawerFormModel.value['days'],            //天数
            "cardTypeCategoryId" :  cardTypeCategoryId                             //另一个卡类型ID
          }
          //新增不传id
          if (!this.isEdit) { delete param.cardTypeId; }
          this.http.post('/commodity/card/saveCard', {paramJson : JSON.stringify(param)}).then( res => {
            if (res.result == 1000) {
              this.message.create('success', '操作成功');
              this.visible = false;
              this.table._request();
            }
          })
        }
      }else if(this.flag == '2'){
        if(this.monthFormModel['invalid']){
          for (let i in this.monthFormModel['controls']) {
            this.monthFormModel['controls'][i].markAsDirty();
            this.monthFormModel['controls'][i].updateValueAndValidity();
          }
        }else{
          //不限次学籍(月卡)
          for (let item of res.data.list) {
            if (item.name == '月卡') {
              cardTypeCategoryId = item.id;
            }
          }
          var str = this.monthFormModel.value['introduce'];
          str = str.substr(3,str.length-7);
          var paramJson = {
            "cardDesc"           :  str,                                          //卡描述
            "cardTypeName"       :  this.monthFormModel.value['name'],            //卡名称
            "lowestDiscount"     :  this.monthFormModel.value['discount']/10,     //最低折扣
            "price"              :  this.monthFormModel.value['price'],           //售价
            "isOnline"           :  type || this.monthFormModel['isOnline'] || 0, //是否上线
            "type"               :  2,                                            //卡类型 2天类型
            "cardTypeId"         :  this.dataList['cardTypeId'],                  //Id
            "month"              :  this.monthFormModel.value['selectedValue'],    //内容(月数)
            "cardTypeCategoryId" :  cardTypeCategoryId                            //另一个卡类型ID
          }
          //新增不传id
          if (!this.isEdit) { delete paramJson.cardTypeId; }
          this.http.post('/commodity/card/saveCard', {paramJson : JSON.stringify(paramJson)}).then( res => {
            if (res.result == 1000) {
              this.message.create('success', '操作成功');
              this.visible = false;
              this.table._request();
            }
          })
        }
      }

    })
    
  }

  /*-------------- 上架 --------------*/
  upperShelf(id) {
    var paramJson = {
      "isOnline"   : 1, //上架
      "cardTypeId" : id //卡类型id
    }
    this.http.post('/commodity/card/updateCardTypeStatus', {paramJson : JSON.stringify(paramJson)}).then( res => {
      if (res.result == 1000) {
        this.message.create('success', '已上架');
        this.table._request();
      }
    })
  }

  /*-------------- 下架 --------------*/
  lowerShelf(id) {
    var paramJson = {
      "isOnline"   : 0, //下架
      "cardTypeId" : id //卡类型id
    }
    this.http.post('/commodity/card/updateCardTypeStatus', {paramJson : JSON.stringify(paramJson)}).then( res => {
      if (res.result == 1000) {
        this.message.create('success', '已下架');
        this.table._request();
      }
    })
  }

  /*-------------- 切换学籍类型 --------------*/
  switchFlag(flag) {
    if (this.openIsSelect) {
      //将数据存起来
      var drawerFormModelTemp = {
        name              : this.drawerFormModel.get('name').value,     //名称
        days              : this.drawerFormModel.get('days').value,     //天数(有限次)
        price             : this.drawerFormModel.get('price').value,    //售价
        discount          : this.drawerFormModel.get('discount').value, //允许最低折扣
        introduce         : this.drawerFormModel.get('introduce').value //学籍项介绍
      }
      
      var monthFormModelTemp = {
        selectedValue     : this.monthFormModel.get('selectedValue').value || 1, //内容(不限次)
        name              : this.monthFormModel.get('name').value,               //名称
        price             : this.monthFormModel.get('price').value,              //售价
        discount          : this.monthFormModel.get('discount').value,           //允许最低折扣
        introduce         : this.monthFormModel.get('introduce').value           //学籍项介绍
      }
      //重置数据
      for (let i in this.monthFormModel['controls']) {
        this.monthFormModel['controls'][i].reset();
        this.monthFormModel['controls'][i].updateValueAndValidity();
      }
      for (let i in this.drawerFormModel['controls']) {
        this.drawerFormModel['controls'][i].reset();
        this.drawerFormModel['controls'][i].updateValueAndValidity();
      }
      //还原数据并切换tab(解决表单内容不填切换后文本框变红bug)
      this.flag = flag+'';
      this.drawerFormModel.patchValue({
        studentStatusType : this.flag+'',
        name              : drawerFormModelTemp.name,      //名称
        days              : drawerFormModelTemp.days,      //天数(有限次)
        price             : drawerFormModelTemp.price,     //售价
        discount          : drawerFormModelTemp.discount,  //允许最低折扣
        introduce         : drawerFormModelTemp.introduce, //学籍项介绍
      })
      this.monthFormModel.patchValue({
        studentStatusType : this.flag+'',
        selectedValue     : monthFormModelTemp.selectedValue,  //名称
        name              : monthFormModelTemp.name,           //天数(有限次)
        price             : monthFormModelTemp.price,          //售价
        discount          : monthFormModelTemp.discount,       //允许最低折扣
        introduce         : monthFormModelTemp.introduce,      //学籍项介绍
      })
    }
  }

  /*-------------- 大于0的正整数(天数) --------------*/
  positiveInteger(num: FormControl) {
    var valid;
    var reg = /^[1-9]+\d*$/;
    valid = reg.test(num.value);
    return valid ? null : {info:'请输入正确的天数'}
  }

  /*-------------- 大于0的数字最多两位小数(售价) --------------*/
  priceValidator(num: FormControl) {
    var valid;
    // var reg = /^[0-9]+.?[0-9]*$/;
    var reg = /^[0-9]+(.[0-9]{1,2})?$/;
    if (reg.test(num.value) && num.value > 0) {
      valid = true;
    }
    return valid ? null : {info:'请输入正确的售价'}
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

  /*-------------- 不允许折扣大于10小于0(最低折扣) --------------*/
  discountValidator(num: FormControl):any {
    var valid;
    var reg = /^[0-9]+(.[0-9]{1})?$/;
    if (num.value >= 0 && num.value <= 10 && reg.test(num.value) ) {
      valid = true;
    }
    return valid ? null : {num:true}
  }

}

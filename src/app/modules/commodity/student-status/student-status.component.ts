import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, AbstractControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';

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
  flag = 1;             //切换flag值
  dataList = [];        //编辑回显数据存储用于提交ID
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
    console.log(pi);
    this.queryParams.pageNo = pi;
  }

  /*-------------- 抽屉 --------------*/
  visible = false;
  childrenVisible = false;

  vegetables = ['asparagus', 'bamboo', 'potato', 'carrot', 'cilantro', 'potato', 'eggplant'];

  open(data = null): void {
    if(!data){
      this.drawerFormModel.patchValue({
        studentStatusType : '1', //卡类型
        selectedValue     : 1,   //月数
        name              : '',  //卡名称
        days              : '',  //天数
        price             : '',  //售价
        discount          : '',  //最低折扣
        introduce         : ''   //卡描述
      });
    }
    if(data){
      var month = parseInt(data.month);
      //编辑功能回显
      this.drawerFormModel.patchValue({
        studentStatusType : data.type + '',      //卡类型
        name              : data.cardTypeName,   //卡名称
        selectedValue     : month,               //月数
        days              : data.day,            //天数
        price             : data.price,          //售价
        discount          : data.lowestDiscount, //最低折扣
        introduce         : data.cardDesc        //卡描述
      })
      this.dataList = data;
      this.flag = data.type;
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
    private http: HttpService
  ){
  }

  ngOnInit(): void {
    /*-------------- 有限次学籍 --------------*/
    this.drawerFormModel = this.fb.group({
      studentStatusType : [''],                      //学籍类型
      name              : [, [Validators.required]], //名称
      days              : [, [Validators.required]], //天数(有限次)
      price             : [, [Validators.required]], //售价
      discount          : [, [Validators.required]], //允许最低折扣
      introduce         : [, [Validators.required]]  //学籍项介绍
    })
    /*-------------- 不限次学籍 --------------*/
    this.monthFormModel = this.fb.group({
      studentStatusType : [''],                      //学籍类型
      selectedValue     : [1],                       //内容(不限次)
      name              : [, [Validators.required]], //名称
      price             : [, [Validators.required]], //售价
      discount          : [, [Validators.required]], //允许最低折扣
      introduce         : [, [Validators.required]]  //学籍项介绍
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
  delete(id) {
    var paramJson = {
      "cardTypeId" : id
    }
    this.http.post('/commodity/card/deleteCardType', {paramJson : JSON.stringify(paramJson)}).then( res => {
      this.table._request();
    })
  }

  /*-------------- 提交按钮 --------------*/
  drawerSubmit(type) {

    //有限次学籍
    if(this.flag == 1){
      if(this.drawerFormModel['invalid']){
        for (let i in this.drawerFormModel['controls']) {
          this.drawerFormModel['controls'][i].markAsDirty();
          this.drawerFormModel['controls'][i].updateValueAndValidity();
        }
      }else{
        //有限次学籍
        var str = this.drawerFormModel.value['introduce'];
        str = str.substr(3,str.length-7);
        var param = {
          "cardDesc"       :  str,                                           //卡描述
          "cardTypeName"   :  this.drawerFormModel.value['name'],            //卡名称
          "lowestDiscount" :  this.drawerFormModel.value['discount'],        //最低折扣
          "price"          :  this.drawerFormModel.value['price'],           //售价
          "isOnline"       :  type || this.drawerFormModel['isOnline'] || 0, //是否上线
          "type"           :  1,                                             //卡类型 1卡次
          "cardTypeId"     :  this.dataList['cardTypeId'],                   //Id
          "day"            :  this.drawerFormModel.value['days']             //天数
        }
        console.log('左边',param);
        this.http.post('/commodity/card/saveCard', {paramJson : JSON.stringify(param)}).then( res => {
          console.log(res);
          this.visible = false;
          this.table._request();
        })
      }
    }

    //不限次学籍
    if(this.flag == 2){
      if(this.monthFormModel['invalid']){
        for (let i in this.monthFormModel['controls']) {
          this.monthFormModel['controls'][i].markAsDirty();
          this.monthFormModel['controls'][i].updateValueAndValidity();
        }
      }else{
        var str = this.monthFormModel.value['introduce'];
        str = str.substr(3,str.length-7);
        var paramJson = {
          "cardDesc"       :  str,                                           //卡描述
          "cardTypeName"   :  this.monthFormModel.value['name'],            //卡名称
          "lowestDiscount" :  this.monthFormModel.value['discount'],        //最低折扣
          "price"          :  this.monthFormModel.value['price'],           //售价
          "isOnline"       :  type || this.monthFormModel['isOnline'] || 0, //是否上线
          "type"           :  2,                                             //卡类型 2天类型
          "cardTypeId"     :  this.dataList['cardTypeId'],                   //Id
          "month"          :  this.monthFormModel.value['selectedValue']    //内容(月数)
        }
        console.log('右边',paramJson);
        this.http.post('/commodity/card/saveCard', {paramJson : JSON.stringify(paramJson)}).then( res => {
          console.log(res);
          this.visible = false;
          this.table._request();
        })
      }
    }
  }

  /*-------------- 上架 --------------*/
  upperShelf(id) {
    var paramJson = {
      "isOnline"   : 1, //上架
      "cardTypeId" : id //卡类型id
    }
    this.http.post('/commodity/card/updateCardTypeStatus', {paramJson : JSON.stringify(paramJson)}).then( res => {
      this.table._request();
    })
  }

  /*-------------- 下架 --------------*/
  lowerShelf(id) {
    var paramJson = {
      "isOnline"   : 0, //下架
      "cardTypeId" : id //卡类型id
    }
    this.http.post('/commodity/card/updateCardTypeStatus', {paramJson : JSON.stringify(paramJson)}).then( res => {
      this.table._request();
    })
  }

  /*-------------- 切换学籍类型 --------------*/
  switchFlag(flag) {
    this.flag = flag;
    this.drawerFormModel.patchValue({
      studentStatusType : flag+''
    })
    this.monthFormModel.patchValue({
      studentStatusType : flag+''
    })
  }

}

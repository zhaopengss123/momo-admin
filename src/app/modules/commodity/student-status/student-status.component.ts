import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';

@Component({
  selector: 'app-student-status',
  templateUrl: './student-status.component.html',
  styleUrls: ['./student-status.component.less'],
})
export class StudentStatusComponent implements OnInit {

  xxx(param: AbstractControl):{[key:string]: any}{
    return null;
  }

  radioValue = 1;
  validateForm: FormGroup;
  dataSet = [];
  private isShrink: boolean = true;
  shrinkText = '收起选项    ∧';
  cardTypeList = [];
  sievesResult = [];

  /*-------------- 渲染数据 --------------*/
  private diyData = {
    name : '厉害的月卡111'
  }

  /*-------------- 抽屉 --------------*/
  visible = false;
  childrenVisible = false;

  vegetables = ['asparagus', 'bamboo', 'potato', 'carrot', 'cilantro', 'potato', 'eggplant'];

  open(): void {
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

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  /*-------------- 标签改单选 --------------*/
  checkChange(e: boolean): void {
    console.log(e);
  }

  /*-------------- 收起选项按钮 --------------*/
  cardShrink() {
    var shrink = document.getElementById('shrink');
    if(this.isShrink){
      shrink.style.height = '86px';
      shrink.style.overflow = 'hidden';
      shrink.style.position = 'relative';
      this.shrinkText = '展开选项    ∨';
      this.isShrink = false;
    }else if(!this.isShrink){
      shrink.style.height = 'auto';
      shrink.style.position = 'relative';
      this.shrinkText = '收起选项    ∧';
      this.isShrink = true;
    }
  }

  /*-------------- 失去焦点时进行表单校验 --------------*/
  loseFocus(val) {
      // if(!val){
      //    this.salesVolumeText = '不能为空';
      // }
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpService
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      //学籍类型
      studentStatus : this.fb.array([
        ['全部'],
        ['卡次'],
        ['月卡'],
        ['季卡'],
        ['年卡']
      ]),
      //总销量
      salesVolume : this.fb.group({
        salesMinNumber : [''],
        salesMaxNumber : ['']
      }),
      //售价
      price : this.fb.group({
        priceMinNumber : [''],
        priceMaxNumber : ['']
      })
    });

    /*-------------- 卡类型列表 --------------*/
    this.getCardTypeList();
  }

  /*-------------- 调用卡类型列表接口 --------------*/
  getCardTypeList() {
    var paramJson = {
      "pageNum"  : 1,
      "pageSize" : 10
    }
    
    this.http.post('/commodity/card/getCardTypeList', { paramJson: JSON.stringify(paramJson) }).then(res => {
      if(res.result == 1000){
        this.cardTypeList = res.data.reslut;
        this.sievesResult = res.data.reslut;
        //将01转换成已上架或未上架
        for(var item of res.data.reslut){
          item.isOnline == 1 ? item.isOnline = '已上架' : item.isOnline = '未上架'
        }
      }
    })
  }

  /*-------------- 点击学籍类型根据条件查询 --------------*/
  tabSieves(condition) {
    var conditionText = '';
    var temp = [];
    console.log(condition);
    switch(condition){
      case 1:
        conditionText = '全部';
        break;
      case 2:
        conditionText = '卡次';
        break;
      case 3:
        conditionText = '月卡';
        break;
      case 4:
        conditionText = '季卡';
        break;
      case 5:
        conditionText = '年卡'
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
    console.log(this.sievesResult);
  }

}

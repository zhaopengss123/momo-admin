import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzDrawerRef } from 'ng-zorro-antd';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { DrawerSave } from 'src/app/ng-relax/decorators/drawer/save.decorator';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

  @Input() cardTypeInfo;
  
  formGroup: FormGroup

  optionList = []

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private http: HttpService,
    private drawerRef: NzDrawerRef
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      serviceTypeId          : [],
      serviceTypeCategoryId  : [, Validators.required],
      serviceName            : [, [Validators.required, this.nameLengthValidator]],
      price                  : [, [Validators.required, this.priceValidator]],      //售价
      lowestDiscount         : [, [Validators.required, this.discountValidator]],   //最低折扣
      serviceDesc            : [, [Validators.required]],
      isOnline: [1]                                                                 //默认上架
    }) 
    //获取服务类型列表
    this.http.post('/commodity/service/showServiceTypeCategory').then(res => {
      if (res.result == 1000) {
        this.optionList = res.data.list;
      }
    })
    this.formGroup.patchValue(this.cardTypeInfo || { type: 1});
  }

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;

  @DrawerSave('/commodity/service/saveService') save: () => void;

  @DrawerClose() close: () => void;

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

  /*-------------- 不允许折扣大于1小于0(最低折扣) --------------*/
  discountValidator(num: FormControl):any {
    var valid;
    var reg = /^[0-9]+(.[0-9]{1,2})?$/;
    if (num.value >= 0 && num.value <= 1 && reg.test(num.value) ) {
      valid = true;
    }
    return valid ? null : {num:true}
  }

}

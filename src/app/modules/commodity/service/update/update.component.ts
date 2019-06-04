import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

  constructor(
    private fb: FormBuilder = new FormBuilder(),
  ) { }

  formModel: FormGroup

  ngOnInit() {
    this.formModel = this.fb.group({
      selectedVal    : [1, Validators.required],
      name           : [, [Validators.required, this.nameLengthValidator]],
      price          : [, [Validators.required, this.priceValidator]],      //售价
      lowestDiscount : [, [Validators.required, this.discountValidator]],   //最低折扣
      introduce      : [, [Validators.required]]
    }) 
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

import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.less']
})
export class DetailedComponent implements OnInit {

  @Input() id: number;

  @Input() cardInfo: any = {};

  @Input() serviceInfo: any = {};

  studentInfo: any = {};

  formInfo: any = {};

  formGroup: FormGroup;

  teacherList: any[] = [];

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe
  ) { 
    this.http.post('/student/getTeacherListByRoleId', { paramJson: JSON.stringify({roleId: 4}) }).then(res => this.teacherList = res.data.list);
  }

  preferential = 0;

  ngOnInit() {
    this.formInfo = Object.assign(this.cardInfo, this.serviceInfo);
    let controls = {
      studentId: [this.id],
      studentName: [],
      price: [this.formInfo.price],
      discount: [, [this._lowestDiscountValidator]],
      salespersonId: [, [Validators.required]],
      comment: []
    }
    if (this.formInfo.cardTypeName) {
      Object.assign(controls, {
        type: [this.formInfo.type],
        cardTypeId: [this.formInfo.cardTypeId],
        cardTypeName: [this.formInfo.cardTypeName],
        freeDay: [, [Validators.pattern(/^[1-9]\d*$/)]],
        payMethod: [1],
        studentNum: [, [Validators.required]]
      }, this.formInfo.type == 1 ? {
        effectDate: [, [Validators.required]],
        expireDate: [],
        day: [this.formInfo.day]
      } : {
        month: [this.formInfo.month]
      })
    } else {
      Object.assign(controls, {
        serviceTypeId: [this.formInfo.serviceTypeId],
        serviceTypeName: [this.formInfo.serviceName]
      })
    }
    
    this.formGroup = this.fb.group(controls);

    this.formGroup.get('discount').valueChanges.subscribe(val => {
      let discount = Number(val) ? Number(val) : 1;
      this.preferential = this.formInfo.price - this.formInfo.price * discount;
    })

    this.http.post('/student/getNewStudent', { id: this.id }).then(res => {
      this.studentInfo = res.data.studentInfo;
      this.formGroup.patchValue({ studentName: this.studentInfo.studentName });
      if (this.formInfo.cardTypeName && this.formInfo.type == 1) {
        let [y, m, d] = this.studentInfo.birthday.split('-');
        let expireDate = `${Number(y) + 4}-${Number(m) < 10 ? '0' + Number(m) : m}-${m == 2 && d == 29 ? 28 : d}`;
        this.formGroup.patchValue({ expireDate });
      }
    });
  }

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      Object.values(this.formGroup.controls).map(control => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      let url = this.formInfo.cardTypeName ? '/student/saveCard' : '/student/insertServiceConsumeRecord';
      this.saveLoading = true;
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      params.effectDate && (params.effectDate = this.format.transform(params.effectDate, 'yyyy-MM-dd'));
      Object.keys(params).map(key => { if (params[key] === null || params[key] === '') { delete params[key]; } });
      this.http.post(url, { paramJson: JSON.stringify(params) }, true).then(res => this.drawerRef.close(params.serviceTypeId ? true : { isPaymentCard: true })).catch(err => this.saveLoading = false);
    }
  }

  private _lowestDiscountValidator = (control: AbstractControl): { [key: string]: any } | null => {
    return !control.value || !(control.value + '') || ((/^[0]+(\.\d{1,2})?$/).test(control.value) || control.value == 1) && Number(control.value) >= this.formInfo.lowestDiscount ? null : { error: true };
  }

}
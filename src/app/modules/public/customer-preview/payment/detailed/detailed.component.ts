import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.less']
})
export class DetailedComponent implements OnInit {

  @Input() studentInfo: any = {};

  @Input() selectChange: Subject<any>;

  formGroup: FormGroup;

  /* 销售集合 */
  teacherList: any[] = [];

  paymentType: 'card'/* 办卡 */ | 'service'/* 服务 */ | 'deposit'/* 订金 */;

  /* 实际需缴纳金额 */
  priceTotal = 0;
  /* 优惠金额 */
  preferential = 0;
  updatePrice = 0;

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe
  ) { 
    this.http.post('/student/getCollectorAndRecommender').then(res => this.teacherList = res.data.collectorList);
  }


  cardFormInfo: any = {};

  ngOnInit() {
    this.selectChange.subscribe(res => {
      let controls = {
        studentId: [this.studentInfo.studentId],
        studentName: [this.studentInfo.studentName],
        salespersonId: [, [Validators.required]],
        comment: []
      }
      this.paymentType = res.type;
      this[`${res.type}Init`](res.data, controls);
    });
  }

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      Object.values(this.formGroup.controls).map(control => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      this.saveLoading = true;
      let url = `/student/${this.paymentType === 'card' ? 'saveCard' : this.paymentType === 'service' ? 'insertServiceConsumeRecord' : 'saveDeposit'}`;
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      params.effectDate && (params.effectDate = this.format.transform(params.effectDate, 'yyyy-MM-dd'));
      Object.keys(params).map(key => { if (params[key] === null || params[key] === '') { delete params[key]; } });
      this.http.post(url, { paramJson: JSON.stringify(params) }, true).then(res => {
        this.drawerRef.close(this.paymentType === 'service' || this.paymentType === 'deposit' ? true : { isPaymentCard: true, cardType: params.effectDate ? 1 : 2 })
      }).catch(err => this.saveLoading = false);
    }
  }

  private _lowestDiscountValidator = (lowestDiscount: number): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return !control.value || !(control.value + '') || ((/^[0]+(\.\d{1,2})?$/).test(control.value) || control.value == 1) && Number(control.value) >= lowestDiscount ? null : { error: true };
    }
  }

  cardInit(data, controls) {
    this.preferential = 0;
    this.http.post('/student/showDeposit', { paramJson: JSON.stringify({studentId: this.studentInfo.studentId}) }).then(res => this.formGroup.patchValue({ deposit: res.data.depositPrice, depositId: res.data.id }));

    this.cardFormInfo = data;
    this.priceTotal = data.price;
    Object.assign(controls, {
      type: [data.type],
      cardTypeId: [data.cardTypeId],
      cardTypeName: [data.cardTypeName],
      price: [data.price],
      discount: [, [this._lowestDiscountValidator(data.lowestDiscount)]],
      freeDay: [, [Validators.pattern(/^[1-9]\d*$/)]],
      payMethod: [1],
      studentNum: [{ value: this.studentInfo.studentNum, disabled: !!this.studentInfo.studentNum }, [Validators.required]],
      deposit: [],
      depositId: [],
      updatePrice: [, [Validators.pattern(/^\-?[0-9]+(\.\d{1,2})?$/)]]
    }, data.type == 1 ? {
      effectDate: [, [Validators.required]],
      expireDate: [],
      day: [data.day]
    } : {
      month: [data.month]
    })
    this.formGroup = this.fb.group(controls);
    this.formGroup.get('discount').valueChanges.subscribe(val => {
      let discount = Number(val) ? Number(val) : 1;
      this.preferential = data.price - data.price * discount;
    });

    this.formGroup.get('updatePrice').valueChanges.subscribe(res => this.updatePrice = res && Number(res) ? Number(res) : 0 );

    if (data.type == 1) {
      let [y, m, d] = this.studentInfo.birthday.split('-');
      let expireDate = `${Number(y) + 4}-${Number(m) < 10 ? '0' + Number(m) : m}-${m == 2 && d == 29 ? 28 : d}`;
      this.formGroup.patchValue({ expireDate });
    }
  }

  get serviceList(): FormArray { return (this.formGroup.controls['serviceList'] || new FormArray([])) as FormArray; }

  serviceInit(data, controls) {
    this.priceTotal = Number(data.price);
    Object.assign(controls, {
      serviceList: this.fb.array([])
    });
    if (!this.formGroup || !this.serviceList.controls.length) {
      this.formGroup = this.fb.group(controls);
    }
    if (this.serviceList.value.every(g => g.serviceTypeId !== data.serviceTypeId)) {
      this.serviceList.push(this.fb.group({
        price: [Number(data.price)],
        discount: [, [this._lowestDiscountValidator(data.lowestDiscount)]],
        serviceTypeId: [data.serviceTypeId],
        serviceTypeName: [data.serviceName]
      }));
      this.serviceList.controls[this.serviceList.controls.length - 1]['lowestDiscount'] = data.lowestDiscount
      let priceTotal = 0;
      this.serviceList.value.map(g => priceTotal += Number(g.price));
      this.priceTotal = priceTotal;
    }
    this.formGroup.valueChanges.subscribe(f => {
      let preferential = 0;
      f.serviceList.map(g => preferential += g.discount ? g.price - g.price * Number(g.discount) : 0);
      this.preferential = preferential;
    })
  }

  depositInit(data, controls) {
    Object.assign(controls, {
      price: [, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
    this.formGroup = this.fb.group(controls);
    this.formGroup.controls['price'].valueChanges.subscribe(p => this.priceTotal = Number(p) || 0);
  }


  deleteService(e,idx) {
    e.stopPropagation();
    this.serviceList.removeAt(idx);
  }

}
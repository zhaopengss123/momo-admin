import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { GetList } from 'src/app/ng-relax/decorators/getList.decorator';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @Input() id: number;

  formGroup: FormGroup;

  @GetList('/message/getClasses') classList: any;

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private drawerRef: NzDrawerRef<boolean>,
    private format: DatePipe,
    private message: NzMessageService
  ) {
    typeof this.classList === 'function' && this.classList();

    this.formGroup = this.fb.group({
      id: [this.id],
      headPhoto: [, [Validators.required]],
      studentName: [, [Validators.required]],
      nickName: [],
      sex: ['男'],
      birthday: [, [Validators.required]],
      classId: [, [Validators.required]],
      mobilePhone: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)]],
      email: [, [Validators.pattern(/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/)]],
      address: [],
      height: [, [Validators.pattern(/^\d+(\.\d{1,1})?$/)]],
      weight: [, [Validators.pattern(/^\d+(\.\d{1,1})?$/)]],
      headCircumference: [, [Validators.pattern(/^\d+(\.\d{1,1})?$/)]],
      channel: [, [Validators.required]],
      accountList: this.fb.array([])
    });
    this.accountList.valueChanges.subscribe(res => {
      if (this.formGroup.get('mobilePhone').invalid) {
        this.formGroup.patchValue({ mobilePhone: res[0].accountPhone })
      }
    })
  }

  get accountList() {
    return this.formGroup.get('accountList') as FormArray;
  }

  ngOnInit() {
    this.id ? this.http.post('/student/getStudent', { id: this.id }, false).then(res => {
      res.data.accountList.map(res => this.addAccount(res));
      this.formGroup.patchValue(res.data.student);
    }) : this.addAccount();
  }

  @DrawerClose() close: () => void;

  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      for (let i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
      for (let i in this.accountList.controls) {
        for (let idx in this.accountList.controls[i]['controls']) {
          this.accountList.controls[i]['controls'][idx].markAsDirty();
          this.accountList.controls[i]['controls'][idx].updateValueAndValidity();
        }
      }
    } else {
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      params.birthday = this.format.transform(params.birthday, 'yyyy-MM-dd');
      let path = params.id ? '/student/updateStudent' : '/student/saveStudent';

      let countPhone = [];
      params.accountList.map(res => countPhone.push(res.accountPhone));
      if (Array.from(new Set(countPhone)).length === params.accountList.length) {
        this.saveLoading = true;
        this.http.post(path, { paramJson: JSON.stringify(params) }).then(res => {
          this.drawerRef.close(true);
        }).catch(err => this.saveLoading = false);
      } else {
        this.message.warning('禁止填写重复的家长账号');
      }
    }
  }

  private _mobilePhoneAsyncValidator = (control: FormControl): any => {
    return Observable.create(observer => {
      let params = {
        id: this.formGroup.get('id').value,
        accountPhone: control.value
      };
      this.http.post('/student/countAccount', { paramJson: JSON.stringify(params) }, false).then(res => {
        observer.next(res.result == 1000 ? null : { error: true, duplicated: true });
        observer.complete();
      }, err => {
        observer.next(null);
        observer.complete();
      })
    })
  };

  addAccount(accountInfo: any = {}) {
    this.accountList.push(this.fb.group({
      accountPhone: [accountInfo.accountPhone || null, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)]],
      relationship: [accountInfo.relationship || null, [Validators.required]]
    }))
  }


  /* ------------ 宝宝生日禁止选择今天以后的日期 ------------ */
  _disabledDate(current: Date): boolean {
    return current && current.getTime() > Date.now();
  }

}

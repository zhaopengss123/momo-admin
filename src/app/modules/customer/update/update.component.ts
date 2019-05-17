import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

  formGroup: FormGroup;

  saveLoading: boolean;

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef,
    private fb: FormBuilder = new FormBuilder()
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      studentName: [, [Validators.required]],
      sex: ['男'],
      nickName: [, [Validators.required]],
      englishName: [],
      birthday: [, [Validators.required]],
      nation: [],
      memberFromId: [, [Validators.required]],
      recruitTeacherId: [],
      height: [],
      weight: [],
      headCircumference: [],
      headPhoto: [],
      isCases: [0],
      isAllergyHistory: [0],
      isChronicDisease: [0],
      isMedication: [0],
      isLimitActivity: [0],
      email: [],
      address: [],
      accountList: this.fb.array([])
    });
    this.addAccount();
    this.formGroup.controls['isCases'].valueChanges.subscribe(val => val ? this.formGroup.addControl('cases', this.fb.control(null, [Validators.required])) : this.formGroup.removeControl('cases'));
    this.formGroup.controls['isAllergyHistory'].valueChanges.subscribe(val => val ? this.formGroup.addControl('allergyHistory', this.fb.control(null, [Validators.required])) : this.formGroup.removeControl('allergyHistory'));
    this.formGroup.controls['isChronicDisease'].valueChanges.subscribe(val => val ? this.formGroup.addControl('chronicDisease', this.fb.control(null, [Validators.required])) : this.formGroup.removeControl('chronicDisease'));
    this.formGroup.controls['isMedication'].valueChanges.subscribe(val => val ? this.formGroup.addControl('medication', this.fb.control(null, [Validators.required])) : this.formGroup.removeControl('medication'));
    this.formGroup.controls['isLimitActivity'].valueChanges.subscribe(val => val ? this.formGroup.addControl('limitActivity', this.fb.control(null, [Validators.required])) : this.formGroup.removeControl('limitActivity'));
  }

  get accountList() { return this.formGroup.controls['accountList'] as FormArray; }

  @ControlValid() valid: (key: string, type?: string) => boolean;

  @DrawerClose() close: () => void;

  addAccount() {
    this.accountList.push(this.fb.group({
      accountName: [, [Validators.required]],
      accountPhone: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)]],
      relationship: [],
      workplace: [],
      idNumber: [],
      defaultStatus: [!this.accountList.length]
    }));
  }

  setDefault(idx) {
    this.accountList.controls.map((group, i) => i !== idx && group.patchValue({ defaultStatus: false }));
  }

  save() {
    if (this.formGroup.invalid) {
      for (let i in this.formGroup.controls) {
        Object.values(this.formGroup.controls).map(control => { control.markAsDirty(); control.updateValueAndValidity() });
      }
      for (let i in this.accountList.controls) {
        for (let j in this.accountList.controls[i]['controls']) {
          this.accountList.controls[i]['controls'][j].markAsDirty();
          this.accountList.controls[i]['controls'][j].updateValueAndValidity();
        }
      }
    } else {
      this.http.post('/student/newSaveStudent', { paramJson: JSON.stringify(this.formGroup.value) }).then(res => {
        console.log(res)
      })
    }
  }


  /* ------------ 宝宝生日禁止选择今天以后的日期 ------------ */
  _disabledDate(current: Date): boolean {
    return current && current.getTime() > Date.now();
  }
  
}

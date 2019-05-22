import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd';
import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

  @Input() id: number;

  @Input() type: string;

  formGroup: FormGroup;

  saveLoading: boolean;

  optionItem = { classList: [], memberFromList: [] };

  peopleItem = { recommender: [], collectorList: [] };

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe
  ) { 
    this.http.post('/student/getStudentListQueryCondition').then(res => this.optionItem = res.data);
    this.http.post('/student/getCollectorAndRecommender').then(res => this.peopleItem = res.data);
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      studentId: [],
      studentName: [, [Validators.required]],
      sex: ['男'],
      nickName: [, [Validators.required]],
      englishName: [],
      birthday: [, [Validators.required]],
      nation: [],
      classId: [, this.type && this.type === 'isReserve' ? [Validators.required] : []],
      memberFromId: [, [Validators.required]],
      recruitTeacherId: [],
      height: [],
      weight: [],
      headCircumference: [],
      headPhoto: [],
      isCases: [0],
      isAllergyHistory: [, this.type == 'isPay' ? [Validators.required] : []],
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


    this.id && this.http.post('/student/getNewStudent', { id: this.id }).then(res => {
      res.data.studentInfo.accountList = res.data.parentAccountList;
      this.formGroup.patchValue(res.data.studentInfo);
    })
  }

  get accountList() { return this.formGroup.controls['accountList'] as FormArray; }

  @ControlValid() valid: (key: string, type?: string) => boolean;

  @DrawerClose() close: (bool?) => void;

  addAccount() {
    this.accountList.push(this.fb.group({
      accountName: [, [Validators.required]],
      accountPhone: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)]],
      relationship: [, [Validators.required]],
      workplace: [],
      idNumber: [],
      defaultStatus: [!this.accountList.length]
    }));
  }

  setDefault(idx) {
    this.accountList.controls.map((group, i) => i !== idx && group.patchValue({ defaultStatus: false }));
  }

  save() {
    console.log(this.formGroup)
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
      this.formGroup.value.birthday = this.format.transform(this.formGroup.value.birthday, 'yyyy-MM-dd');
      let url = this.formGroup.value.studentId ? 'updateStudentInfo' : 'newSaveStudent'
      this.http.post(`/student/${url}`, { paramJson: JSON.stringify(this.formGroup.value) }, true).then(res => this.close(true))
    }
  }


  /* ------------ 宝宝生日禁止选择今天以后的日期 ------------ */
  _disabledDate(current: Date): boolean {
    return current && current.getTime() > Date.now();
  }
  
}

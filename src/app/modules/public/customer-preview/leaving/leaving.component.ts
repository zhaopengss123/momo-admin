import { format, differenceInCalendarDays } from 'date-fns';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzDrawerRef } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { DrawerSave } from 'src/app/ng-relax/decorators/drawer/save.decorator';

@Component({
  selector: 'app-leaving',
  templateUrl: './leaving.component.html',
  styleUrls: ['./leaving.component.less']
})
export class LeavingComponent implements OnInit {

  @Input() id: number;

  formGroup: FormGroup;

  memberInfo: any = { studentInfo: {}, parentAccountList: [], cardList: [] };

  loading = true;

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private drawerRef: NzDrawerRef
  ) { }

  ngOnInit() {
    this.http.post('/student/getNewStudent', { id: this.id }).then(res => {
      this.memberInfo = res.data;
      this.formGroup.patchValue({ studentName: res.data.studentInfo.studentName });
      this.memberInfo.hideBtn = true;
      this.loading = false;
      this.memberInfo.cardList.map(card => this.addLeavingCard(card));
    });
    this.formGroup = this.fb.group({
      studentId: [this.id],
      studentName: [],
      leaveDate: [, [Validators.required]],
      studentLeaveDate: [],
      leaveReason: [, [Validators.required]],
      pricesAndCardType: this.fb.array([]),
    });

    this.formGroup.controls.leaveDate.valueChanges.subscribe(val => {
      let startTime = format(val, 'YYYY-MM-DD');
      this.formGroup.patchValue({ studentLeaveDate: startTime });
      this.http.post('/student/getLeaveSurplusTime', { paramJson: JSON.stringify({ studentId: this.id, startTime }) }).then(res => {
        this.pricesAndCardType.controls.map((group: FormGroup) => {
          let times = res.data.filter(c => c.cardId === group['cardId']);
          times.length && Object.assign(group, { resultTimes: times[0].resultTimes, resultFreeTimes: times[0].resultFreeTimes })
        });
      })
    })
  }

  get pricesAndCardType(): FormArray {
    return this.formGroup.controls['pricesAndCardType'] as FormArray;
  }
  addLeavingCard(card) {
    this.pricesAndCardType.push(Object.assign(this.fb.group({
      cardTypeId: [card.cardTypeId],
      price: [, [Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    }), { cardId: card.cardId, cardTypeName: card.cardTypeName, type: card.type, cardStatus: card.status }))
  }

  @DrawerClose() close: () => void;

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  @DrawerSave('/student/saveStudentLeave') save: () => void;

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date(this.memberInfo.studentInfo.expireDate)) > 0;
  };

}

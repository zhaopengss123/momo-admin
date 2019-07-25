import { format, differenceInCalendarDays } from 'date-fns';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  memberInfo: any = { studentInfo: {}, parentAccountList: [] };

  loading = true;

  whetherLeaving = true;

  resultTimes = 0;
  resultFreeTimes = 0;

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
      if (this.memberInfo.studentInfo.cardType == 2 && this.memberInfo.studentInfo.effectDate) {
        this.formGroup.addControl('leaveDate', this.fb.control(null, [Validators.required]));
        this.formGroup.addControl('studentLeaveDate', this.fb.control(null, [Validators.required]));
        this.formGroup.get('leaveDate').valueChanges.subscribe(v => {
          if (v) {
            let startTime = format(v, 'YYYY-MM-DD');
            this.formGroup.patchValue({ studentLeaveDate: startTime });
            this.http.post('/student/getLeaveSurplusTime', { paramJson: JSON.stringify({ studentId: this.id, startTime }) }).then(res => {
              this.resultTimes = res.data.resultTimes;
              this.resultFreeTimes = res.data.resultFreeTimes;
            })
          }
        })
      }
    });
    this.formGroup = this.fb.group({
      studentId: [this.id],
      studentName: [],
      leaveReason: [, [Validators.required]],
      price: [, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    })
  }

  @DrawerClose() close: () => void;

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  @DrawerSave('/student/saveStudentLeave') save: () => void;

  leavingChange(e) {
    this.whetherLeaving ? 
      this.formGroup.addControl('price', this.fb.control(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)])) :
      this.formGroup.removeControl('price');
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date(this.memberInfo.studentInfo.expireDate)) > 0;
  };

}

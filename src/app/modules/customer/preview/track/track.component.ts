import { NzDrawerService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { GetList } from 'src/app/ng-relax/decorators/getList.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { AppointComponent } from '../../appoint/appoint.component';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.less']
})
export class TrackComponent implements OnInit {

  @Input() studentInfo: any = {};

  formGroup: FormGroup;

  followRecordList: any[] = [];

  @GetList('/membermanage/returnVisit/getLableList') labelList: any | [];
  @GetList('/membermanage/returnVisit/getVisitStatus') memberStatusList: any | [];
  @GetList('/membermanage/returnVisit/getFollowTypes') followTypeList: any | [];
  @GetList('/membermanage/returnVisit/getFollowTeachers') teacherList: any | [];
  @GetList('/membermanage/returnVisit/getActivities') activityList: any | [];
  @GetList('/student/getClassList') classList: any | [];
  reserveTeacherList: any[] = [];

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe,
    private drawer: NzDrawerService
  ) { 
    typeof this.labelList === 'function' && this.labelList();
    typeof this.memberStatusList === 'function' && this.memberStatusList();
    typeof this.followTypeList === 'function' && this.followTypeList();
    typeof this.teacherList === 'function' && this.teacherList();
    typeof this.activityList === 'function' && this.activityList();
    typeof this.classList === 'function' && this.classList();
  }

  ngOnInit() {
    this.getFollowRecords();

    this.formGroup = this.fb.group({
      studentId: [this.studentInfo.studentId],
      content: [, [Validators.required]],
      visitStatusId: [, [Validators.required]],
      followType: [, [Validators.required]],
      teacherId: [, [Validators.required]],
      nextFollowTime: [, [Validators.required]],
      status: [0]
    });
    this.formGroup.controls.status.valueChanges.subscribe(status => {
      if (status) {
        this.formGroup.addControl('activityId', this.fb.control(null, [Validators.required]));
        this.formGroup.addControl('reserveClassId', this.fb.control(this.studentInfo.classId, [Validators.required]));
        this.formGroup.addControl('reserveTeacherId', this.fb.control(null, [Validators.required]));
        this.formGroup.addControl('reserveDate', this.fb.control(null, [Validators.required]));
        this.formGroup.addControl('pitNum', this.fb.control(null, [Validators.required]));
      } else {
        this.formGroup.removeControl('activityId');
        this.formGroup.removeControl('reserveClassId');
        this.formGroup.removeControl('reserveTeacherId');
        this.formGroup.removeControl('reserveDate');
        this.formGroup.removeControl('pitNum');
      }
    });
  }

  getFollowRecordsLoading: boolean;
  getFollowRecords() {
    this.getFollowRecordsLoading = true;
    this.http.post('/membermanage/returnVisit/getFollowRecords', { paramJson: JSON.stringify({ studentId: this.studentInfo.studentId }) }).then(res => {
      this.followRecordList = res.data;
      this.getFollowRecordsLoading = false;
    });
  }

  @ControlValid() valid: (key, type?) => boolean;

  _disabledDate(current: Date): boolean {
    return current && current.getTime() < Date.now() - 1000 * 60 * 60 * 24;
  }

  saveLoading: boolean;
  save() {
    console.log(this.formGroup, this.formGroup.errors)
    if (this.formGroup.invalid) {
      Object.values(this.formGroup.controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      this.saveLoading = true;
      this.formGroup.value.nextFollowTime = this.format.transform(this.formGroup.value.nextFollowTime, 'yyyy-MM-dd');
      this.http.post('/membermanage/returnVisit/saveClubFollowRecord', {
        paramJson: JSON.stringify(this.formGroup.value)
      }, true).then(res => {
        this.saveLoading = false;
        this.getFollowRecords();
      }).catch(err => this.saveLoading = false);
    }
  }
  updateFollowRecord() {}


  selectAppoint() {
    this.drawer.create({
      nzTitle: null,
      nzWidth: 1148, 
      nzClosable: false,
      nzContent: AppointComponent,
      nzContentParams: { studentInfo: this.studentInfo, classId: this.formGroup.controls['reserveClassId'].value }
    }).afterClose.subscribe(res => {
      if (res) {
        this.formGroup.patchValue({ reserveDate: res.reserveDate, pitNum: res.pitNum, reserveTeacherId: res.teacherId });
      }
    })
  }

}
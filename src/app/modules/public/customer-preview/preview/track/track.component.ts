import { NzDrawerService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { GetList } from 'src/app/ng-relax/decorators/getList.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { AppointComponent } from '../../appoint/appoint.component';

enum customerStatus {
  '持续跟进' = 1,
  '预约活动/体验' = 2,
  '移到无意向' = 3
}

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.less']
})
export class TrackComponent implements OnInit, OnChanges {

  @Input() studentInfo: any = {};

  formGroup: FormGroup;
  updateFormGroup: FormGroup;

  followRecordList: any[] = [];

  @GetList('/membermanage/returnVisit/getVisitStatus') memberStatusList: any | [];
  followTypeList: any[] = [];
  teacherList: any[] = [];
  @GetList('/membermanage/returnVisit/getActivities') activityList: any | [];
  @GetList('/student/getClassList') classList: any | [];
  reserveTeacherList: any[] = [];

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe,
    private drawer: NzDrawerService
  ) { 
    this.http.post('/teacher/getGrowthConsultant', { code: 1004 }).then(res => this.teacherList = res.data);
    this.http.post('/membermanage/returnVisit/getFollowTypes').then(res => {
      this.followTypeList = res.data;
      res.data.length && this.formGroup.patchValue({ followType: res.data[0].id });
    })
    typeof this.memberStatusList === 'function' && this.memberStatusList();
    
    typeof this.activityList === 'function' && this.activityList();
    typeof this.classList === 'function' && this.classList();
  }

  ngOnInit() {
    let controls = {
      id: [],
      content: [, [Validators.required]],
      visitStatusId: [1, [Validators.required]],
      followType: [, [Validators.required]],
      teacherId: [, [Validators.required]],
      nextFollowTime: [, [Validators.required]]
    }
    this.formGroup = this.fb.group(controls);
    this.updateFormGroup = this.fb.group(controls);

    this.formGroup.controls['visitStatusId'].valueChanges.subscribe(id => this.statusChange(id, 'formGroup'));
    this.updateFormGroup.controls['visitStatusId'].valueChanges.subscribe(id => this.statusChange(id, 'updateFormGroup'));
  }
  ngOnChanges() {
    this.studentInfo.studentId && this.getFollowRecords();
  }

  statusChange(visitStatusId, group) {
    /* ------ 根据是否为无意向客户 判断是否有下次跟进时间 ------ */
    visitStatusId != 3 ? 
      this[group].addControl('nextFollowTime', this.fb.control(this.showUpdateRecord ? new Date(this.updateFollowRecordData.nextFollowTime) : null, [Validators.required])) : 
      this[group].removeControl('nextFollowTime');
    /* ------------ 如果为预约则添加预约相关代码 ------------ */
    if (visitStatusId == 2) {
      this[group].addControl('activityId', this.fb.control(this.showUpdateRecord ? this.updateFollowRecordData.activityId : null, [Validators.required]));
      this[group].addControl('reserveClassId', this.fb.control(this.showUpdateRecord ? this.updateFollowRecordData.reserveClassId : this.studentInfo.classId, [Validators.required]));
      this[group].addControl('reserveTeacherId', this.fb.control(this.showUpdateRecord ? this.updateFollowRecordData.reserveTeacherId : null, [Validators.required]));
      this[group].addControl('reserveDate', this.fb.control(this.showUpdateRecord ? this.updateFollowRecordData.reserveDate : null, [Validators.required]));
      this[group].addControl('pitNum', this.fb.control(this.showUpdateRecord ? this.updateFollowRecordData.pitNum : null, [Validators.required]));
    } else {
      this[group].removeControl('activityId');
      this[group].removeControl('reserveClassId');
      this[group].removeControl('reserveTeacherId');
      this[group].removeControl('reserveDate');
      this[group].removeControl('pitNum');
    }
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

  validUpdateControl(key, type = 'required') {
    return this.updateFormGroup.controls[key].dirty && this.updateFormGroup.controls[key].hasError(type);
  }

  _disabledDate(current: Date): boolean {
    return current && current.getTime() < Date.now() - 1000 * 60 * 60 * 24;
  }

  saveLoading: boolean;
  save(group) {
    console.log(this[group])
    if (this[group].invalid) {
      Object.values(this[group].controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      this.saveLoading = true;
      this[group].value.nextFollowTime = this.format.transform(this[group].value.nextFollowTime, 'yyyy-MM-dd');
      this.activityList.map(a => a.id === this[group].value.activityId && (this[group].value.activityName = a.activityName));
      this[group].value.studentId = this.studentInfo.studentId;
      this.http.post('/membermanage/returnVisit/saveClubFollowRecord', {
        paramJson: JSON.stringify(this[group].value)
      }, true).then(res => {
        this.saveLoading = false;
        this.getFollowRecords();
        this.showUpdateRecord = false;
      }).catch(err => this.saveLoading = false);
    }
  }

  showUpdateRecord: boolean;
  updateFollowRecordData;
  updateFollowRecord(data) {
    this.updateFollowRecordData = data;
    this.updateFormGroup.patchValue(data);
    this.showUpdateRecord = true;
  }


  selectAppoint(group) {
    this.drawer.create({
      nzTitle: null,
      nzWidth: 1148, 
      nzClosable: false,
      nzContent: AppointComponent,
      nzContentParams: { studentInfo: this.studentInfo, classId: this[group].controls['reserveClassId'].value }
    }).afterClose.subscribe(res => {
      if (res) {
        this[group].patchValue({ reserveDate: res.reserveDate, pitNum: res.pitNum, reserveTeacherId: res.teacherId });
      }
    })
  }

}
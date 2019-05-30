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
  updateFormGroup: FormGroup;

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

    let controls = {
      id: [],
      studentId: [this.studentInfo.studentId],
      content: [, [Validators.required]],
      visitStatusId: [, [Validators.required]],
      followType: [, [Validators.required]],
      teacherId: [, [Validators.required]],
      nextFollowTime: [, [Validators.required]],
      status: [0]
    }
    this.formGroup = this.fb.group(controls);
    this.updateFormGroup = this.fb.group(controls);

    this.formGroup.controls.status.valueChanges.subscribe(status => this.statusChange(status, 'formGroup'));
    this.updateFormGroup.controls.status.valueChanges.subscribe(status => this.statusChange(status, 'updateFormGroup'));
  }

  statusChange(status, group) {
    if (status) {
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
      this.followRecordList.map(item => item.contentLabel = this._resetFollowRecordContent(item.content));
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
    if (this[group].invalid) {
      Object.values(this[group].controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      this.saveLoading = true;
      this[group].value.nextFollowTime = this.format.transform(this[group].value.nextFollowTime, 'yyyy-MM-dd');
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

  /* -------------------- 设置跟进记录内容标签展示 -------------------- */
  private _resetFollowRecordContent(content: string): string {
    let matchArray = content.match(/#(.*?)#/g);
    if (matchArray) {
      matchArray.map(res => {
        content = content.replace(new RegExp(res, 'g'), `<a href="javascript:;">${res}</a>`);
      })
    }
    return content;
  }

}
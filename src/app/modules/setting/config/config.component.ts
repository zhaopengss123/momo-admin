import { BmapComponent } from './bmap/bmap.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { NzDrawerService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/ng-relax/services/http.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.less']
})
export class ConfigComponent implements OnInit {

  formGroup: FormGroup;
  businessConfigLoading: boolean = true;
  eventList: any[] = [];
  eventListSh: any[] = [];

  teacherList: any[] = [];
  userList: any[] = [];
  selectStudentList: any[] = [];
  classChildrenList: any[] = [];
  checkType: number;
  saveSettingLoading: boolean;
  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe,
    private drawer: NzDrawerService
  ) {
    /* ------------------------ 获取营业时间配置并初始化 ------------------------*/
    this.formGroup = this.fb.group({
      startTime: [, [Validators.required]],
      endTime: [, [Validators.required]],
      address: [, [Validators.required]],
      introduction: [, [Validators.required]],
      dayCareRemind: [, [Validators.required, Validators.pattern(/^([1-9]\d*|[0]{1,1})$/)]],
      usefulLifeRemind: [, [Validators.required, Validators.pattern(/^([1-9]\d*|[0]{1,1})$/)]],
      toGraduateRemind: [, [Validators.required, Validators.pattern(/^([1-9]\d*|[0]{1,1})$/)]],
      phoneNum: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)]],
      kindergartenName: [, [Validators.required]],
      latAndLon: [],
      distance: []
    });
    this.http.post('/settings/getSystemConfig', {}, false).then(res => {
      this.businessConfigLoading = false;
      if (res.data.startTime) {
        res.data.startTime = new Date(`2019-01-01 ${res.data.startTime}`);
        res.data.endTime = new Date(`2019-01-01 ${res.data.endTime}`);
      }
      this.formGroup.patchValue(res.data)
      this.http.post('/message/getGartenMessage', {}, false).then(res => {
        let info = res.data
        this.formGroup.patchValue({ kindergartenName:  info.kindergartenName});
        this.formGroup.patchValue({ phoneNum:  info.phoneNum});
        this.formGroup.patchValue({ address:  info.address});
        this.formGroup.patchValue({ introduction:  info.introduction});

      });
    })
  }  

  save() {
    if (this.formGroup.invalid) {
      Object.values(this.formGroup.controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {   
      let params = this.formGroup.value;
      if (params.startTime instanceof Date) {
        params.startTime = this.format.transform(params.startTime, 'HH:mm');
        params.endTime = this.format.transform(params.endTime, 'HH:mm');
      }
      this.http.post('/settings/saveSystemConfig', { paramJson: JSON.stringify(params) }, true).then(res => { })
    }
  }
  
  ngOnInit() {
    this.http.post('/settings/notice/getCheckConfig', {}, false).then(res => {
      this.checkType = res.data.checkType;
      res.data.teachers.map(item => item && this.teacherList.push({ label: item.name, value: item.id, checked: item.checkType == 1 }));
      res.data.users.map(item => item && this.userList.push({ label: item.name, value: item.id, checked: item.checkAuth == 1 }));
      res.data.students.map(item => item.checkType == 1 && this.selectStudentList.push(item.id));

      this.http.post('/message/getClassesList', {}, false).then(res => {
        res.data.map(cls => cls.students.map(std => {
          std.label = std.nickName ? `${std.studentName}(${std.nickName})` : std.studentName;
          std.value = std.id;
          std.checked = this.selectStudentList.indexOf(std.id) > -1;
          return std;
        }))
        this.classChildrenList = res.data;
      });
    });
  }

  loading: boolean;
  getData() {
    this.loading = true;
    this.http.post('/message/listEvent', {}, false).then(res => {
      res.data.list.map(event => { event.label = event.eventName; event.value = event.id; event.checked = event.eventCheckAuth == 1; return event; })
      this.eventList = res.data.list;
      this.eventListSh = res.data.list.filter(event => event.eventSatus == 1);
      this.loading = false;
    }).catch(err => this.loading = false);
  }

  selectMarker() {
    let [lat, lng] = this.formGroup.get('latAndLon').value ? this.formGroup.get('latAndLon').value.split(',') : [null , null];
    this.drawer.create({
      nzWidth: 960,
      nzTitle: '选择经纬度',
      nzContent: BmapComponent,
      nzContentParams: { lng, lat }
    }).afterClose.subscribe(res => res && this.formGroup.patchValue({ latAndLon: `${res.lat},${res.lng}`}));
  }

  @ControlValid() valid: (key, type?) => boolean;

  disabledHours(): number[] {
    return [0, 1, 2, 3, 4, 5, 6];
  }


  saveSetting() {
    this.saveSettingLoading = true;
    let params: any = { checkType: this.checkType };
    if (params.checkType == 1) {
      params.userIds = [];
      this.userList.map(res => res.checked && params.userIds.push(res.value));
      params.userIds = params.userIds.join(',');
    } else if (params.checkType == 2) {
      params.teacherIds = [];
      params.studentIds = [];
      params.userIds = [];
      params.eventIds = [];
      this.userList.map(res => res.checked && params.userIds.push(res.value));
      this.teacherList.map(res => res.checked && params.teacherIds.push(res.value));
      this.eventListSh.map(res => res.checked && params.eventIds.push(res.value));
      this.classChildrenList.map(cls => cls.students.map(std => std.checked && params.studentIds.push(std.value)));
      
      params.teacherIds = params.teacherIds.join(',');
      params.studentIds = params.studentIds.join(',');
      params.userIds = params.userIds.join(',');
      params.eventIds = params.eventIds.join(',');
    }
    this.http.post('/settings/notice/setCheckConfig', params).then(res => {
      this.saveSettingLoading = false;
    }).catch(err => this.saveSettingLoading = false);
  }

}

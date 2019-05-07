import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { UpdateComponent } from './update/update.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  eventList: any[] = [];
  eventListSh: any[] = [];

  teacherList: any[] = [];
  userList: any[] = [];
  selectStudentList: any[] = [];
  classChildrenList: any[] = [];

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) { 
    this.getData();
  }

  ngOnInit() {
    this.http.post('/settings/getCheckConfig', {}, false).then(res => {
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

  update(eventInfo) {
    const drawer = this.drawer.create({
      nzWidth: 720,
      nzTitle: '编辑事件配置项',
      nzContent: UpdateComponent,
      nzContentParams: { eventInfo }
    });
    drawer.afterClose.subscribe(res => res && this.getData());
  }

  upateStatus(item) {
    this.http.post('/settings/setEventItem', { id: item.id, status: item.eventSatus == 1 ? 2 : 1 }).then(res => this.getData());
  }

  checkType: number;
  saveSettingLoading: boolean;
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
    this.http.post('/settings/setCheckConfig', params).then(res => {
      this.saveSettingLoading = false;
    }).catch(err => this.saveSettingLoading = false);
  }

}

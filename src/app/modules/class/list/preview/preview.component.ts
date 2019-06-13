import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzDrawerRef, NzMessageService, NzModalService, NzDrawerService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddComponent } from './add/add.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  @Input() id;

  teacherList: any[] = [];
  childrenList: any[] = [];

  eventList: any[] = [];


  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder(),
    private message: NzMessageService,
    private modal: NzModalService,
    private drawer: NzDrawerService
  ) { 
    this.http.post('/message/listEvent', {}, false).then(res => this.eventList = res.data.list);
  }

  ngOnInit() {
    this.getData();
  }

  loading: boolean;
  getData() {
    this.loading = true;
    this.http.post('/classmanager/listTeacherAndStuByClassId', { classId: this.id }, false).then(res => {
      this.teacherList = res.data.teacherList;
      this.childrenList = res.data.studentList;
      this.loading = false;
    })
  }

  showEventList: boolean;
  addEvent(eventInfo) {
    let studentInfo = this.displayData.filter(res => res.checked);
    if (this.displayData.every(value => !value.checked)) {
      this.message.warning('请选择至少一位孩子');
    } else if (eventInfo.eventType == 1 && studentInfo.length > 1) {
      this.message.warning('该事件禁止批量添加');
    } else {
      this.showEventList = false;
      this.drawer.create({
        nzWidth: 400,
        nzTitle: `添加${eventInfo.eventName}事件`,
        nzContent: AddComponent,
        nzContentParams: {
          eventInfo,
          classId: this.id,
          studentInfo
        }
      });
    }
  }


  allChecked = false;
  indeterminate = false;
  displayData = [];
  currentPageDataChange($event): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

}

import { AddComponent } from './../../../event/list/add/add.component';
import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzDrawerRef, NzMessageService, NzModalService, NzDrawerService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetList } from 'src/app/ng-relax/decorators/getList.decorator';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  @Input() id;

  teacherList: any[] = [];
  childrenList: any[] = [];

  classList: any[] = [];

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
    this.http.post('/message/getClasses', {}, false).then(res => this.classList = res.data);

    this.changeClassGroup = this.fb.group({
      studentIds: [],
      classId: [, [Validators.required]],
      content: [, [Validators.required]]
    })
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

  showChangeClass: boolean;
  changeClassGroup: FormGroup;
  changeClassLoading: boolean;
  classChange() {
    if (this.displayData.every(value => !value.checked)) {
      this.message.warning('请选择至少一位孩子');
    } else {
      this.showChangeClass = true;
      this.changeClassGroup.reset();
      let studentIds = []
      this.displayData.map(res => res.checked && studentIds.push(res.id));
      this.changeClassGroup.patchValue({ studentIds: studentIds.join(',') })
    }
  }
  changeClassEnter() {
    if (this.changeClassGroup.invalid) {
      for (let i in this.changeClassGroup.controls) {
        this.changeClassGroup.controls[i].markAsDirty();
        this.changeClassGroup.controls[i].updateValueAndValidity();
      }
    } else {
      this.changeClassLoading = true;
      this.http.post('/classmanager/updateStudentToOtherClass', { paramJson: JSON.stringify(this.changeClassGroup.value) }).then(res => {
        this.changeClassLoading = false;
        this.modal.closeAll();
        this.getData();
      }).catch(err => this.changeClassLoading = false);
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

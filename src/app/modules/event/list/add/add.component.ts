import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  @Input() eventInfo;

  @Input() classId: number;
  @Input() studentInfo: any

  formGroup: FormGroup;

  templateContent: any[] = [];

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe
  ) { 
    this.formGroup = this.fb.group({})
  }

  ngOnInit() {
    this.templateContent = JSON.parse(this.eventInfo.templateContent);
    this.templateContent.map((control, i) => {
      if (control.type == 'radioArray' || control.type == 'checkboxArray') {
        control.valueArrays.map((optionList, idx) => {
          this.formGroup.addControl(`control${i.toString() + idx}`, this.fb.control(null, control.required ? [Validators.required] : []))  
        })
      } else {
        this.formGroup.addControl(`control${i}`, this.fb.control(null, control.required ? [Validators.required] : []))
      }
    })
  }

  @DrawerClose() close: () => void;

  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      for (let i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    } else {
      this.saveLoading = true;

      var startTime, endTime, showTime, content = [], appContent: any = { content: [], imgUrlList: [], videoUrl: ''};
      this.templateContent.map((control,i) => {
        if (control.type == 'datetime') {
          let time = this.format.transform(this.formGroup.value['control' + i], 'yyyy-MM-dd HH:mm');
          startTime = time;
          endTime = time;
          showTime = startTime;
          content.push(time);
        } else if (control.type == 'startendtime') {
          startTime = this.format.transform(this.formGroup.value['control' + i][0], 'yyyy-MM-dd HH:mm');
          endTime = this.format.transform(this.formGroup.value['control' + i][1], 'yyyy-MM-dd HH:mm');
          content.push([this.format.transform(this.formGroup.value['control' + i][0], 'yyyy-MM-dd HH:mm'), this.format.transform(this.formGroup.value['control' + i][1], 'yyyy-MM-dd HH:mm')]);
          showTime = startTime + '-' + endTime;
        } else if (control.type == 'radioArray' || control.type == 'checkboxArray') {
          let arrVal = [];
          control.valueArrays.map((optionList, idx) => {
            arrVal.push(this.formGroup.value['control' + i + idx]);
          })
          content.push(arrVal);
        } else {
          content.push(this.formGroup.value['control' + i] || null);
        }

        /* ------------- 拼接 appContent ------------- */
        if ((control.type == 'input' || control.type == 'textarea' || control.type == 'radio' || control.type == 'select') && this.formGroup.value['control' + i]) {
          appContent.content.push(`${control.label}：${this.formGroup.value['control' + i]}`);
        } else if (control.type == 'radioArray') {
          let arrVal = [];
          control.valueArrays.map((l, idx) => {
            if (this.formGroup.value['control' + i + idx]) {
              arrVal.push(this.formGroup.value['control' + i + idx]);
            }
          });
          appContent.content.push(`${control.label}：${arrVal.join('、')}`);
        } else if (control.type == 'checkbox') {
          appContent.content.push(`${control.label}：${this.formGroup.value['control' + i].join('、')}`);
        } else if (control.type == 'checkboxArray') {
          let arrVal = [];
          control.valueArrays.map((l, idx) => {
            if (this.formGroup.value['control' + i + idx] && this.formGroup.value['control' + i + idx].length) {
              arrVal.push(this.formGroup.value['control' + i + idx]);
            }
          });
          let newArr = []
          arrVal.map(item => item.map(res => newArr.push(res)));
          appContent.content.push(`${control.label}：${arrVal.join('、')}`);
        } else if (control.type == 'files' && this.formGroup.value['control' + i]) {
          if (this.formGroup.value['control' + i].indexOf('hcz-czg-image') > -1) {
            appContent.imgUrlList = this.formGroup.value['control' + i].split(',');
          } else {
            appContent.videoUrl = this.formGroup.value['control' + i];
          }
        } else if (control.type == 'startendtime' && this.formGroup.value['control' + i]) {
          appContent.content.push(`${control.label}：${showTime}`);
        }
      });
      appContent.content = appContent.content.join('|~!|')

      var studentIds: any = [];
      if (this.studentInfo.length) { 
        this.studentInfo.map(info => studentIds.push(`${info.id}:${info.checkType}:${info.studentName}`));
      } else {
        studentIds.push(`${this.studentInfo.id}:${this.studentInfo.checkType}:${this.studentInfo.studentName}`); 
      }
      studentIds = studentIds.join(',');
      this.http.post('/event_record/saveEventRecord', { paramJson: JSON.stringify({
        eventId: this.eventInfo.id,
        classId: this.classId,
        studentIds,
        startTime,
        endTime,
        showTime,
        appContent: JSON.stringify(appContent),
        content: JSON.stringify(content),
        eventCheckAuth: this.eventInfo.eventCheckAuth,
        pushStatus: this.eventInfo.pushStatus
      }) }).then(res => {
        this.drawerRef.close(true);
        this.saveLoading = false;
      }).catch(err => this.saveLoading = false);
    }
  }


  checkboxChange(control, e) {
    let value = {};
    value[control] = e;
    this.formGroup.patchValue(value);
  }
}

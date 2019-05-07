import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpService } from './../../../../ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @Input() eventInfo;

  eventForm: FormGroup

  constructor(
    private drawerRef: NzDrawerRef<boolean>,
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.eventForm = this.fb.group({
      eventList: this.fb.array([])
    });
    let templateContent = JSON.parse(this.eventInfo.templateContent || '[{}]');
    templateContent.map(res => {
      this.addGroup(res);
    });
  }

  get eventList() {
    return this.eventForm.get('eventList') as FormArray;
  }

  addGroup(groupInfo: any = {}) {
    this.eventList.push(
      this.fb.group({
        label: [groupInfo.label, [Validators.required]],
        type: [groupInfo.type, [Validators.required]],
        required: [typeof groupInfo.required === 'boolean' ? groupInfo.required : true],
        minlength: [groupInfo.minlength, [Validators.pattern(/^[1-9]\d*$/)]],
        maxlength: [groupInfo.maxlength, [Validators.pattern(/^[1-9]\d*$/)]],
        pattern: [groupInfo.pattern || 'text'],
        default: [groupInfo.default],
        values: [groupInfo.values],
        valueArrays: this.fb.array([])
      })
    )
    if (groupInfo && (groupInfo.type === 'radioArray' || groupInfo.type === 'checkboxArray')) {
      groupInfo.valueArrays.map(values => this.addValueArrays(this.eventList.controls[this.eventList.length - 1], values));
    } else {
      this.addValueArrays(this.eventList.controls[this.eventList.length - 1])
    }
  }
  addValueArrays(group, values = null) {
    group.get('valueArrays').push(this.fb.control(values))
  }
  deleteValueArrays(group) {
    group.get('valueArrays').removeAt(group.get('valueArrays').value.length - 1);
  }
  
  @DrawerClose() close: () => Promise<boolean>;

  deleteGroup(i) {
    this.eventList.removeAt(i)
  }

  saveLoading: boolean;
  save() {
    if (this.eventForm.invalid) {
      for (let i in this.eventList.controls) {
        for (let control in this.eventList.controls[i]['controls']) {
          this.eventList.controls[i]['controls'][control].markAsDirty();
          this.eventList.controls[i]['controls'][control].updateValueAndValidity();
        }
      }
    } else {
      let params = this.eventForm.value.eventList;
      let isRequest = true;

      let timeCount = 0;
      params.map(res => {
        if (res.type === 'radio' || res.type === 'checkbox') {
          if (res.values === null || res.values && res.values.length === 0) {
            isRequest = false;
          }
        }
        if (res.type == 'radioArray' || res.type == 'checkboxArray') {
          res.valueArrays.map(values => {
            if (values === null || values && values.length === 0) {
              isRequest = false;
            }
          })
        }
        if (res.type === 'datetime' || res.type === 'startendtime') {
          timeCount++;
        }
      })
      if (timeCount != 1) {
        this.message.warning(timeCount > 1 ? '配置项只能选择一项类型为时间' : '至少选择一项类型为时间的配置');
        return;
      }
      if (isRequest) {
        this.saveLoading = true;
        params.map(res => Object.keys(res).map(key => res[key] === null && delete res[key]));
        this.http.post('/settings/updateEventConfig', {
          paramJson: JSON.stringify({
            id: this.eventInfo.id,
            templateContent: JSON.stringify(params)
          })
        }).then(res => {
          this.drawerRef.close(true);
          this.saveLoading = false;
        }).catch(err => this.saveLoading = false);
      } else {
        this.message.warning('请输入可选值');
      }
    }
  }

}

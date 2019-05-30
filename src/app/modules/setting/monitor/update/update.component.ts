import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @Input() info;

  formGroup: FormGroup;

  classList: any[] = [];

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder()
  ) { 
    this.formGroup = this.fb.group({
      ids: [],
      publicPlaceFlag: [1],
      serialNum: [, [Validators.required]],
      channelId: [, [Validators.required, Validators.pattern(/^-?[1-9]\d*$/)]],
      placeName: [, [Validators.required]],
    });
    this.formGroup.get('publicPlaceFlag').valueChanges.subscribe(res => {
      res == 1 ? this.formGroup.removeControl('classId') : this.formGroup.addControl('classId', new FormControl(this.info.id ? this.info.classId : null, [Validators.required]))
    });
    this.http.post('/message/listClassMessage', {}, false).then(res => this.classList = res.data.list);

  }

  ngOnInit() {
    this.info.ids = this.info.id;
    this.info.id && this.formGroup.patchValue(this.info);
  }

  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      for (let i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    } else {
      this.saveLoading = true;
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      this.http.post(`/monitor/${this.info.id ? 'updateMonitorMessage' : 'saveMonitorMessage'}`, {
        paramJson: JSON.stringify(params)
      }).then(res => {
        this.saveLoading = false;
        this.drawerRef.close(true);
      }).catch(err => this.saveLoading = false);
    }
  }

  @DrawerClose() close: () => void;

}

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
      dayCareRemind: [, [Validators.required, Validators.pattern(/^([1-9]\d*|[0]{1,1})$/)]],
      usefulLifeRemind: [, [Validators.required, Validators.pattern(/^([1-9]\d*|[0]{1,1})$/)]],
      toGraduateRemind: [, [Validators.required, Validators.pattern(/^([1-9]\d*|[0]{1,1})$/)]],

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

}

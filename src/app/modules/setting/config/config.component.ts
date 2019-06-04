import { DatePipe } from '@angular/common';
import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.less']
})
export class ConfigComponent implements OnInit {

  businessConfigForm: FormGroup;
  businessConfigLoading: boolean = true;

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe
  ) {
    /* ------------------------ 获取营业时间配置并初始化 ------------------------*/
    this.businessConfigForm = this.fb.group({
      startTime: [8, [Validators.required]],
      endTime: [18, [Validators.required]],
      dayCareRemind: [0, [Validators.pattern(/^\d+(\.\d{1,1})?$/)]],
      usefulLifeRemind: [0, [Validators.pattern(/^\d+(\.\d{1,1})?$/)]],
      toGraduateRemind: [0, [Validators.pattern(/^\d+(\.\d{1,1})?$/)]],
    });

    this.http.post('/settings/getSystemConfig', {}, false).then(res => {
      this.businessConfigLoading = false;
      res.data.startTime = Number(res.data.startTime);
      res.data.endTime = Number(res.data.endTime);
      this.businessConfigForm.patchValue(res.data)
    })
  }  

  save() {
    let params = this.businessConfigForm.value;
    params.startTime = this.format.transform(params.startTime, 'HH:mm');
    params.endTime = this.format.transform(params.endTime, 'HH:mm');
    this.http.post('/settings/saveSystemConfig', { paramJson: JSON.stringify(params)}, true).then(res => { })
  }
  
  ngOnInit() {
    
  }



  disabledHours(): number[] {
    return [0, 1, 2, 3, 4, 5, 6];
  }

}

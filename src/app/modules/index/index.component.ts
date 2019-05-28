import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  formGroup: FormGroup;

  info: any = {};

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder()
  ) {
    this.formGroup = this.fb.group({
      id: [],
      address: [, [Validators.required]],
      introduction: [, [Validators.required]],
      coverImage: [, [Validators.required]],
      phoneNum: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)]],
      kindergartenName: [, [Validators.required]],
      email: [, [Validators.required, Validators.pattern(/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/)]],
      officialWebsite: [, [Validators.required, Validators.pattern(/^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/)]],
    });

    this.http.post('/message/getGartenMessage', {}, false).then(res => {
      if (res.data) {
        this.info = res.data;
        this.formGroup.patchValue(res.data);
      }
    });

  }

  ngOnInit() {
  }

  showDrawer: boolean;
  saveLoading: boolean;
  save() {
    if (this.formGroup.valid) {
      this.saveLoading = true;
      this.http.post('/message/updateGartenMessage', { paramJson: JSON.stringify(this.formGroup.value) }).then(res => {
        this.info = this.formGroup.value;
        this.saveLoading = false;
        this.showDrawer = false;
      }).catch(err => this.saveLoading = false);
    } else {
      for (let i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }
  }

}

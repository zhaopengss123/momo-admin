import { HttpService } from 'src/app/ng-relax/services/http.service';
import { CacheService } from '../../../../ng-relax/services/cache.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { MonthdiffPipe } from '../../../../ng-relax/pipes/monthdiff.pipe';
import { Observable } from 'rxjs';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { DrawerSave } from 'src/app/ng-relax/decorators/drawer/save.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

  @Input() id: number;
  
  formGroup: FormGroup

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private http: HttpService,
    private drawerRef: NzDrawerRef
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      nick: [],                                                                               // 宝宝姓名
      mobilePhone: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)], [this._parentPhoneAsyncValidator]]
    });
  }
  
  @DrawerClose() close: () => void;

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  @DrawerSave('') save: () => void;
  
  
  _parentPhoneAsyncValidator = (control: FormControl): any => {
    return Observable.create(observer => {
      let params: any = { mobilePhone: this.formGroup.get('mobilePhone').value };
      if (this.id) { params.id = this.id; }
      this.http.post('/common/checkTelphoneNum', { paramJson: JSON.stringify(params) }, false).then(res => {
        observer.next(res.result ? null : { error: true, duplicated: true });
        observer.complete();
      }, err => {
        observer.next(null);
        observer.complete();
      })
    })
  };
  

}

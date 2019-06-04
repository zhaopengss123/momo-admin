import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzDrawerRef } from 'ng-zorro-antd';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { DrawerSave } from 'src/app/ng-relax/decorators/drawer/save.decorator';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

  @Input() cardTypeInfo: any = {};
  
  formGroup: FormGroup

  optionList = [];

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private http: HttpService,
    private drawerRef: NzDrawerRef
  ) { 
    this.http.post('/commodity/service/showServiceTypeCategory').then(res => this.optionList = res.data.list)
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      serviceTypeId          : [],
      serviceTypeCategoryId  : [, Validators.required],
      serviceName            : [, [Validators.required]],
      price                  : [, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],      //售价
      lowestDiscount         : [, [Validators.required, this._lowestDiscountValidator]],   //最低折扣
      serviceDesc            : [, [Validators.required]],
      isOnline: [1]                                                                 //默认上架
    }) 
    this.formGroup.patchValue(this.cardTypeInfo);
  }

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      Object.values(this.formGroup.controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      this.saveLoading = true;
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      params.serviceDesc = encodeURIComponent(params.serviceDesc);
      params.serviceName = encodeURIComponent(params.serviceName);
      this.http.post('/commodity/service/saveService', {
        paramJson: JSON.stringify(params)
      }, true).then(res => {
        this.saveLoading = false;
        this.drawerRef.close(true);
      })
    }
  }

  @DrawerClose() close: () => void;


  private _lowestDiscountValidator = (control: AbstractControl): { [key: string]: any } | null => {
    try {
      return Number(control.value) >= 0 && Number(control.value) <= 1 && (/^\d+(\.\d{1,2})?$/).test(control.value) ? null : { error: true };
    } catch (error) {
      return null;
    }
  }
}

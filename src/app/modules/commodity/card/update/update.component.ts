import { DrawerSave } from './../../../../ng-relax/decorators/drawer/save.decorator';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpService } from './../../../../ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {
  
  @Input() cardTypeInfo;

  formGroup: FormGroup;

  monthList = [];

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private drawerRef: NzDrawerRef
  ) { 
    for (let i = 0; i < 48; i++) { this.monthList.push(i + 1); }
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      cardTypeId: [],
      type: [],
      cardTypeName: [, [Validators.required]],
      price: [, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      lowestDiscount: [, [Validators.required, this._lowestDiscountValidator]],
      cardDesc: [, [Validators.required]],
      isOnline: [1]                                                             //默认上架
    });

    this.formGroup.controls['type'].valueChanges.subscribe(type => {
      if (type == 1) {
        this.formGroup.addControl('day', this.fb.control(this.cardTypeInfo ? this.cardTypeInfo.day : null, [Validators.required, Validators.pattern(/^[1-9]\d*$/)]))
        this.formGroup.removeControl('month')
      } else {
        this.formGroup.addControl('month', this.fb.control(this.cardTypeInfo ? this.cardTypeInfo.month : null, [Validators.required]))
        this.formGroup.removeControl('day')
      }
    });
    this.formGroup.patchValue(this.cardTypeInfo || { type: 1});
  }

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  @DrawerSave('/commodity/card/saveCard') save: () => void;

  @DrawerClose() close: () => void;

  private _lowestDiscountValidator = (control: AbstractControl): { [key: string]: any } | null => {
    try {
      return Number(control.value) >= 0 && Number(control.value) <= 1 ? null : { error: true }; 
    } catch (error) {
      return null;
    }
  }

}

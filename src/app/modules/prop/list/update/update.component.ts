import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { FormControl } from '@angular/forms';
import { NzDrawerService } from 'ng-zorro-antd';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

  @Input() id: number;

  formGroup: FormGroup;
  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private http: HttpService,
    private drawerRef: NzDrawerRef,

  ) {

  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.id],
      name: [, [Validators.required]],
      starlight	: [, [Validators.required]],
      privilege	: [, [Validators.required]],
      imgUrl	: [, [Validators.required]],
      customerImg	: [, [Validators.required]],
      isSell	: [0],
      upShelves	: [0],
      fixedServiceCharge: [],
      fixedCashDeposit: [],
      dynamicServiceCharge: [],
      dynamicCashDeposit: [],
    });
    
    let controls = {
      id: [this.id],
      name: [, [Validators.required]],
      starlight	: [, [Validators.required]],
      privilege	: [, [Validators.required]],
      imgUrl	: [, [Validators.required]],
      customerImg	: [, [Validators.required]],
      isSell	: [, [Validators.required]],
      upShelves	: [0],
      fixedServiceCharge: [],
      fixedCashDeposit: [],
      dynamicServiceCharge: [],
      dynamicCashDeposit: [],
      sortId:[, [Validators.required]]
    }
    if(this.id){
      this.formGroup = this.fb.group(controls);
      this.http.post(`/console/props/queryById/${ this.id }`, {
      }, false).then(res => {
        if(res.returnCode == 'SUCCESS'){
          this.formGroup.patchValue(res.result);
        }
      }).catch(err => {
        this.saveLoading = false;
      });
    }
  }

  @DrawerClose() close: () => void;

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      Object.values(this.formGroup.controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      this.saveLoading = true;
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      if (!params.id) {
        this.http.post('/console/props/save', {
          name: params.name,
          imgUrl: params.imgUrl.replace("http://momoimage.beituokj.com",""),
          starlight: params.starlight,
          privilege: params.privilege,
          fixedServiceCharge: params.fixedServiceCharge,
          fixedCashDeposit: params.fixedCashDeposit,
          dynamicServiceCharge: params.dynamicServiceCharge,
          dynamicCashDeposit: params.dynamicCashDeposit,
          customerImg: params.customerImg,
          isSell: params.isSell,
          upShelves: params.upShelves
        }, true).then(res => {
          this.saveLoading = false;
          this.drawerRef.close(true);
        }).catch(err => {
          this.saveLoading = false;
          this.drawerRef.close(true);
        });
      }else{
        this.http.post('/console/props/updateProps', {
          id: params.id,
          name: params.name,
          imgUrl: params.imgUrl.replace("http://momoimage.beituokj.com",""),
          starlight: params.starlight,
          privilege: params.privilege,
          fixedServiceCharge: params.fixedServiceCharge,
          fixedCashDeposit: params.fixedCashDeposit,
          dynamicServiceCharge: params.dynamicServiceCharge,
          dynamicCashDeposit: params.dynamicCashDeposit,
          customerImg: params.customerImg,
          isSell: params.isSell,
          upShelves: params.upShelves,
          sortId: params.sortId
        }, true).then(res => {
          this.saveLoading = false;
          this.drawerRef.close(true);
        }).catch(err => {
          this.saveLoading = false;
          this.drawerRef.close(true);
        });
      }
    }
  }



}

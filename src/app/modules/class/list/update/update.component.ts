import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  @Input() classInfo;

  formGroup: FormGroup

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder()
  ) { 
    this.formGroup = this.fb.group({
      classId: [],
      classImage: [, [Validators.required]],
      className: [, [Validators.required]],
      classSlogan: [, [Validators.required]],
      receptionNum: [, [Validators.required]],
      startMonth: [, [Validators.required]],
      endMonth: [, [Validators.required]],
    });
  }

  ngOnInit() {
    this.classInfo.classId = this.classInfo.id;
    this.formGroup.patchValue(this.classInfo);
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
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      this.http.post(`/classmanager/saveClass`, { paramJson: JSON.stringify(params) }).then(res => {
        this.saveLoading = false;
        this.drawerRef.close(true);
      }).catch(err => this.saveLoading = false);
    }
  }

}

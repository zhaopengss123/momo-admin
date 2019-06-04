import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzDrawerRef } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { DrawerSave } from 'src/app/ng-relax/decorators/drawer/save.decorator';

@Component({
  selector: 'app-leaving',
  templateUrl: './leaving.component.html',
  styleUrls: ['./leaving.component.less']
})
export class LeavingComponent implements OnInit {

  @Input() id: number;

  formGroup: FormGroup;

  memberInfo: any = { studentInfo: {}, parentAccountList: [] };

  loading = true;

  whetherLeaving = true;

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private drawerRef: NzDrawerRef
  ) { }

  ngOnInit() {
    this.http.post('/student/getNewStudent', { id: this.id }).then(res => {
      this.memberInfo = res.data;
      this.formGroup.patchValue({ studentName: res.data.studentInfo.studentName });
      this.memberInfo.hideBtn = true;
      this.loading = false;
    });
    this.formGroup = this.fb.group({
      studentId: [this.id],
      studentName: [],
      leaveReason: [, [Validators.required]],
      price: [, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    })
  }

  @DrawerClose() close: () => void;

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  @DrawerSave('/student/saveStudentLeave') save: () => void;

  leavingChange(e) {
    this.whetherLeaving ? 
      this.formGroup.addControl('price', this.fb.control(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)])) :
      this.formGroup.removeControl('price');
  }

}

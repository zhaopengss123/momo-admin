import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { DrawerSave } from 'src/app/ng-relax/decorators/drawer/save.decorator';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

  @Input() id: number;

  formGroup: FormGroup;

  roleList: any[] = [];
  classList: any[] = [];

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private drawerRef: NzDrawerRef<boolean>
  ) { 
    this.http.post('/message/getClasses').then(res => this.classList = res.data);
    this.http.post('/teacher/getRoleList').then(res => this.roleList = res.data);
  }

  teacherInfo: any = {};
  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.id],
      mobilePhone: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)], [this._mobilePhoneAsyncValidator]],
      photoUrl: [, [Validators.required]],
      name: [, [Validators.required]],
      englishName: [, [Validators.required]],
      sex: ['1'],
      roleId: [, [Validators.required]],
      idCard: [, [Validators.required, Validators.pattern(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)]],
      birthday: [, [Validators.required]],
      eMail: [, [Validators.pattern(/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/)]],
      homeAddress: [],
      entryTime: [, [Validators.required]],
      quitTime: [],
      status: [, [Validators.required]],
    });
    this.formGroup.controls['roleId'].valueChanges.subscribe(roleId => {
      if (roleId == 2) {
        this.formGroup.addControl('isGovernor', this.fb.control(this.teacherInfo.isGovernor || null, [Validators.required]));
        this.formGroup.addControl('classId', this.fb.control(this.teacherInfo.classId || null));
        this.formGroup.addControl('receptionNum', this.fb.control(this.teacherInfo.receptionNum || null, [Validators.required, Validators.pattern(/^[1-9]\d*$/)]));
      } else {
        this.formGroup.removeControl('isGovernor');
        this.formGroup.removeControl('classId');
        this.formGroup.removeControl('receptionNum');
      }
    });

    this.id && this.http.post('/teacher/getTeacherInfo', { id: this.id }, false).then(res => {
      this.teacherInfo = res.data;
      this.formGroup.patchValue(res.data);
    });
  }

  @DrawerClose() close: () => void;

  saveLoading: boolean;
  @DrawerSave('/teacher/saveTeacherInfo') save: () => void;

  private _mobilePhoneAsyncValidator = (control: FormControl): any => {
    return Observable.create(observer => {
      let params = {
        id: this.formGroup.get('id').value,
        mobilePhone: control.value
      };
      this.http.post('/teacher/checkEmployeePhoneNum', { paramJson: JSON.stringify(params) }, false).then(res => {
        observer.next(res.data ? null : { error: true, duplicated: true });
        observer.complete();
      }, err => {
        observer.next(null);
        observer.complete();
      })
    })
  };

  @ControlValid() valid: (key, type?) => boolean;

}

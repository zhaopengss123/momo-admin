import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { GetList } from 'src/app/ng-relax/decorators/getList.decorator';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @Input() id: number;

  formGroup: FormGroup;

   roleList: any;
  classList: any[] = [];
  @GetList('/teacher/getMenus') menuList: any;

  roleLevel: number;
  password: string;

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private drawerRef: NzDrawerRef<boolean>
  ) { 
    typeof this.roleList === 'function' && this.roleList();
    typeof this.menuList === 'function' && this.menuList();
    this.http.post('/message/getClasses', {}, false).then(res => this.classList = res.data);
    this.http.post('/teacher/getRoleList', {}, false).then(res => this.roleList = res.data);
    this.formGroup = this.fb.group({
      id: [this.id],
      userId: [],
      mobilePhone: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)], [this._mobilePhoneAsyncValidator]],
      photoUrl: [, [Validators.required]],
      name: [, [Validators.required]],
      sex: ['1'],
      roleId: [, [Validators.required]],
      classIds: [],
      menuIds: [],
      receptionNum: [, [Validators.required]],
      idCard:[, [Validators.required]],
      birthday:[],
      email: [],
      homeAddress: [],
      entryTime: [, [Validators.required]],
      quit_time: [],
      status: [, [Validators.required]],
      isGovernor: [, [Validators.required]],
    });
    this.formGroup.get('roleId').valueChanges.subscribe(roleId => {
      if (roleId) {
        this.roleList.map(role => {
          if (role.id === roleId) {
            this.roleLevel = role.level;
            if (role.level <= 5) {
              this.formGroup.addControl('realPassword', this.fb.control(this.password || null, [Validators.required, Validators.minLength(6)]));
              this.formGroup.addControl('enterPassword', this.fb.control(this.password || null, [Validators.required, this._passwordValidator]));
            } else {
              this.formGroup.removeControl('realPassword');
              this.formGroup.removeControl('enterPassword');
            }
          }
        });
      }
    })
  }

  ngOnInit() {
    this.id && this.http.post('/teacher/getTeacherDetail', { id: this.id }, false).then(res => {
      let teacherInfo = res.data;
      this.password = teacherInfo.realPassword;
      teacherInfo.enterPassword = teacherInfo.realPassword;
      teacherInfo.classIds = [];
      teacherInfo.classes.map(res => teacherInfo.classIds.push(res.id));
      teacherInfo.menuIds = [];
      teacherInfo.menus.map(res => teacherInfo.menuIds.push(res.id));
      this.formGroup.patchValue(teacherInfo);
    });
  }

  @DrawerClose() close: () => void;

  saveLoading: boolean;
  save() {
    let params = JSON.parse(JSON.stringify(this.formGroup.value));
    if (this.formGroup.invalid) {
      for (let i in this.formGroup.controls) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    } else {
      this.saveLoading = true;
      this.http.post('/teacher/saveTeacher', { paramJson: JSON.stringify(params) }).then(res => {
        this.drawerRef.close(true);
      }).catch(err => this.saveLoading = false);
    }
  }

  private _passwordValidator = (control): { error: boolean } | null => {
    let password = this.formGroup && this.formGroup.get('realPassword') ? this.formGroup.get('realPassword').value : null;
    return password && control.value && password === control.value ? null : { error: true };
  }

  private _mobilePhoneAsyncValidator = (control: FormControl): any => {
    return Observable.create(observer => {
      let params = {
        id: this.formGroup.get('id').value,
        mobilePhone: control.value
      };
      this.http.post('/teacher/checkPhoneNum', { paramJson: JSON.stringify(params) }, false).then(res => {
        observer.next(res.data ? null : { error: true, duplicated: true });
        observer.complete();
      }, err => {
        observer.next(null);
        observer.complete();
      })
    })
  };

}

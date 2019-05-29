import { NzDrawerService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { DrawerSave } from 'src/app/ng-relax/decorators/drawer/save.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { GetList } from 'src/app/ng-relax/decorators/getList.decorator';
import { AppointComponent } from '../appoint/appoint.component';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.less']
})
export class ClassComponent implements OnInit {

  @Input() id: number;

  formGroup: FormGroup;

  memberInfo: any = { studentInfo: {}, parentAccountList: [] };

  @GetList('/reserve/getClassWithTeacher') classList: any | [];
  teacherList: any[] = [];

  loading: boolean = true;

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private drawer: NzDrawerService
  ) {
    typeof this.classList === 'function' && this.classList();
  }

  ngOnInit() {
    this.http.post('/student/getNewStudent', { id: this.id }).then(res => {
      this.memberInfo = res.data;
      this.memberInfo.hideBtn = true;
      this.loading = false;

      this.formGroup.patchValue({
        className: this.memberInfo.studentInfo.className,
        studentName: this.memberInfo.studentInfo.className,
      });
    });
    this.formGroup = this.fb.group({
      studentId: [this.id],
      className: [],
      studentName: [],

      classId: [, [Validators.required]],
      newClassName: [],
      teacherId: [, [Validators.required]],
      reason: [, [Validators.required]],

      startTime: [],
      endTime: [],
      pitNum: [],
    });
    this.formGroup.controls.classId.valueChanges.subscribe(classId => {
      this.formGroup.patchValue({ teacherId: null })
      this.classList.map(classes => classes.classId === classId && (this.teacherList = classes.teachers, this.formGroup.patchValue({ newClassName: classes.className })));
    })
  }

  selectAppoint() {
    this.drawer.create({
      nzTitle: null,
      nzWidth: 1148,
      nzClosable: false,
      nzContent: AppointComponent,
      nzContentParams: { studentInfo: this.memberInfo.studentInfo, classId: this.formGroup.controls['classId'].value }
    }).afterClose.subscribe(res => {
      if (res) {
        this.formGroup.patchValue({ startTime: res.reserveDate, endTime: res.reserveDate, pitNum: res.pitNum, teacherId: res.teacherId });
      }
    })
  }

  @DrawerClose() close: () => void;

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  @DrawerSave('/student/adjustClass') save: () => void;

}

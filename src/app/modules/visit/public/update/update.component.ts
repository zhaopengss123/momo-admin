import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { DrawerSave } from 'src/app/ng-relax/decorators/drawer/save.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { FormControl } from '@angular/forms';
import { PreviewComponent } from '../../../public/customer-preview/preview/preview.component';
import { NzDrawerService } from 'ng-zorro-antd';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

  @Input() id: number;

  formGroup: FormGroup;

  teacherList: any[] = [];
  sourceList: any[] = [];

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private http: HttpService,
    private drawerRef: NzDrawerRef,
    private drawer: NzDrawerService

  ) {
    this.http.post('/teacher/getGrowthConsultant', { code: 1004 }).then(res => this.teacherList = res.data);
    this.http.post('/membermanage/returnVisit/getMemberFrom').then(res => this.sourceList = res.data);
    console.log(323232);
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.id],
      studentName: [, [Validators.required]],
      mobilePhone: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)]],
      followerId: [, [Validators.required]],
      memberFromId: [, [Validators.required]]
    });
  }

  @DrawerClose() close: () => void;

  @ControlValid() valid: (key, type?) => boolean;

  saveLoading: boolean;
  // @DrawerSave('/membermanage/clue/saveClue') save: () => void;
  save() {
    if (this.formGroup.invalid) {
      Object.values(this.formGroup.controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      this.saveLoading = true;
      Object.keys(this.formGroup.value).map(res => {
        if (this.formGroup.value[res] instanceof Date) {
          this.formGroup.value[res] = formatTime(this.formGroup.value[res]);
        }
      });
      let params = JSON.parse(JSON.stringify(this.formGroup.value));
      this.http.post('/membermanage/clue/saveClue', {
        paramJson: JSON.stringify(params)
      }, true).then(res => {
        if (res.result == 1001) {
          this.preview({ id: res.data.id, source: 'visit' })
        }
        this.saveLoading = false;
        this.drawerRef.close(true);
      }).catch(err => {
        if (err.result == 1001) {
          this.preview({ id: err.data.id, source: 'visit' })
        }
        this.saveLoading = false
      });
    }
  }
  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({ id: number, source: string }) => void;


}
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join('-');
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
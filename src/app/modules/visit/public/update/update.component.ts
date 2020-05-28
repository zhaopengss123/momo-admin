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
import { UpdateListComponent } from '../update-list/update-list.component';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {

  @Input() id: number;

  formGroup: FormGroup;
  hiddenNannytime: boolean = false;
  teacherList: any[] = [];
  sourceList: any[] = [];
  Attribute: any = {
    activity:{},
    allworking:{},
    babysitter:{},
    born:{},
    carer:{},
    gift:{},
    multiplebirth:{},
    nannytime:{},
    near:{},
    problems:{},
    reason:{},
  };

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private http: HttpService,
    private drawerRef: NzDrawerRef,
    private drawer: NzDrawerService

  ) {
    this.http.post('/teacher/getGrowthConsultant', { code: 1004 }).then(res => this.teacherList = res.data);
    this.http.post('/membermanage/returnVisit/getMemberFrom').then(res => this.sourceList = res.data);
    this.http.post('/attribute/getAllAttribute').then(res => {
      let data = res.data;
      let dataArr = Object.keys(data);
      dataArr.map(item => {
        let itemArr = Object.keys(data[item]);
        data[item].list = [];
        itemArr.map(items => {
          data[item].list.push({
            name: data[item][items],
            key: Number(items)
          });
        })
      })
      this.Attribute = data;
      this.formGroup.controls['babysitter'].valueChanges.subscribe(id => {
        let item = this.Attribute.babysitter.list.filter(item=> item.key == id );
        if( item[0].name == '否' ){
          this.hiddenNannytime = false;
          this.formGroup.patchValue({ nannytime: this.Attribute.nannytime.list[0].key })
        }else{
          this.hiddenNannytime = true;
          this.formGroup.patchValue({ nannytime: null })
        }
      });
    });
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [this.id],
      birthday: [,[Validators.required]],
      studentName: [, [Validators.required]],
      mobilePhone: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)]],
      followerId: [, [Validators.required]],
      memberFromId: [, [Validators.required]],
      near: [, [Validators.required]],
      carer: [, [Validators.required]],
      address: [, [Validators.required]],
      multiplebirth: [],
      born: [],
      babysitter: [],
      allworking: [],
      problems: [],
      nannytime: [],
      fatherJob: [],
      motherJob: []
    });
  }

  @DrawerClose() close: () => void;

  @ControlValid() valid: (key, type?) => boolean;

  editList(type,name){
    this.drawer.create({
      nzTitle: name,
      nzWidth: 700, 
      nzClosable: false,
      nzContent: UpdateListComponent,
      nzContentParams: { type: type, name: name }
    }).afterClose.subscribe(res => {
      if (res) {
      }
    })
  }
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
        this.saveList(res.data.id,this.formGroup.value);
        this.saveLoading = false;
        this.drawerRef.close(true);
      }).catch(err => {
        if (err.result == 1001) {
          this.preview({ id: err.data.id, source: 'visit' })
        }
        this.saveList(err.data.id,this.formGroup.value);
        this.saveLoading = false
      });

   

    }
  }
  saveList(studentId,from){
    let attributes = [ from.near, from.multiplebirth, from.born, from.carer, from.babysitter, from.allworking, from.nannytime, ...from.problems];
    let attribute = attributes.filter(d => d);
    this.http.post('/attribute/saveStudentAttribute', {
      studentId,
      paramJson: JSON.stringify(attribute)
    }, true).then(res => {
      this.saveLoading = false;
  
    })
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
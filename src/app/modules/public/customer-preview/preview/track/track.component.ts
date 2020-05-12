import { NzDrawerService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { GetList } from 'src/app/ng-relax/decorators/getList.decorator';
import { ControlValid } from 'src/app/ng-relax/decorators/form/valid.decorator';
import { AppointComponent } from '../../appoint/appoint.component';
import { UpdateListComponent } from '../../update-list/update-list.component'
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { withSuffix } from '@ant-design/icons-angular';

enum customerStatus {
  '持续跟进' = 1,
  '预约活动/体验' = 2,
  '移到无意向' = 3
}


@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.less'],
})
export class TrackComponent implements OnInit, OnChanges {

  @Input() studentInfo: any = {};
  @Input() indexId: number;
  formGroup: FormGroup;
  updateFormGroup: FormGroup;
  formGroupTop: FormGroup;

  followRecordList: any[] = [];
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
  stepList: any[] = [{
    label: '了解情况建立信任',
    id: 1
  },{
    label: '参与活动',
    id: 2
  },{
    label: '赠送礼品',
    id: 3
  },{
    label: '预约参观',
    id: 4
  },{
    label: '到园参观',
    id: 5
  },{
    label: '预约体验',
    id: 6
  },{
    label: '到园体验',
    id: 7
  },{
    label: '逼单转化',
    id: 8
  }]
  @GetList('/membermanage/returnVisit/getVisitStatus') memberStatusList: any | [];
  followTypeList: any[] = [];
  teacherList: any[] = [];
  @GetList('/membermanage/returnVisit/getActivities') activityList: any | [];
  @GetList('/student/getClassList') classList: any | [];
  reserveTeacherList: any[] = [];

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe,
    private drawer: NzDrawerService
  ) { 
    this.http.post('/teacher/getGrowthConsultant', { code: 1004 }).then(res => this.teacherList = res.data);
    this.http.post('/membermanage/returnVisit/getFollowTypes').then(res => {
      this.followTypeList = res.data;
      res.data.length && this.formGroup.patchValue({ followType: res.data[0].id });
    })
    typeof this.memberStatusList === 'function' && this.memberStatusList();
    typeof this.activityList === 'function' && this.activityList();
    typeof this.classList === 'function' && this.classList();
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
    });

  }

  ngOnInit() {
    setTimeout(item=>{
      if(this.indexId){ this.memberStatusList = [{ id: 5 , name: '家长嘱托' }] }else{
        for(let i = 0; i<this.memberStatusList.length; i++){
          let item = this.memberStatusList[i];
          if(item.id == 5){
            this.memberStatusList.splice(i,1);
          }
        }
      }
    },300);
    let controls = {
      id: [],
      visitStatusId: [ this.indexId ? 5 : 1, [Validators.required]],
      followType: [, [Validators.required]],
      nextFollowTime: [, [Validators.required]],
      enjoinId: [this.indexId ? this.indexId : null],
      stepStatus: [1, [Validators.required]],
      studentId: []
    }
    this.formGroup = this.fb.group(controls);
    this.updateFormGroup = this.fb.group(controls);

    this.formGroup.controls['visitStatusId'].valueChanges.subscribe(id => this.statusChange(id, 'formGroup'));
    this.updateFormGroup.controls['visitStatusId'].valueChanges.subscribe(id => this.statusChange(id, 'updateFormGroup'));
    this.formGroup.controls['followType'].valueChanges.subscribe(id => {
      if( id == 1 ){
        this.formGroup.addControl('content',this.fb.control( null, [Validators.required]));
        this.formGroup.removeControl('wxImage');
      }else{
        this.formGroup.addControl('wxImage',this.fb.control( null, [Validators.required]));
        this.formGroup.removeControl('content');
      }
    });
    this.formGroup.controls['stepStatus'].valueChanges.subscribe(id => {
      this.formGroup.removeControl('activity');
      this.formGroup.removeControl('gift');
      this.formGroup.removeControl('orderDate');
      this.formGroup.removeControl('arriveDate');
      this.formGroup.removeControl('receptionTeacher');
      this.formGroup.removeControl('visitName');
      this.formGroup.removeControl('point');
      this.formGroup.removeControl('worry');
      this.formGroup.removeControl('reserveClassId');
      this.formGroup.removeControl('experienceDate');
      this.formGroup.removeControl('nextStoreDate');
      this.formGroup.removeControl('responsibleTeacher');
      this.formGroup.removeControl('experienceTime');
      this.formGroup.removeControl('focus');
      this.formGroup.removeControl('worry2');
      this.formGroup.removeControl('babyPerformance');
      this.formGroup.removeControl('sellingPrice');
      this.formGroup.removeControl('payWorry');
      if(id == 2){ this.formGroup.addControl('activity',this.fb.control( null, [Validators.required])); }
      if(id == 3){ this.formGroup.addControl('gift',this.fb.control( null, [Validators.required])); }

      if(id == 4){ this.formGroup.addControl('orderDate',this.fb.control( null, [Validators.required])); }

      if(id == 5){
        this.formGroup.addControl('arriveDate',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('receptionTeacher',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('visitName',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('point',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('worry',this.fb.control( null, [Validators.required]));
      }
      if(id == 6){
        this.formGroup.addControl('reserveClassId',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('experienceDate',this.fb.control( null, [Validators.required]));
      }
      if(id == 7){
        this.formGroup.addControl('nextStoreDate',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('responsibleTeacher',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('experienceTime',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('focus',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('worry2',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('babyPerformance',this.fb.control( null, [Validators.required]));
      }
      if(id == 8){
        this.formGroup.addControl('sellingPrice',this.fb.control( null, [Validators.required]));
        this.formGroup.addControl('payWorry',this.fb.control( null, [Validators.required]));
      }     


    });
    
    let controls1={
      motherJob: [],
      fatherJob:[],
      multiplebirth:[],
      born:[],
      carer:[],
      babysitter:[],
      allworking:[],
      nannytime:[],
      problems:[],
      near: []
    }
    this.formGroupTop = this.fb.group(controls1);

  }
  ngOnChanges() {
    this.studentInfo.studentId && this.getFollowRecords() 
    this.studentInfo.studentId && this.getStudentInfoList()
  }
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


  statusChange(visitStatusId, group) {
    if(visitStatusId == 1){
      this[group].addControl('stepStatus', this.fb.control(1, [Validators.required]));
      this[group].removeControl('reason');
    }else if(visitStatusId == 3){
      this[group].removeControl('stepStatus');
      this[group].addControl('reason', this.fb.control(null, [Validators.required]));
    }
  }

  getFollowRecordsLoading: boolean;
  getFollowRecords() {
    this.getFollowRecordsLoading = true;
    this.http.post('/membermanage/returnVisit/getFollowRecords', { paramJson: JSON.stringify({ studentId: this.studentInfo.studentId }) }).then(res => {
      this.followRecordList = res.data;
      this.getFollowRecordsLoading = false;
    });
  }
  getStudentInfoList(){
    this.http.post('/attribute/getAttributeByStudent', { studentId	: this.studentInfo.studentId  }).then(res => {
        const list = res.data;
        let problems = [];
        list.map(item=>{
          if(item.attributeName == 'multiplebirth'){
            this.formGroupTop.patchValue({  multiplebirth: item.id })
          }
          if(item.born == 'multiplebirth'){
            this.formGroupTop.patchValue({  born: item.id })
          }
          if(item.attributeName == 'carer'){
            this.formGroupTop.patchValue({  carer: item.id })
          }
          if(item.attributeName == 'babysitter'){
            this.formGroupTop.patchValue({  babysitter: item.id })
          }
          if(item.attributeName == 'allworking'){
            this.formGroupTop.patchValue({  allworking: item.id })
          }
          if(item.attributeName == 'born'){
            this.formGroupTop.patchValue({  born: item.id })
          }
          if(item.attributeName == 'nannytime'){
            this.formGroupTop.patchValue({  nannytime: item.id })
          }
          if(item.attributeName == 'near'){
            this.formGroupTop.patchValue({  near: item.id })
          }
          if(item.attributeName == 'problems'){
            problems.push(item.id);
          }
        })
        this.formGroupTop.patchValue({  problems: problems })
    });
  }

  @ControlValid() valid: (key, type?) => boolean;

  validUpdateControl(key, type = 'required') {
    return this.updateFormGroup.controls[key].dirty && this.updateFormGroup.controls[key].hasError(type);
  }

  _disabledDate(current: Date): boolean {
    return current && current.getTime() < Date.now();
  }
  saveTopLoading: boolean;
  saveTop(group){
    if (this[group].invalid) {
      Object.values(this[group].controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      const from = this.formGroupTop.value;
      this.saveTopLoading = true;
      this.http.post('/attribute/saveStudentAttribute', {
        studentId: this.studentInfo.studentId,
        paramJson: JSON.stringify([ from.near, from.multiplebirth, from.born, from.carer, from.babysitter, from.allworking, from.nannytime, ...from.problems])
      }, true).then(res => {
        this.saveTopLoading = false;
      })
    }
  }

  saveLoading: boolean;
  save(group) {
    console.log(this[group].invalid,this[group]);
    if (this[group].invalid) {
      Object.values(this[group].controls).map((control: FormControl) => { control.markAsDirty(); control.updateValueAndValidity() });
    } else {
      this.saveLoading = true;
      this[group].value.nextFollowTime = this.format.transform(this[group].value.nextFollowTime, 'yyyy-MM-dd');
      this.activityList.map(a => a.id === this[group].value.activityId && (this[group].value.activityName = a.activityName));
      this[group].value.studentId = this.studentInfo.studentId;
      let jsons = this[group].value;
      let paramJson = JSON.parse(JSON.stringify(this[group].value))
      paramJson.formContent = jsons;
      this.http.post('/membermanage/returnVisit/saveClubFollowRecord', {
        paramJson: JSON.stringify(paramJson)
      }, true).then(res => {
        this.saveLoading = false;
        this.getFollowRecords();
        this.showUpdateRecord = false;
      }).catch(err => this.saveLoading = false);
    }
  }

  showUpdateRecord: boolean;
  updateFollowRecordData;
  updateFollowRecord(data) {
    this.updateFollowRecordData = data;
    this.updateFormGroup.patchValue(data);
    this.showUpdateRecord = true;
  }


  selectAppoint(group) {
    this.drawer.create({
      nzTitle: null,
      nzWidth: 1148, 
      nzClosable: false,
      nzContent: AppointComponent,
      nzContentParams: { studentInfo: this.studentInfo, classId: this[group].controls['reserveClassId'].value }
    }).afterClose.subscribe(res => {
      if (res) {
        this[group].patchValue({ reserveDate: res.reserveDate, pitNum: res.pitNum, reserveTeacherId: res.teacherId });
      }
    })
  }

}
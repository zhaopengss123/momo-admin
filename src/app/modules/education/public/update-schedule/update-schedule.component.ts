import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService, NzDrawerRef , NzDrawerService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UpdatetimeComponent } from '../updatetime/updatetime.component';


@Component({
  selector: 'app-update-schedule',
  templateUrl: './update-schedule.component.html',
  styleUrls: ['./update-schedule.component.less']
})
export class UpdateScheduleComponent implements OnInit {
  @Input() classId;
  classList: any[] = [];
  editName: string;
  listOfData: any[] = [];
  _queryForm: FormGroup;
  tableLoading: boolean = false;
  constructor(
    private message: NzMessageService,
    private drawerRef: NzDrawerRef,
    private drawer: NzDrawerService,
    private http: HttpService,
    private datePipe : DatePipe,

  ) { }

  ngOnInit() {
      this.getData();
  }

  uploadResult: any[] = [];
  uploadInfo: string;

  uploadComplate(e) {
    if (e.type === 'start') {
      this.uploadResult = [];
    }
    if (e.type === 'success') {
      this.message.create(e.file.response.result == 1000 ? 'success' : 'warning', e.file.response.message);
      if (e.file.response.result == 1000) {
        this.message.success(e.file.response.message || '操作成功');
      } else {
        this.uploadResult = e.file.response.data.errorClues;
        this.uploadInfo = `本次上传结果（${e.file.response.message}）`;
      }
    }
  }
  getData(){
    this.http.post('/courseConfig/listCoursePlan',{ classId: this.classId }).then(res => {
      res.data.list.map(item=>{
        item.status = item.runningStatus == 0 ? true : false;
      })
      this.listOfData = res.data.list;

    });
  }
  selectPlan(id){
    if(this.tableLoading){ return ; }
    this.tableLoading = true;
    this.http.post('/courseConfig/enableCoursePlan',{ id },true).then(res => {
      this.tableLoading = false;
      this.getData();
    });
  }
  addClass(){
    let json = {
      name: null,
      description: null,
      status: false,
      edit: true
    };
    this.listOfData.unshift(json);
  }
  dateChange(date,data){
    data.date = this.datePipe.transform( date, 'yyyy-MM-dd');
  }
  saveEdit(data){
    data.edit = false;
  
    if(!data.name){
      this.message.warning('名称不能为空！');
      return false;
    }
    let url:  string;
    if(!data.id){
       url ='/courseConfig/saveCoursePlan';
    }else{
       url = '/courseConfig/updateCoursePlan';
    }
    if(this.tableLoading){ return ; }
    this.tableLoading = true;
    this.http.post(url,{
      paramJson: JSON.stringify({
        id: data.id || null,
        name : data.name,
        description: data.description
      })
    }).then(res => {
      this.tableLoading = false;
      if(res.returnCode == "SUCCESS"){
        this.message.success('操作成功');
        data.edit = false;
        this.getData();
      }else{
        this.message.warning(res.returnMsg);
      }
    });
  }
  delete(data){
    this.http.post('/course/updateCourseType',{
      paramJson: JSON.stringify({
        id: data.id,
        status: -1
      })
    }).then(res => {
      if(res.returnCode == "SUCCESS"){
        this.message.success('操作成功');
        data.edit = false;
        this.getData();
      }else{
        this.message.warning(res.returnMsg);
      }
    });
  }
  cancel(data){
    if(!data.id){
        this.listOfData.splice(0,1);
    }
    data.edit = false;
  }
  updataTime(id){
    this.drawer.create({
      nzWidth: 1200,
      nzTitle: '时段管理',
      nzBodyStyle: { 'padding-bottom': '53px' },
      nzContent: UpdatetimeComponent,
      nzContentParams: { id , classId: this.classId }
    }).afterClose.subscribe(res => {})
  }
  
}

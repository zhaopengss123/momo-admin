import { Component, OnInit  } from '@angular/core';
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
  classList: any[] = [];
  editName: string;
  listOfData: any[] = [];
  _queryForm: FormGroup;
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
    // this.http.post('/course/listCourseType').then(res => {
    //   this.listOfData = res.data.list;
    // });
    this.listOfData = [];
  }
  addClass(){
    let json = {
      name: null,
      date: null,
      commit: null,
      status: true,
      edit: true
    };
    this.listOfData.unshift(json);
  }
  dateChange(date,data){
    data.date = this.datePipe.transform( date, 'yyyy-MM-dd');
  }
  saveEdit(data){
    data.edit = false;
    return false;
    if(!data.name){
      this.message.warning('类别名称不能为空！');
      return false;
    }
    let url:  string;
    if(!data.id){
        url =  '/course/saveCourseType';
    }else{
       url = '/course/updateCourseType';
    }
    this.http.post(url,{
      paramJson: JSON.stringify({
        id: data.id || null,
        name : data.name,
        description: data.description
      })
    }).then(res => {
      if(res.result == 1000){
        this.message.success('操作成功');
        data.edit = false;
        this.getData();
      }else{
        this.message.warning(res.message);
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
      if(res.result == 1000){
        this.message.success('操作成功');
        data.edit = false;
        this.getData();
      }else{
        this.message.warning(res.message);
      }
    });
  }
  cancel(data){
    if(!data.id){
        this.listOfData.splice(0,1);
    }
    data.edit = false;
  }
  addTime(){
    this.drawer.create({
      nzWidth: 720,
      nzTitle: '时段管理',
      nzBodyStyle: { 'padding-bottom': '53px' },
      nzContent: UpdatetimeComponent,
    }).afterClose.subscribe(res => {
        console.log('reset');
    })
  }
  
}

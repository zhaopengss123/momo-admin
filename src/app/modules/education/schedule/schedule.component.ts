import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { UpdateScheduleComponent } from '../public/update-schedule/update-schedule.component';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})
export class ScheduleComponent implements OnInit {
  datalist: any[] = [];
  listCourse:any[] = [];
  listClass: any[] = [];
  classId:number;
  constructor(
    private drawer: NzDrawerService,
    private http: HttpService, 
    private message: NzMessageService,
  ) {

  }

  ngOnInit() {
    this.http.post('/message/listClassMessage', {}, false).then(res => { this.listClass = res.data.list; this.classId = res.data.list[0].id; this.getData(); });

    this.http.post('/course/listCourseType', {}).then(res => {
      this.listCourse = res.data.list;
    });
    
  }
  selectClass(id){
    this.classId = id; 
    this.getData();
  }
  getData(){
    this.http.post('/courseConfig/getCourseDayTemplate', { classId: this.classId }, false).then(res => { 
      res.data.list.map(item=>{
        if(item.courseTypes){
          item.courseTypes = JSON.parse(item.courseTypes);
        }
      })
      this.datalist  = res.data.list;
  });
  }
  openUpdate(info = {}){
     this.drawer.create({
      nzWidth: 750,
      nzTitle: '配置日程',
      nzContent: UpdateScheduleComponent,
      nzContentParams: { 
        classId: this.classId
      }
    }).afterClose.subscribe(res => {
      this.getData();
  })
  }

}

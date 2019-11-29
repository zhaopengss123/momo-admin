import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { UpdateScheduleComponent } from './../public/update-schedule/update-schedule.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})
export class ScheduleComponent implements OnInit {
  datalist: any[] = [{
    date : '08:00-08:30',
    name: '名称名称名称',
    istrue: false,
    commit: '保健医在门口为宝宝体检。教师到教室带领宝宝如厕，清洁双手，集体饮水，早操活动'
  },{
    date : '08:00-08:30',
    name: '名称名称名称',
    istrue: false,
    commit: '保健医在门口为宝宝体检。教师到教室带领宝宝如厕，清洁双手，集体饮水，早操活动保健医在门口为宝宝体检。教师到教室带领宝宝如厕，清洁双手，集体饮水，早操活动保健医在门口为宝宝体检。教师到教室带领宝宝如厕，清洁双手，集体饮水，早操活动保健医在门口为宝宝体检。教师到教室带领宝宝如厕，清洁双手，集体饮水，早操活动保健医在门口为宝宝体检。教师到教室带领宝宝如厕，清洁双手，集体饮水，早操活动'
  },{
    date : '08:00-08:30',
    name: '名称名称名称',
    istrue: false,
    commit: '保健医在门口为宝宝体检。教师到教室带领宝宝如厕，清洁双手，集体饮水，早操活动'
  }];
  constructor(
    private drawer: NzDrawerService,
    private http: HttpService, 
    private message: NzMessageService,
  ) {

  }

  ngOnInit() {
    this.getData();
  }
  getData(){
    this.http.post('/courseConfig/getCourseDayTemplate', { }, false).then(res => { 
      this.datalist  = res.data.list;
  });
  }
  openUpdate(info = {}){
    const drawer = this.drawer.create({
      nzWidth: 750,
      nzTitle: '配置日程',
      nzContent: UpdateScheduleComponent,
      nzContentParams: { }
    }).afterClose.subscribe(res => {
      this.getData();
  })
  }

}

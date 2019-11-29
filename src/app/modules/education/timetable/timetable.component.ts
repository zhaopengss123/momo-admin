import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { AdjustmentComponent } from '../public/adjustment/adjustment.component';
@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.less']
})
export class TimetableComponent implements OnInit {
  week: number = 0;
  listClass: any[] = [];
  dateIndex: any = 0;
  startDate: string;
  endDate: string;
  isOkLoading: any = false;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  dataList: any[] = [];
  classId: number;
  courseDayList: any[] = [];
  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) {
  }

  ngOnInit() {
    this.http.post('/message/listClassMessage', {}, false).then(res => { this.listClass = res.data.list; this.classId  = res.data.list[0].id; this.getCourseDayConfig(); });
    this.nowDate();
    this.getData();
  }

  select(data) {

  }
  getCourseDayConfig(){
    this.http.post('/courseConfig/queryCourseDayConfig', {
      classId: this.classId,
      startDate: this.startDate,
      endDate: this.endDate
    }, false).then(res => {
        res.data.list.map((item,index)=>{
          item.courses = item.courses.substring(1,item.courses.length - 1);
          item.coursesList = item.courses.split(',');
          let arr = [];
          item.coursesList.map((umm,eqs) =>{
            let ummlist = umm.split(':');
            let json = {
              template :  ummlist[0],
              cid: ummlist[1]
            };
            this.courseInfo(ummlist[1],index,eqs)
            arr.push(json);
          })
          item.courseList = arr;
        })
        this.courseDayList = res.data.list;
        
     });
  }
  courseInfo(id,index,eqs){
    this.http.post('/course/getCourseInfo', {
      id: id
    }, false).then(res => {
      this.courseDayList[index].courseList[eqs].data = res.data;
    });
  }
  getData(){
    this.http.post('/courseConfig/getCourseDayTemplate', {}, false).then(res => { 
      this.dataList = res.data.list;
     });
  }
  selectClass(id){
    this.classId = id;
    this.getCourseDayConfig();
  }
  nowDate() {
    this.dateIndex = 0;
    this.datefun(0);
  }
  nextDate() {
    this.dateIndex++;
    this.datefun(this.dateIndex * 7);
  }
  prveDate() {
      this.dateIndex--;
      this.datefun(this.dateIndex * 7);
  }
  datefun(index) {
    let now: any = new Date();
    let nowDayOfWeek = now.getDay();
    nowDayOfWeek = nowDayOfWeek == 0 ? 7 : nowDayOfWeek;
    this.startDate = this.showWeekFirstDay(1 - nowDayOfWeek + index);
    this.Tuesday = this.showWeekFirstDay(2 - nowDayOfWeek + index);;
    this.Wednesday = this.showWeekFirstDay(3 - nowDayOfWeek + index);;
    this.Thursday = this.showWeekFirstDay(4 - nowDayOfWeek + index);;
    this.Friday = this.showWeekFirstDay(5 - nowDayOfWeek + index);;
    this.Saturday = this.showWeekFirstDay(6 - nowDayOfWeek + index);;
    this.endDate = this.showWeekFirstDay(7 - nowDayOfWeek + index);
  };
  addCustomer(){
    const drawer = this.drawer.create({
      nzWidth: 1200,
      nzTitle: '排课/调整',
      nzContent: AdjustmentComponent,
      nzContentParams: { 
        classId: this.classId,
        startDate: this.startDate,
        endDate: this.endDate,
        Tuesday: this.Tuesday,
        Wednesday: this.Wednesday,
        Thursday: this.Thursday,
        Friday: this.Friday,
        Saturday: this.Saturday

      }
    });
    drawer.afterClose.subscribe(res => {

    });
}
  showWeekFirstDay(i) {
    var day3 = new Date();
    day3.setTime(day3.getTime() + i * 24 * 60 * 60 * 1000);
    let Month = (day3.getMonth() + 1) < 10 ? '0' + (day3.getMonth() + 1) : (day3.getMonth() + 1);
    let dayDate = (day3.getDate()) < 10 ? '0' + (day3.getDate()) : (day3.getDate());
    var s3 = day3.getFullYear() + "-" + Month + "-" + dayDate;
    return s3;
  }
 



}

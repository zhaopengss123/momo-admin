import { HttpService } from '../../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { FormGroup , FormBuilder} from '@angular/forms';
import { SelectClassComponent } from '../select-class/select-class.component';
@Component({
  selector: 'app-adjustment',
  templateUrl: './adjustment.component.html',
  styleUrls: ['./adjustment.component.less']
})
export class AdjustmentComponent implements OnInit {
  @Input() classId;
  @Input() startDate;
  @Input() endDate;
  @Input() Tuesday;
  @Input() Wednesday;
  @Input() Thursday;
  @Input() Friday;
  @Input() Saturday;  
  courseDayList:any[] = [];
  dataList:any[] = [];
  listClass:any[] = [];
  className:string;ß
  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
    private fb: FormBuilder = new FormBuilder()
  ) {
    this.http.post('/message/listClassMessage', {}, false).then(res => { 
      this.listClass = res.data.list;
      res.data.list.map(item=>{
        if(item.id == this.classId){
          this.className = item.className;
        }
      })
     });
  }

  ngOnInit() {
    this.getData();
    this.getCourseDayConfig();
  }
  getData(){
    this.http.post('/courseConfig/getCourseDayTemplate', {}, false).then(res => { 
      this.dataList = res.data.list;
     });
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
 
  editorx(data){
    const drawer = this.drawer.create({
      nzWidth: 720,
      nzTitle: '选择课程',
      nzContent: SelectClassComponent,
      nzContentParams: { }
    });
    drawer.afterClose.subscribe(res => {

    });
}

 



}

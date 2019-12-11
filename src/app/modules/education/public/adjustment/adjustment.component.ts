import { HttpService } from '../../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd';
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
  planId: number = 0;
  courseDayList:any[] = [];
  dataList:any[] = [];
  listClass:any[] = [];
  className:string;
  saveLoading: boolean = false;
  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
    private fb: FormBuilder = new FormBuilder(),
    private drawerRef: NzDrawerRef,
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
    this.http.post('/courseConfig/getCourseDayTemplate', { classId : this.classId }, false).then(res => { 
      this.dataList = res.data.list;
      if( !res.data.list.length){ return false; }
      this.planId = res.data.list[0].planId;
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
 
  editorx(data,dates){
    const drawer = this.drawer.create({
      nzWidth: 800,
      nzTitle: '选择课程',
      nzContent: SelectClassComponent,
      nzContentParams: { }
    });
    drawer.afterClose.subscribe(res => {
        if(res){
          let result = res[0];
          let isdate = false;
          this.courseDayList.map(item=>{
            if(item.configDate == dates){
                isdate = true;
                item.courseList.map((ytime,index)=>{
                    if(ytime.template == data.id){
                      item.courseList.splice(index,1);
                    }
                })
                let json:any = { data:{}  };
                json.template = data.id;
                json.data.name = result.name;
                json.cid = result.id;
                item.courseList.push(json);
            }
            
          })

          if(!isdate){
            let addJson:any = {
              courseList: [],
              classId : this.classId,
              planId : this.planId
            };
            addJson.configDate = dates;
            let json:any = { data:{}  };
            json.template = data.id;
            json.data.name = result.name;            
            json.cid = result.id;
            addJson.courseList.push(json);
            this.courseDayList.push(addJson);
          }
        }
    });
}
saves(){
  let list = JSON.parse(JSON.stringify(this.courseDayList));
  list.map(item=>{
    item.courses = '';
    item.courseList.map((sjItem,index)=>{
      item.courses += sjItem.template + ':' + sjItem.cid; 
      if(index != item.courseList.length - 1){
        item.courses+=',';
      }
    })
    item.courses = '{' + item.courses + '}';
  })
  if(this.saveLoading){ return ; }
  this.saveLoading = true;
  this.http.post('/courseConfig/saveCourseDayConfig', {
    paramJson: JSON.stringify(list)
  }, true).then(res => {
    this.saveLoading  = false;
    this.drawerRef.close(true);
  });
}
close(){
  this.drawerRef.close(false);

}


}

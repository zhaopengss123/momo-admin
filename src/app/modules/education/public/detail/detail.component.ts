import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { LessonDetailComponent } from '../lesson-detail/lesson-detail.component';
import { NzDrawerRef , NzDrawerService  } from 'ng-zorro-antd';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  @Input() info;
  listArr: any[];
  listCourseType:any[] = [];
  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef,
    private drawer: NzDrawerService,
  ) {

  }

  ngOnInit() {
    if(!this.info.name){
      this.http.post('/course/queryCourse', { 
        paramJson: JSON.stringify({name:this.info.data.name}),
        pageNum:1,
        pageSize:10
      }).then(res => {
          if(res.result == 1000){
            this.info = res.data.list[0];
            this.getTypeName();
          }
      });
    }else{
      this.getTypeName();
    }
    let lesson:any[] = this.info.lesson && this.info.lesson.split(',') || [];
    this.listArr = lesson;

  }
  getTypeName(){
    this.http.post('/course/listCourseType', { 
    }).then(res => {
      this.listCourseType = res.data.list;
      this.listCourseType.map(item =>{
          if(this.info.typeId == item.id){
            this.info.typeName = item.name;
          }
      })
    });
  }
  downloadppt(content) {
    this.drawer.create({
      nzWidth: 820,
      nzTitle: '教案详情',
      nzBodyStyle: { 'padding-bottom': '53px' },
      nzContent: LessonDetailComponent,
      nzContentParams: { content }
    }).afterClose.subscribe(res => {
    })
  }
  openvideo() {
    let vedio:any[] = this.info.vedio.split(',');
    vedio && vedio.map(item=>{
      setTimeout(()=>{
        window.open(item);
      },200)
    })
  }
}

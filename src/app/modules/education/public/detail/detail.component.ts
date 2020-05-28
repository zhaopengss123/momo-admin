import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { InformationComponent } from 'src/app/modules/public/customer-preview/preview/information/information.component';

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
  downloadppt() {
    let lesson:any[] = this.info.lesson.split(',');
    this.listArr = lesson;
    lesson && lesson.map(item=>{
      setTimeout(()=>{
        window.open(item);
      },200)
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

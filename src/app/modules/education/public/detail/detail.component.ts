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
  listCourseType:any[] = [];
  constructor(
    private http: HttpService,
  ) {

  }

  ngOnInit() {
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
    let lesson = this.info.lesson;
    if(lesson){ window.open(lesson) };
  }
  openvideo() {
    let vedio = this.info.vedio;
    if(vedio){ window.open(vedio) };
  }
}

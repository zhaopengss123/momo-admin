import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.less']
})
export class AttendanceComponent implements OnInit {

  @Input() studentId: number;
  domain = environment.domain;

  constructor(
    private http: HttpService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
  }
  openDiary(data){
    let token = JSON.parse(localStorage.getItem('userInfo')).token;    
    this.http.post('/diary/get', {  studentId: this.studentId, queryDate: data.date  }).then(res => {
        if(res && res.data.contentJson){
            window.open(`http://wx.haochengzhang.com/ylbb-activity-memberdetail/?studentId=${ this.studentId }&queryDate=${ data.date }&token=${ token }&domain=${ this.domain }`);
        }else{
          this.message.warning('该学员未生成成长日记');
          }
    })
  }
}

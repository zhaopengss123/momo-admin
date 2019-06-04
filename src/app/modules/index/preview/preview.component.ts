import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { subMonths, addMonths, format } from 'date-fns';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less']
})
export class PreviewComponent implements OnInit {

  dataSet: any[] = [];

  today = this.format.transform(new Date, 'yyyy-MM-dd');

  private classList: any[] = [];
  constructor(
    private http: HttpService,
    private format: DatePipe,
  ) { 
    this.http.post('/reserve/getClassWithTeacher').then(res => {
      this.dataSet = res.data ? res.data.list : [];
      this.dataSet.map(classes => {
        let receptionNum = 0;
        classes.teachers.map(teacher => receptionNum += teacher.receptionNum);
        classes.teacherReceptionNum = receptionNum;
      })
      this.getData();
    });
  }

  ngOnInit() {
  }

  getData(type?: 'up'/* ? 上一月 */ | 'down' /* ? 下一月  */){
    
    // let month = format(type === 'up' ? subMonths(new Date(this.dataSet[0].key), 1) : type === 'down' ? addMonths(new Date(this.dataSet[this.dataSet.length - 1].key), 1) : new Date(), 'YYYY-MM');
    // this.dataSet[type === 'up' ? 'unshift' : 'push']({ key: month, value: JSON.parse(JSON.stringify(this.classInfo.data.list)), days: new Array(this._monthOfDays(month)) });
  }



  /**
   * @function 根据年月获取该月天数
   */
  private _monthOfDays(d): number {
    let [y, m] = d.split('-');
    let m31 = ['01', '03', '05', '07', '08', '10', '12'];
    let m30 = ['04', '06', '09', '11'];
    return m31.includes(m) ? 31 : m30.includes(m) ? 30 : Number(y % 4) === 0 ? 29 : 28;
  }

}

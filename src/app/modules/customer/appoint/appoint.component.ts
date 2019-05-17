import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { addMonths, subMonths, format } from 'date-fns';

@Component({
  selector: 'app-appoint',
  templateUrl: './appoint.component.html',
  styleUrls: ['./appoint.component.less']
})
export class AppointComponent implements OnInit {

  @Input() studentInfo: any = {};

  dataSet: AppointData[] = [];

  constructor(
    private http: HttpService
  ) { }

  ngOnInit() {
    console.log(format(addMonths(new Date(), 1), 'YYYY-MM'))
  }

  async getData(type?: 'up' | 'down') {
    let classInfo = await this.http.post('/reserve/getClassWithTeacher', { classId: this.studentInfo.gradeId });
    let month = format(type === 'up' ? subMonths(new Date(this.dataSet[0].key), 1) : type === 'down' ? addMonths(new Date(this.dataSet[0].key), 1) : new Date(), 'YYYY-MM');
    let dataSet = await this.http.post('/getReserveRecordByTeacher', { teacherId: classInfo.teacherId, startMonth: month, endMonth: month });
  }

}


interface AppointData {
  key: string;
  value: any[];
}
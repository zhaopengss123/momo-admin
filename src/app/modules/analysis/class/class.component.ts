import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzMessageService } from 'ng-zorro-antd';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';
import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/ng-relax/services/http.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.less']
})
export class ClassComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageComponent;

  queryNode: QueryNode[] = [
    {
      label       : '选择班级',
      key         : 'classId',
      type        : 'select',
      optionKey   : { label: 'className', value: 'id' },
      optionsUrl  : '/message/listClassMessage'
    },
    {
      label       : '起止日期',
      type        : 'rangepicker',
      key         : 'time',
      valueKey    : ['startDate', 'endDate'],
      default     : [ new Date(), new Date()]
    }
  ];
  paramsInit;

  constructor(
    private http: HttpService,
    private format: DatePipe,
    private message: NzMessageService
  ) {
    this.paramsInit = {
      startDate: this.format.transform(new Date(), 'yyyy-MM-dd'),
      endDate: this.format.transform(new Date(), 'yyyy-MM-dd'),
    };
   }

  ngOnInit() {
  }

  generate() {
    let value = this.listPage.eaQuery._queryForm.value;
    if (value.time || value.startDate) {
      let params = { startDate: value.startDate || this.format.transform(value.time[0], 'yyyy-MM-dd'), endDate: value.endDate || this.format.transform(value.time[1], 'yyyy-MM-dd') };
      this.http.post('/reserve/generateReserveStatistics',params, true).then(res => {
        this.listPage.eaQuery._submit();
      })
    } else {
      this.message.warning('请选查询条件');
    }
  }

  getTeachers(e) {
    console.log(123456);
    e.map(res => this.http.post('/message/getTeacherListByClass', { classId: res.id }).then(teachers => {
      res.teachers = [];
      teachers.data.map(tc => res.teachers.push(tc.name));
      res.teachers = res.teachers.join(',');
    }));
  }
}

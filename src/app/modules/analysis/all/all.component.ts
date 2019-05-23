import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzMessageService } from 'ng-zorro-antd';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';
import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/ng-relax/services/http.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.less']
})
export class AllComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageComponent;

  queryNode: QueryNode[] = [
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
    let time = this.listPage.eaQuery._queryForm.value.time;
    if (time[0]) {
      let params = { startDate: this.format.transform(time[0], 'yyyy-MM-dd'), endDate:this.format.transform(time[1], 'yyyy-MM-dd') };
      this.http.post('/reserve/generateReserveStatistics',params, true).then(res => {
        this.listPage.eaQuery._submit();
      })
    } else {
      this.message.warning('请选查询条件');
    }
  }
}



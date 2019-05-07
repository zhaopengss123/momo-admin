import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from './../../../ng-relax/services/http.service';
import { QueryComponent } from './../../../ng-relax/components/query/query.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { Component, ViewChild, OnInit } from '@angular/core';


@Component({
  selector: 'app-examine',
  templateUrl: './examine.component.html',
  styleUrls: ['./examine.component.scss']
})
export class ExamineComponent implements OnInit {

  @ViewChild('eaQuery') eaQuery: QueryComponent

  queryNode: QueryNode[] = [
    {
      label: '时间',
      type: 'datepicker',
      key: 'startTime'
    },
    {
      label: '孩子',
      type: 'select',
      key: 'studentId',
      options: [],
      optionKey: { label: 'studentName', value: 'id' },
    },
    {
      label: '班级',
      type: 'select',
      key: 'classId',
      optionKey: { label: 'className', value: 'id' },
      optionsUrl: '/message/listClassMessage'
    }
  ]

  loading: boolean;

  dataSet: any[] = [];

  eventList: any[] = [];

  checkAuth: number;

  constructor(
    private http: HttpService,
    private message: NzMessageService
  ) {
    this.http.post('/message/listEvent', {}, false).then(res => this.eventList = res.data.list);
    this.query();
  }

  ngOnInit() { }


  queryParams: any = {
    pageNo: 1,
    totalCount: 0
  };
  loadData(pi: number): void {
    this.queryParams.pageNo = pi;
    this.query();
  }
  querySubmit(params) {
    this.queryParams = Object.assign({ pageNo: 1, totalCount: this.queryParams.totalCount }, params);
    this.query();
  }
  query() {
    this.loading = true;
    this.http.post('/message/listEventByCondition', { paramJson: JSON.stringify(Object.assign(this.queryParams, { auditStatus: 1})) }, false).then(res => {
      this.loading = false;
      this.checkAuth = res.data.checkAuth;
      this.queryParams.totalCount = res.data.totalCount;
      res.data.list.map(item => {
        try {
          item.appContent = JSON.parse(item.appContent);
          item.appContent.content = item.appContent.content.split('|~!|').join('<i>|</i>');
        } catch (error) {
          item.appContent = { content: '', videoUrl: '', imgUrlList: [] };
        }
        return item;
      });
      this.dataSet = res.data.list;
    })
  }

  showEventList: boolean;

  showExamine: boolean;
  operExamine() {
    this.showExamine = true;
    this.dataSet.map(res => res.checked = false);
  }


  previewUrl(url) {
    window.open(url)
  }

  batchStatus(auditStatus) {
    let ids = [];
    this.dataSet.map(res => res.checked && ids.push(res.id));
    if (ids.length) {
      this.http.post('/event_record/udpateEventAuditStatus', {
        paramJson: JSON.stringify({
          ids: ids.join(','),
          deleteOrUpdate: '1',
          auditStatus
        })
      }).then(res => {
        this.showExamine = false;
        this.query();
      });
    } else {
      this.message.warning('请选择需要审核的数据');
    }
  }

}

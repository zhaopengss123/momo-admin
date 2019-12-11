import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { HttpService } from './../../../ng-relax/services/http.service';
import { QueryComponent } from './../../../ng-relax/components/query/query.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UpdateComponent } from './update/update.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-examine',
  templateUrl: './examine.component.html',
  styleUrls: ['./examine.component.less']
})
export class ExamineComponent implements OnInit, AfterViewInit {

  @ViewChild('eaQuery') eaQuery: QueryComponent
  allChecked: boolean = false;
  indeterminate: boolean = true;
  domains = environment.domain;
  queryNode: QueryNode[] = [
    {
      label: '事件',
      type: 'select',
      key: 'eventCode',
      optionKey: { label: 'eventName', value: 'eventCode' },
      optionsUrl: '/message/listEvent'
    },
    {
      label: '审核状态',
      type: 'select',
      key: 'auditStatus',
      default: 1,
      options: [{ name: '无需审核', id: 0 }, { name: '未审核', id: 1 }, { name: '审核通过', id: 2 }, { name: '审核未通过', id: 3 }]
    },
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
    },

  ]

  loading: boolean;

  dataSet: any[] = [];

  eventList: any[] = [];

  checkAuth: number;

  constructor(
    private drawer: NzDrawerService,
    private http: HttpService,
    private message: NzMessageService
  ) {
    this.http.post('/message/listEvent', {}, false).then(res => this.eventList = res.data.list);
    this.query();
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.eaQuery._queryForm.get('classId').valueChanges.subscribe(classId => {
      if (classId) {
        this.http.post('/message/listStuByClassId', { classId }, false).then(res => {
          this.eaQuery.node.map(control => {
            control.key == 'studentId' && (control.options = res.data.list);
          })
        })
      } else {
        this.eaQuery.node.map(control => control.key == 'studentId' && (control.options = []));
      }
      this.eaQuery._queryForm.patchValue({ studentId: null });
    });
  }
  allSelect() {
    let allchecked = false;
    if (this.dataSet.every(item => !item.checked)) {
      allchecked = true;
    } else if (this.dataSet.every(item => item.checked)) {
      allchecked = false;
    }else{
      allchecked = true;
    }
    if (allchecked) {
      this.dataSet.map(item => { item.checked = true; })
    } else {
      this.dataSet.map(item => { item.checked = false; })
    }
  }
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
    this.queryParams.auditStatus = this.queryParams.auditStatus || this.queryParams.auditStatus == 0 ? this.queryParams.auditStatus : 1;
    this.http.post('/message/listEventByCondition', { paramJson: JSON.stringify(this.queryParams) }, false).then(res => {
      this.loading = false;
      this.checkAuth = res.data.checkAuth;
      this.queryParams.totalCount = res.data.totalCount;
      res.data.list.map(item => {
        try {
          item.appContent = JSON.parse(item.appContent);
          item.appContent.content = item.appContent.content.split('|~!|').join('<br>');
        } catch (error) {
          item.appContent = { content: '', videoUrl: '', imgUrlList: [] };
        }
        return item;
      });
      this.dataSet = res.data.list;
    })
  }
  update(eventInfo) {
    const drawer = this.drawer.create({
      nzWidth: 400,
      nzTitle: `编辑“${eventInfo.eventName}”事件`,
      nzContent: UpdateComponent,
      nzContentParams: { eventInfo }
    });
    drawer.afterClose.subscribe(res => res && this.query());
  }
  showEventList: boolean;




  previewUrl(url) {
    window.open(url)
  }
  preview(item){
    let token = JSON.parse(localStorage.getItem('userInfo')).token;    
    let reserveDate = item.startTime.slice(0,10);
    window.open(`http://wx.haochengzhang.com/ylbb-activity-memberdetail/?studentId=${ item.studentId }&queryDate=${ reserveDate }&token=${ token }&domain=${ this.domains }&audit=1`);
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
        this.query();
      });
    } else {
      this.message.warning('请选择需要审核的数据');
    }
  }

}

import { ListComponent } from './list/list.component';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzDrawerService } from 'ng-zorro-antd';
import { UpdateComponent } from './update/update.component';
import { PreviewComponent } from '../public/customer-preview/preview/preview.component';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  info: any = {};

  dayTimeList: any[] = [];
  overdueList: any[] = [];
  adjustList: any[] = [];
  studentList: any[] = [];
  visitList: any[] = [];
  getLackCardTimeList = '/message/getLackCardTimeList';
  getOverdueList = '/message/getOverdueList';
  getAdjustList = '/message/getAdjustClassStudentList';
  getBirthdayStudentList = '/message/getBirthdayStudentList';
  getVisitList = '/message/getTodayReturnVisitList';
  tableNode = ['姓名', '班级', '嘱托内容', '关系', '时间', '操作'];

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) {
    this.http.post('/message/getGartenMessage', {}, false).then(res => this.info = res.data);

    this.http.post(this.getLackCardTimeList, { paramJson: JSON.stringify({pageNum: 1, pageSize: 4}) }).then(res => this.dayTimeList = res.data.list);
    this.http.post(this.getOverdueList, { paramJson: JSON.stringify({pageNum: 1, pageSize: 4}) }).then(res => this.overdueList = res.data.list);
    this.http.post(this.getAdjustList, { paramJson: JSON.stringify({pageNum: 1, pageSize: 4}) }).then(res => this.adjustList = res.data.list);
    this.http.post(this.getVisitList).then(res => this.visitList = res.data);
    this.getBirthdayList(1);
  }

  ngOnInit() {
  }

  update() {
    this.drawer.create({
      nzWidth: 720,
      nzTitle: '园所信息',
      nzContent: UpdateComponent,
      nzContentParams: { info: this.info }
    }).afterClose.subscribe(res => res && (this.info = res));
  }

  more(url, title) {
    this.drawer.create({
      nzWidth: 600,
      nzTitle: title,
      nzClosable: false,
      nzContent: ListComponent,
      nzContentParams: { url }
    })
  }

  getBirthdayList(type) {
    this.studentList = [];
    this.http.post(this.getBirthdayStudentList, { paramJson: JSON.stringify({ pageNum: 1, pageSize: 4, type }) }).then(res => this.studentList = res.data.list);
  }

  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({ id: number }) => void;

}

import { ListComponent } from './list/list.component';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzDrawerService } from 'ng-zorro-antd';
import { UpdateComponent } from './update/update.component';

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
  getLackCardTimeList = '/message/getLackCardTimeList';
  getOverdueList = '/message/getOverdueList';
  getAdjustList = '/message/getAdjustClassStudentList';

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) {
    this.http.post('/message/getGartenMessage', {}, false).then(res => this.info = res.data);

    this.http.post(this.getLackCardTimeList, { paramJson: JSON.stringify({pageNum: 1, pageSize: 4}) }).then(res => this.dayTimeList = res.data.list);
    this.http.post(this.getOverdueList, { paramJson: JSON.stringify({pageNum: 1, pageSize: 4}) }).then(res => this.overdueList = res.data.list);
    this.http.post(this.getAdjustList, { paramJson: JSON.stringify({pageNum: 1, pageSize: 4}) }).then(res => this.adjustList = res.data.list);
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

  more(url) {
    this.drawer.create({
      nzWidth: 600,
      nzContent: ListComponent,
      nzContentParams: { url }
    })
  }

}

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

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) {
    this.http.post('/message/getGartenMessage', {}, false).then(res => this.info = res.data);
  }

  ngOnInit() {
  }

  update() {
    this.drawer.create({
      nzWidth: 720,
      nzTitle: '园所信息',
      nzContent: UpdateComponent,
      nzContentParams: { info: this.info }
    }).afterClose.subscribe(res => this.info = res);
  }

}

import { ListPageSimpComponent } from './../../../ng-relax/components/list-page-simp/list-page.component';
import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { AnnouncementComponent } from './announcement/announcement.component';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageSimpComponent;

  showContent: boolean;
  contentHtml: string;

  loading: boolean;

  dataSet: any[] = [];

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) { 
  }

  ngOnInit() {
  }


  announcement() {
    const drawer = this.drawer.create({
      nzWidth: 720, 
      nzTitle: '发布公告',
      nzContent: AnnouncementComponent
    });
    drawer.afterClose.subscribe(res => res && this.listPage.eaTable._request());
  }

}

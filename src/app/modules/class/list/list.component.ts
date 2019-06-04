import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { UpdateComponent } from './update/update.component';
import { PreviewComponent } from './preview/preview.component';
import { ListPageSimpComponent } from './../../../ng-relax/components/list-page-simp/list-page.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild('listPage') listPage: ListPageSimpComponent;

  queryNode: QueryNode[] = [
    {
      label: '班级名称',
      key: 'className',
      type: 'input'
    },
    {
      label       : '宝宝月龄',
      key         : 'yueling',
      valueKey    : ['startMonthAge', 'endMonthAge'],
      type        : 'between',
      placeholder: ['月龄最小值', '月龄最大值']
    }
  ];
  loading: boolean;

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) { 
  }

  ngOnInit() {
  }

  update(classInfo = {}) {
    const drawer = this.drawer.create({
      nzWidth: 720,
      nzTitle: '班级信息',
      nzContent: UpdateComponent,
      nzContentParams: { classInfo }
    });
    drawer.afterClose.subscribe(res => res && this.listPage.eaTable._request());
  }

  delete(classId) {
    this.http.post('/classmanager/deleteClassById', { classId }, true).then(res => this.listPage.eaTable._request())
  }

  preview(info) {
    this.drawer.create({
      nzWidth: 720,
      nzTitle: info.className,
      nzContent: PreviewComponent,
      nzContentParams: { id: info.id }
    }).afterClose.subscribe(res => res && this.listPage.eaTable._request());
  }

}

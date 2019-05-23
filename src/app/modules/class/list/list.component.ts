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
    }
  ];
  loading: boolean;

  classList: any[] = [];

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) { 
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.loading = true;
    this.http.post('/classmanager/listClassMessage', {}, false).then(res => {
      this.classList = res.data.list;
      this.loading = false;
    }).catch(err => this.loading = false);
  }

  update(classInfo = {}) {
    const drawer = this.drawer.create({
      nzWidth: 720,
      nzTitle: '班级信息',
      nzContent: UpdateComponent,
      nzContentParams: { classInfo }
    });
    drawer.afterClose.subscribe(res => res && this.getData());
  }

  delete(classId) {
    this.http.post('/classmanager/deleteClassById', { classId }).then(res => this.getData())
  }

  preview(info) {
    this.drawer.create({
      nzWidth: 720,
      nzTitle: info.className,
      nzContent: PreviewComponent,
      nzContentParams: { id: info.id }
    }).afterClose.subscribe(res => res && this.getData());
  }

}

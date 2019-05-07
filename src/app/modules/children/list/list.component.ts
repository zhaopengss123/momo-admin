import { QuitComponent } from './quit/quit.component';
import { ListPageSimpComponent } from './../../../ng-relax/components/list-page-simp/list-page.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UpdateComponent } from './update/update.component';
import { ImportComponent } from './import/import.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageSimpComponent;

  tabIndex: number = 0;

  domain = environment.domain;

  queryNode: QueryNode[] = [
    {
      label: '状态',
      key: 'status',
      type: 'select',
      options: [{ name: '在校', id: 1 }, { name: '离职', id: 2 }]
    }
  ];

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit() {}

  update(id = null) {
    const drawer = this.drawer.create({
      nzTitle: '孩子信息',
      nzWidth: 720,
      nzContent: UpdateComponent,
      nzContentParams: { id }
    });
    drawer.afterClose.subscribe(res => res && this.listPage.eaTable._request());
  }

  @ViewChild('quit') quit: QuitComponent;
  remark: string;
  deleteId: number;
  delete(id, nzContent, nzFooter) {
    this.remark = null;
    this.deleteId = id;
    this.modal.create({
      nzTitle: '删除原因',
      nzContent,
      nzFooter,
    })
  }
  deleteEnter() {
    if (!this.remark) {
      this.message.warning('请输入删除原因');
    } else {
      this.http.post('/student/updateStudentStatus', { paramJson: JSON.stringify({ studentIds: this.deleteId, leaveReason: this.remark }) }).then(res => {
        this.listPage.eaTable._request();
        this.quit['listPage'].eaTable._request();
        this.modal.closeAll();
      });
    }
  }
  cancel() {
    this.modal.closeAll();
  }

  import() {
    const drawer = this.drawer.create({
      nzTitle: '导入学生',
      nzWidth: 720,
      nzContent: ImportComponent
    });
    drawer.afterClose.subscribe(res => res && this.listPage.eaTable._request());
  }

  export() {
    let token = JSON.parse(localStorage.getItem('userInfo')).token;
    window.open(`${this.domain}/student/exportStudent?paramJson=${encodeURIComponent(JSON.stringify({ stuStatus: this.tabIndex + 1 }))}&token=${token}`);
  }

}

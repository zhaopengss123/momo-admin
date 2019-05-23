import { QuitComponent } from './quit/quit.component';
import { ListPageSimpComponent } from './../../../ng-relax/components/list-page-simp/list-page.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UpdateComponent } from './update/update.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageSimpComponent;

  queryNode: QueryNode[] = [
    {
      label: '状态',
      key: 'status',
      type: 'select',
      options: [ {name: '在校', id: 1 }, { name: '离职', id: 2 } ]
    },
    {
      label: '老师名称',
      key: 'name',
      type: 'input'
    },
    {
      label: '手机号',
      key: 'mobilePhone',
      type: 'input'     
    }
  ];

  // queryNode: QueryNode[] = [
  //   {
  //     label       : '通道名',
  //     key         : 'placeName',
  //     type        : 'input'
  //   },
  //   {
  //     label       : '设备号',
  //     key         : 'serialNum',
  //     type        : 'input'
  //   },
  //   {
  //     label       : '区域属性',
  //     key         : 'publicPlaceFlag',
  //     type        : 'select',
  //     options     : [ { name: '公共区', id: 1 }, { name: '非公共区', id: 0 } ]
  //   },
  //   {
  //     label       : '班级',
  //     key         : 'classId',
  //     type        : 'select',
  //     optionKey   : { label: 'className', value: 'id' },
  //     optionsUrl  : '/message/listClassMessage'
  //   }
  // ];


  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit() {

  }

  dataChange(dataset) {
    dataset.map(res => {
      res.classesText = [];
      res.classes.map(c => res.classesText.push(c.className));
      res.classesText = res.classesText.join('，');
    })
  }

  update(id = null) {
    const drawer = this.drawer.create({
      nzTitle: '老师信息',
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
      this.http.post('/teacher/deleteTeacher', { ids: this.deleteId, remark: this.remark }).then(res => {
        this.listPage.eaTable._request();
        this.quit.listPage.eaTable._request();
        this.modal.closeAll();
      });
    }
  }
  cancel() {
    this.modal.closeAll();
  }
}

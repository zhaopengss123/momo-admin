import { ImportComponent } from './import/import.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { UpdateComponent } from '../public/update/update.component';
import { environment } from 'src/environments/environment';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.less']
})
export class DistributionComponent implements OnInit {

  domainEs = environment.domainEs;

  @ViewChild('EaTable') table: TableComponent;

  queryNode: QueryNode[] = [
    {
      label: '学员信息',
      key: 'nick',
      type: 'input',
      placeholder: '姓名、昵称、手机号或学号'
    },
    {
      label: '分配给',
      key: 'teacherId',
      type: 'select',
      options: []
    },
    {
      label: '来源',
      key: 'sourceId',
      type: 'select',
      optionsUrl: '/membermanage/returnVisit/getMemberFrom',
      optionKey: { label: 'fromName', value: 'id' }
    },
    {
      label: '宝宝性别',
      key: 'sex',
      type: 'select',
      options: [{ name: '男', id: '男' }, { name: '女', id: '女' }]
    },
    {
      label: '宝宝生日',
      key: 'birthday',
      type: 'rangepicker',
      valueKey: ['startBirthDay', 'endBirthDay']
    },
    {
      label: '创建时间',
      key: 'createTime',
      type: 'rangepicker',
      valueKey: ['startThreadCreateTime', 'endThreadCreateTime']
    },
    {
      label: '下次跟进',
      key: 'lastFollowTime',
      type: 'rangepicker',
      valueKey: ['startNextFollowTime', 'endNextFollowTime']
    },
    {
      label: '未参与过',
      key: 'activityId',
      type: 'select',
      optionsUrl: '/membermanage/returnVisit/getActivities',
      optionKey: { label: 'activityName', value: 'id' }
    },
    {
      label: '收集者',
      key: 'collectorId',
      type: 'select',
      options: []
    },
  ];

  tableNode = ['宝宝昵称', '宝宝姓名', '宝宝生日', '性别', '月龄', '家长姓名', '家长电话', '入库时间', '下次跟进时间', '最后跟进时间', '来源', '客户状态', '跟进阶段', '收集者', '参与活动', '分配到'];

  checkedItems: any[] = [];

  teacherId: number;

  teacherList: any[] = [];

  constructor(
    private drawer: NzDrawerService,
    private http: HttpService,
    private message: NzMessageService
  ) { 
    this.http.post('/membermanage/returnVisit/getFollowTeachers').then(res => {
      this.teacherList = res.data;
      this.queryNode[1].options = res.data;
      this.queryNode[8].options = res.data;
    })
  }

  ngOnInit() {
  }

  distribution() {
    if (this.teacherId) {
      this.http.post('/membermanage/returnVisit/setFollower', { studentIds: this.checkedItems.join(','), followerId: this.teacherId }, true).then(res => {
        this.table._request();
        this.checkedItems = [];
      })
    } else {
      this.message.warning('请选择老师');
    }
   }

  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({ id: number }) => void;

  @DrawerCreate({ title: '新增客户', content: UpdateComponent }) addCustomer: () => void;

  @DrawerCreate({ title: '导入客户', content: ImportComponent }) import: () => void;

}

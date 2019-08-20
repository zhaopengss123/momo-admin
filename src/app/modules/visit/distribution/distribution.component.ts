import { Component, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { UpdateComponent } from '../public/update/update.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';
import { ImportComponent } from '../public/import/import.component';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.less']
})
export class DistributionComponent implements OnInit {

  @ViewChild('EaTable') table: TableComponent;

  queryNode: QueryNode[] = [
    {
      label: '学员',
      key: 'keyWords',
      type: 'input',
      placeholder: '根据学号、姓名、手机号查询',
    },
    {
      label: '分配给',
      key: 'followerId',
      type: 'select',
      optionsUrl: '/teacher/getGrowthConsultant',
      params: { code: 1004 }
    },
    {
      label: '来源',
      key: 'memberFromId',
      type: 'select',
      optionsUrl: '/membermanage/returnVisit/getMemberFrom',
      optionKey: { label: 'fromName', value: 'id' }
    },
    {
      label: '学员性别',
      key: 'sex',
      type: 'select',
      options: [{ name: '男', id: '男' }, { name: '女', id: '女' }]
    },
    {
      label: '学员生日',
      key: 'birthday',
      type: 'rangepicker',
      valueKey: ['startBirthday', 'endBirthday']
    },
    {
      label: '创建时间',
      key: 'createTime',
      type: 'rangepicker',
      valueKey: ['startCreateTime', 'endCreateTime']
    },
    {
      label: '下次跟进',
      key: 'lastFollowTime',
      type: 'rangepicker',
      valueKey: ['startNextFollowTime', 'endNextFollowTime']
    },
    {
      label: '回访时间',
      key: 'followTime',
      type: 'rangepicker',
      valueKey: ['startFollowTime', 'endFollowTime']
    },
    {
      label: '客户状态',
      key: 'visitStatusId',
      type: 'select',
      optionsUrl: '/membermanage/returnVisit/getVisitStatus'
    },
    {
      label: '已预约',
      key: 'activityId',
      type: 'select',
      optionsUrl: '/membermanage/returnVisit/getActivities',
      optionKey: { label: 'activityName', value: 'id' }
    },
  ];

  tableNode = ['学员昵称', '学员姓名', '学员生日', '性别', '月龄', '家长电话', '入库时间', '下次跟进时间', '最后跟进时间', '来源', '客户状态', '收集者', '参与活动', '分配到', '跟踪记录'];

  checkedItems: any[] = [];

  teacherList: any[] = [];

  teacherId: number;

  constructor(
    private drawer: NzDrawerService,
    private http: HttpService,
    private message: NzMessageService,
  ) { 
    this.http.post('/teacher/getGrowthConsultant', { code: 1004 }).then(res => this.teacherList = res.data);
  }

  ngOnInit() {
  }

  distribution() {
    if (this.teacherId) {
      let followerName;
      this.teacherList.map(t => t.id === this.teacherId && (followerName = t.name))
      this.http.post('/membermanage/returnVisit/setFollower', { studentIds: this.checkedItems.join(','), followerId: this.teacherId, followerName }, true).then(res => {
        this.table._request();
        this.checkedItems = [];
      })
    } else {
      this.message.warning('请选择老师');
    }
   }

  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({ id: number, source: string }) => void;

  @DrawerCreate({ title: '新增客户', content: UpdateComponent }) addCustomer: () => void;

  @DrawerCreate({ title: '导入客户', content: ImportComponent }) import: () => void;

}

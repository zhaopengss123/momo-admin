import { Component, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { environment } from 'src/environments/environment';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';
@Component({
  selector: 'app-nocard',
  templateUrl: './nocard.component.html',
  styleUrls: ['./nocard.component.less']
})
export class NocardComponent implements OnInit {

  domainEs = environment.domainEs;

  @ViewChild('EaTable') table;

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
      optionsUrl: '/membermanage/returnVisit/getFollowTeachers'
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
      optionsUrl: '/membermanage/returnVisit/getFollowTeachers'
    },
  ];
  tableNode = ['宝宝昵称', '宝宝姓名', '宝宝生日', '性别', '月龄', '家长姓名', '家长电话', '入库时间', '下次跟进时间', '最后跟进时间', '来源', '客户状态', '跟进阶段', '收集者', '参与活动', '分配到'];

  constructor(
    private drawer: NzDrawerService,
    private format: DatePipe
  ) { }
  
  ngOnInit() {
  }

  @DrawerCreate({ width: 960, closable: false,  content: PreviewComponent }) preview: ({ id: number} ) => void;
}

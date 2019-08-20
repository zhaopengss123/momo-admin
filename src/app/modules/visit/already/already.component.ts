import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';

@Component({
  selector: 'app-already',
  templateUrl: './already.component.html',
  styleUrls: ['./already.component.less']
})
export class AlreadyComponent implements OnInit {

  @ViewChild('EaTable') table;

  queryNode: QueryNode[] = [
    {
      label: '学员',
      key: 'keyWords',
      type: 'input',
      placeholder: '根据学号、姓名、手机号查询'
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
      label: '创建时间',
      key: 'createTime',
      type: 'rangepicker',
      valueKey: ['startCreateTime', 'endCreateTime']
    },
    {
      label: '下次跟进',
      key: 'nextFollowTime',
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
    }
  ];

  tableNode = ['学员昵称', '学员姓名', '学员生日', '性别', '月龄', '家长电话', '入库时间', '下次跟进时间', '跟进时间', '来源', '客户状态', '收集者', '参与活动', '跟进人', '跟踪记录'];

  constructor(
    private drawer: NzDrawerService,
  ) { }

  ngOnInit() {
  }

  @DrawerCreate({ width: 960, closable: false, content: PreviewComponent }) preview: ({ id: number, source: string }) => void;

}

import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { environment } from 'src/environments/environment';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/reducers/reducers-config';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.less']
})
export class MemberComponent implements OnInit {

  domainEs = environment.domainEs;

  paramsDefault: any = { giveUp: 0, statusId: 2 };

  @ViewChild('EaTable') table;

  queryNode: QueryNode[] = [
    {
      label: '学员',
      key: 'id',
      type: 'search',
      placeholder: '根据学号、姓名、手机号查询',
      params: this.paramsDefault,
      searchUrl: `${this.domainEs}/czg/fullQuery`
    },
    {
      label: '分配给',
      key: 'followerId',
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
  tableNode = ['学号', '学员类型', '总天数', '剩余天数', '宝宝昵称', '宝宝姓名', '宝宝生日', '性别', '月龄', '家长姓名', '家长电话', '入库时间', '下次跟进时间', '最后跟进时间', '来源', '参与活动', '分配到'];
  
  constructor(
    private drawer: NzDrawerService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.select('userInfoState').subscribe(userInfo => this.paramsDefault.storeId = userInfo.kindergartenId);
  }

  @DrawerCreate({ width: 960, closable: false, content: PreviewComponent }) preview: ({ id: number, source: string }) => void;

}

import { HttpService } from './../../../ng-relax/services/http.service';
import { AppState } from 'src/app/core/reducers/reducers-config';
import { UpdateComponent } from './../public/update/update.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { environment } from 'src/environments/environment';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-clue',
  templateUrl: './clue.component.html',
  styleUrls: ['./clue.component.less']
})
export class ClueComponent implements OnInit {

  domainEs = environment.domainEs;
  
  paramsDefault: any = { giveUp: 0, statusId: 0 };

  @ViewChild('EaTable') table;

  queryNode: QueryNode[] = [
    {
      label   : '学员',
      key     : 'studentId',
      type    : 'search',
      placeholder: '根据学号、姓名、手机号查询',
      params  : this.paramsDefault,
      searchUrl: `${this.domainEs}/czg/fullQuery`
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
      label: '学员性别',
      key: 'sex',
      type: 'select',
      options: [{ name: '男', id: '男' }, { name: '女', id: '女' }]
    },
    {
      label: '学员生日',
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
  
  tableNode = ['学员昵称', '学员姓名', '学员生日', '性别', '月龄', '家长姓名', '家长电话', '入库时间', '下次跟进时间', '最后跟进时间', '来源', '客户状态', '跟进阶段', '收集者', '参与活动', '分配到'];

  constructor(
    private drawer: NzDrawerService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.select('userInfoState').subscribe(userInfo => this.paramsDefault.storeId = userInfo.kindergartenId);
  }
  
  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({id: number, source: string}) => void;

  @DrawerCreate({ title: '新增客户', content: UpdateComponent }) addCustomer: () => void;

}

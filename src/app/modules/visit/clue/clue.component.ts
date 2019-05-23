import { UpdateComponent } from './../public/update/update.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { PreviewComponent } from './../public/preview/preview.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clue',
  templateUrl: './clue.component.html',
  styleUrls: ['./clue.component.less']
})
export class ClueComponent implements OnInit {

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
      options: []
    },
    {
      label: '来源',
      key: 'sourceId',
      type: 'select',
      options: []
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
      valueKey: ['startBirthDay', 'endBirthDay'],
      isHide: true
    },
    {
      label: '创建时间',
      key: 'createTime',
      type: 'rangepicker',
      valueKey: ['startThreadCreateTime', 'endThreadCreateTime'],
      isHide: true
    },
    {
      label: '下次跟进',
      key: 'lastFollowTime',
      type: 'rangepicker',
      valueKey: ['startNextFollowTime', 'endNextFollowTime'],
      isHide: true
    },
    {
      label: '未参与过',
      key: 'activityId',
      type: 'select',
      options: [],
      isHide: true
    },
    {
      label: '收集者',
      key: 'collectorId',
      type: 'select',
      options: [],
      isHide: true
    },
  ];
  
  tableNode = ['宝宝昵称', '宝宝姓名', '宝宝生日', '性别', '月龄', '家长姓名', '家长电话', '入库时间', '下次跟进时间', '最后跟进时间', '来源', '客户状态', '跟进阶段', '收集者', '参与活动', '分配到'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private drawer: NzDrawerService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((res: any) => {
      if (res.params.reset) {
        this.table._request();
      }
    })
  }
  
  @DrawerCreate({ content: PreviewComponent, width: 860, closable: false, params: { followStageId: 2 } }) preview: ({id: number}) => void;

  @DrawerCreate({ title: '新增客户', content: UpdateComponent }) addCustomer: () => void;

}

import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { NzDrawerService } from 'ng-zorro-antd';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';

@Component({
  selector: 'app-nointention',
  templateUrl: './nointention.component.html',
  styleUrls: ['./nointention.component.less']
})
export class NointentionComponent implements OnInit {

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
    }
  ];

  tableNode = ['学员昵称', '学员姓名', '学员生日', '性别', '月龄', '家长电话', '入库时间', '下次跟进时间', '最后跟进时间', '来源', '客户状态', '收集者', '参与活动', '分配到', '跟踪记录'];

  checkedItems: any[] = [];

  @ViewChild('EaTable') table;
  constructor(
    private drawer: NzDrawerService,
    private http: HttpService
  ) { }

  ngOnInit() {
  }

  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({ id: number, source: string }) => void;

  gainClue(): void {
    this.http.post('/membermanage/returnVisit/gainMemberClue', { ids: this.checkedItems.join(',')  }, true).then(res => {
      this.checkedItems = [];
      this.table._request();
    })
  }
}

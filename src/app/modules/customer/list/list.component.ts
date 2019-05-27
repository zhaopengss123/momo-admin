import { AppointComponent } from '../appoint/appoint.component';
import { NzDrawerService, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { environment } from 'src/environments/environment';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/reducers/reducers-config';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { UpdateComponent } from '../update/update.component';
import { PreviewComponent } from '../preview/preview.component';
import { PaymentComponent } from '../payment/payment.component';
import { ClassComponent } from '../class/class.component';
import { LeavingComponent } from '../leaving/leaving.component';
import { endOfMonth, addDays, getDay, addMonths, startOfMonth, subDays } from 'date-fns';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

  @ViewChild('eaTable') table: TableComponent;

  customerStatusIndex = 0;

  birthdayRanges = { 
    '今天': [new Date(), new Date()],
    '明天': [addDays(new Date(), 1), addDays(new Date(), 1)],
    '本周': [new Date(), addDays(new Date(), 7 - (getDay(new Date()) || 7))],
    '下周': [subDays(addDays(new Date(), 7), (getDay(addDays(new Date(), 7)) || 7) - 1), addDays(addDays(new Date(), 7), 7 - (getDay(addDays(new Date(), 7)) || 7))],
    '本月': [new Date(), endOfMonth(new Date())],
    '下个月': [startOfMonth(addMonths(new Date(), 1)), endOfMonth(addMonths(new Date(), 1))]
  };

  domain = environment.domainEs;

  checkedItems: number[] = [];

  queryNode: QueryNode[] = [
    {
      label   : '学员性别',
      key     : 'sex',
      type    : 'tag',
      options : [{ name: '男孩', id: '男'}, { name: '女孩', id: '女'}],
      isRadio : true
    },
    {
      label   : '学员来源',
      key     : 'sourceId',
      type    : 'tag',
      optionKey: { label: 'fromName', value: 'memberFromId' },
      options: []
    },
    {
      label   : '学员班级',
      key     : 'gradeId',
      type    : 'tag',
      optionKey: { label: 'className', value: 'classId' },
      options: []
    },
    {
      label   : '学籍类型',
      key     : 'schoolRollId',
      type    : 'tag',
      options: []
    },
    {
      label   : '监控状态',
      key     : 'monitoringStatus',
      type    : 'tag',
      options : [{ name: '开启', id: 1}, { name: '关闭', id: 0}],
      isRadio : true
    },
    {
      label   : '所属销售',
      key     : 'sellId',
      type    : 'select',
      options : [],
      optionKey: { label: 'teacherName', value: 'teacherId' }
    },
    {
      label   : '学员生日',
      key     : 'birthday',
      valueKey: ['startBirthDay', 'endBirthDay'],
      type    : 'rangepicker',
      format  : 'MM-dd',
      ranges  : this.birthdayRanges
    },
    {
      label   : '建档时间',
      key     : 'bookBuildingTime',
      type    : 'datepicker'
    },
    {
      label   : '入学时间',
      key     : 'enrolTime',
      type    : 'datepicker'
    },
    {
      label   : '到期时间',
      key     : 'expireTime',
      type    : 'datepicker',
      isHide  : true
    },
    {
      label   : '剩余天数',
      key     : 'residueDays',
      valueKey: ['startResidueDays', 'endResidueDays'],
      type    : 'between',
      isHide  : true
    }
  ];

  queryItems = {
    memberFromList: {},
    classList: {},
    cardList: {},
    teacherList: {}
  }
  constructor(
    private http: HttpService,
    private store: Store<AppState>,
    private drawer: NzDrawerService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { 
    this.http.post('/student/getStudentListQueryCondition').then(res => {
      this.queryNode[1].options = res.data.memberFromList;
      this.queryNode[2].options = res.data.classList;
      this.queryNode[3].options = res.data.cardList;
      res.data.memberFromList.map(item => this.queryItems.memberFromList[item.memberFromId] = item.fromName);
      res.data.classList.map(item => this.queryItems.classList[item.classId] = item.className);
      res.data.cardList.map(item => this.queryItems.cardList[item.id] = item.name);
      res.data.teacherList.map(item => this.queryItems.teacherList[item.teacherId] = item.teacherName);
      this.dataChange();
    });
    this.http.post('/student/getTeacherListByRoleId', { paramJson: JSON.stringify({ roleId: 4 }) }).then(res => this.queryNode[5].options = res.data.list);
  }

  ngOnInit() {
    this.store.select('userInfoState').subscribe(userInfo => this.paramsDefault.storeId = userInfo.kindergartenId);
  }

  query(params) {
    this.table.request(params);
  }

  @DrawerCreate({ title: '编辑学员', content: UpdateComponent }) update: ({ id: number, type: string }?) => void;

  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({id: number}) => void;

  checkedData;
  operation(type: string, option: buttonAsyncValid =  {}) {
    if (this.checkedItems.length) {
      if (option.type) {
        this.http.post('/student/studentInfoIsComplete', {
          paramJson: JSON.stringify({
            studentId: this.checkedItems[0], buttonName: option.type
          }),
        }).then(res => {
          if (res.result == 1000) {
            this[type](option.needData ? { studentInfo: this.checkedData[0] } : { id: this.checkedItems[0] })
          } else {
            this.message.warning(res.message);
            res.result != 1999 && this.update({ id: this.checkedItems[0], type: option.type })
          }
        })
      } else {
        this.checkedData[0].statusId == 2 ? this[type]({ id: this.checkedItems[0] }) : this.message.warning('只有在校学员才可转升班或退园');
      }
    } else {
      this.message.warning('请选择需要操作的学员')
    }
  }

  payment(params) {
    this.drawer.create({
      nzTitle: null,
      nzWidth: 960,
      nzClosable: false,
      nzContent: PaymentComponent,
      nzContentParams: { id: params.id }
    }).afterClose.subscribe(res => {
      if (res && res.isPaymentCard) {
        if (this.checkedData[0].gradeId) {
          this.appoint(params);
        } else {
          this.modal.success({ nzTitle: '完善该学员班级等各项信息后即可入学', nzContent: '请编辑学员信息，完成入学' });
        }
      }
    });
  }

  @DrawerCreate({ content: ClassComponent, title: '转/升班'}) class: ({id: number}) => void;

  @DrawerCreate({ content: LeavingComponent, title: '退园', width: 460 }) leaving: ({id: number}) => void;

  @DrawerCreate({ content: AppointComponent, width: 1148, closable: false }) appoint: ({ studentInfo: any }?) => void;

  paramsDefault = { storeId: null, schoolRollId: null }
  tabsetSelectChange() {
    this.paramsDefault.schoolRollId = this.customerStatusIndex == 0 ? null : this.customerStatusIndex == 1 ? "2" : this.customerStatusIndex == 2 ? "3,4" : "0,1";
    this.table._request();
  }

  dataChange() {
    this.table.dataSet.length && this.queryNode[3].options.length && this.table.dataSet.map(data => {
      data.schoolRollName = this.queryItems.cardList[data.schoolRollId] || '-';
      data.gradeName = this.queryItems.classList[data.gradeId] || '-';
      data.sourceName = this.queryItems.memberFromList[data.sourceId] || '-';
      data.sellName = this.queryItems.teacherList[data.sellId] || '-';
      return data;
    })
  }

  lookChange(studentId, isLook) {
    this.http.post('/student/updateStudentIsLookStatus', { paramJson: JSON.stringify({ studentId, isLook })}, true).then(res => this.table._request());
  }

}

interface buttonAsyncValid {
  needData?: boolean;
  type?: 'isReserve' | 'isPay';
}
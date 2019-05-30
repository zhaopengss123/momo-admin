import { NzDrawerService, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryNode, QueryComponent } from 'src/app/ng-relax/components/query/query.component';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { TableComponent } from 'src/app/ng-relax/components/table/table.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/reducers/reducers-config';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { endOfMonth, addDays, getDay, addMonths, startOfMonth, subDays } from 'date-fns';
import { UpdateComponent } from '../../public/customer-preview/update/update.component';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';
import { PaymentComponent } from '../../public/customer-preview/payment/payment.component';
import { ClassComponent } from '../../public/customer-preview/class/class.component';
import { LeavingComponent } from '../../public/customer-preview/leaving/leaving.component';
import { AppointComponent } from '../../public/customer-preview/appoint/appoint.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

  @ViewChild('eaTable') eaTable: TableComponent;

  @ViewChild('eaQuery') eaQuery: QueryComponent;

  customerStatusIndex = 0;

  birthdayRanges = { 
    '今天': [new Date(), new Date()],
    '明天': [addDays(new Date(), 1), addDays(new Date(), 1)],
    '本周': [new Date(), addDays(new Date(), 7 - (getDay(new Date()) || 7))],
    '下周': [subDays(addDays(new Date(), 7), (getDay(addDays(new Date(), 7)) || 7) - 1), addDays(addDays(new Date(), 7), 7 - (getDay(addDays(new Date(), 7)) || 7))],
    '本月': [new Date(), endOfMonth(new Date())],
    '下个月': [startOfMonth(addMonths(new Date(), 1)), endOfMonth(addMonths(new Date(), 1))]
  };

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
      key     : 'memberFromid',
      type    : 'tag',
      optionKey: { label: 'fromName', value: 'memberFromId' },
      options: []
    },
    {
      label   : '学员班级',
      key     : 'classIds',
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
      key     : 'isLook',
      type    : 'tag',
      options : [{ name: '开启', id: 0}, { name: '关闭', id: 1}],
      isRadio : true
    },
    {
      label   : '所属销售',
      key     : 'salespersonId',
      type    : 'select',
      options : [],
      optionKey: { label: 'teacherName', value: 'teacherId' },
      isHide  : true
    },
    {
      label   : '学员生日',
      key     : 'birthday',
      valueKey: ['startBirthday', 'endBirthday'],
      type    : 'rangepicker',
      format  : 'MM-dd',
      ranges  : this.birthdayRanges,
      isHide  : true
    },
    {
      label   : '建档时间',
      key     : 'createTime',
      type    : 'datepicker',
      isHide  : true
    },
    {
      label   : '入学时间',
      key     : 'effectDate',
      type    : 'datepicker',
      isHide  : true
    },
    {
      label   : '到期时间',
      key     : 'expireDate',
      type    : 'datepicker',
      isHide  : true
    },
    {
      label   : '剩余天数',
      key     : 'times',
      valueKey: ['minTimes', 'maxTimes'],
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
    });
    this.http.post('/student/getTeacherListByRoleId', { paramJson: JSON.stringify({ roleId: 4 }) }).then(res => this.queryNode[5].options = res.data.list);
  }

  ngOnInit() {
    this.store.select('userInfoState').subscribe(userInfo => this.paramsDefault.kindergartenId = userInfo.kindergartenId);
  }

  query(params) {
    this.eaTable.request(params);
  }

  @DrawerCreate({ title: '学员信息', content: UpdateComponent }) update: ({ id: number, type: string }?) => void;

  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({id: number}) => void;

  checkedData;
  operation(type: string) {
    if (this.checkedItems.length) {
      this[type]();
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
        if (this.checkedData[0].classId) {
          this.checkedData[0].cardType = 2;
          this.eaTable._request();
          this.appoint({ studentInfo: this.checkedData[0] });
        } else {
          this.modal.success({ nzTitle: '完善该学员班级等各项信息后即可入学', nzContent: '请编辑学员信息，完成入学' });
        }
      }
    });
  }

  @DrawerCreate({ content: ClassComponent, title: '转/升班'}) class: ({id: number}) => void;

  @DrawerCreate({ content: LeavingComponent, title: '退园', width: 460 }) leaving: ({id: number}) => void;

  @DrawerCreate({ content: AppointComponent, width: 1148, closable: false }) appoint: ({ studentInfo: any }?) => void;

  paramsDefault = { kindergartenId: null, studentStatus: null }
  tabsetSelectChange() {
    this.paramsDefault.studentStatus = this.customerStatusIndex == 0 ? null : this.customerStatusIndex == 1 ? "2" : this.customerStatusIndex == 2 ? "0,1" : "3,4";
    this.eaQuery['submit']();
  }

  lookChange(studentId, isLook) {
    this.http.post('/student/updateStudentIsLookStatus', { paramJson: JSON.stringify({ studentId, isLook })}, true).then(res => this.eaTable._request());
  }


  /* -------------- 点击预约校验 -------------- */
  appointValid() {
    this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.checkedItems[0], buttonName: 'isReserve'
      }),
    }).then(res => {
      if (res.result == 1000) {
        this.appoint({ studentInfo: this.checkedData[0] })
      } else {
        this.message.warning(res.message);
        res.result != 1999 && this.update({ id: this.checkedItems[0], type: 'isReserve' })
      }
    })
  }

  /* -------------- 点击缴费校验 -------------- */
  paymentValid() {
    this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.checkedItems[0], buttonName: 'isPay'
      }),
    }).then(res => res.result == 1000 ? this.payment({ id: this.checkedItems[0] }) : this.message.warning(res.message));
  }

  /* -------------- 点击转班校验 -------------- */
  classValid() {
    this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.checkedItems[0], buttonName: 'isAdjustClass'
      }),
    }).then(res => res.result == 1000 ? this.class({ id: this.checkedItems[0] }) : this.message.warning(res.message));
  }

  /* -------------- 点击退园校验 -------------- */
  leavingValid() {
    this.checkedData[0].status != 4 ? this.leaving({ id: this.checkedItems[0] }) : this.message.warning('已退园学员不可再次退园');
  }

}
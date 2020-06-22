import { SelectCardComponent } from '../../public/customer-preview/select-card/select-card.component';
import { DelayComponent } from './../../public/customer-preview/delay/delay.component';
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
import { environment } from 'src/environments/environment';

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

  domainEs = environment.domainEs;

  queryNode: QueryNode[] = [
    {
      label: '学员性别',
      key: 'sex',
      type: 'tag',
      options: [{ name: '男孩', id: '男' }, { name: '女孩', id: '女' }],
      isRadio: true
    },
    {
      label: '学员来源',
      key: 'memberFromid',
      type: 'tag',
      optionKey: { label: 'fromName', value: 'memberFromId' },
      options: []
    },
    {
      label: '学员班级',
      key: 'classIds',
      type: 'tag',
      optionKey: { label: 'className', value: 'classId' },
      options: []
    },
    {
      label: '学籍类型',
      key: 'cardTypeCategoryIds',
      type: 'tag',
      options: []
    },
    {
      label: '监控状态',
      key: 'isLook',
      type: 'tag',
      options: [{ name: '开启', id: 0 }, { name: '关闭', id: 1 }],
      isRadio: true
    },
    {
      label: '状态',
      key: 'cardStatus',
      type: 'tag',
      options: [
        { name: '待入学', id: 0 },
        { name: '已入学', id: 1 },
        { name: '已到店', id: 2 },
        { name: '未到店', id: 3 },
        { name: '未体验', id: 4 },
        { name: '无意向', id: 5 }
      ],
      isRadio: true
    },
    {
      label: '学员',
      key: 'studentId',
      type: 'search',
      placeholder: '根据学号、姓名、手机号查询',
      searchUrl: `${this.domainEs}/czg/fullQuery`
    },
    {
      label: '归属老师',
      key: 'teacherId',
      type: 'select',
      optionsUrl: '/message/getTeacherList',
      isHide: true
    },
    {
      label: '学员生日',
      key: 'birthday',
      valueKey: ['startBirthday', 'endBirthday'],
      type: 'rangepicker',
      format: 'MM-dd',
      ranges: this.birthdayRanges,
      isHide: true
    },
    {
      label: '年龄',
      key: 'times',
      valueKey: ['yearStart', 'yearEnd'],
      placeholder: ['最小年龄(正整数)', '最大年龄(正整数)'],
      type: 'between',
      isHide: true
    },
    {
      label: '建档时间',
      key: 'createTime',
      type: 'rangepicker',
      valueKey: ['createTimeStart', 'createTimeEnd'],
      isHide: true
    },
    {
      label: '入学时间',
      key: 'effectDate',
      type: 'rangepicker',
      valueKey: ['effectDateStart', 'effectDateEnd'],
      isHide: true
    },
    {
      label: '到期时间',
      key: 'expireDate',
      type: 'rangepicker',
      valueKey: ['expireDateStart', 'expireDateEnd'],
      isHide: true
    },
    {
      label: '剩余天数',
      key: 'times',
      valueKey: ['minTimes', 'maxTimes'],
      type: 'between',
      isHide: true
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
    });
    this.http.post('/student/getCollectorAndRecommender').then(res => this.queryNode[6].options = res.data.collectorList);
  }

  ngOnInit() {
    this.store.select('userInfoState').subscribe(userInfo => this.paramsDefault.kindergartenId = userInfo.kindergartenId);
  }

  query(params) {
    this.eaTable.request(params);
  }

  update(obj?: { id: number, type: string }) {
    let params: any = obj || {};
    this.drawer.create({
      nzWidth: 720,
      nzTitle: '学员信息',
      nzBodyStyle: { 'padding-bottom': '53px' },
      nzContent: UpdateComponent,
      nzContentParams: { id: params.id, type: params.type }
    }).afterClose.subscribe(res => {
      res.type == 'isReserve' && (this.checkedData[0].classId = res.classId);
      this.eaTable._request();
    })
  }

  preview(studentInfo) {
    this.drawer.create({
      nzWidth: 960,
      nzTitle: null,
      nzContent: PreviewComponent,
      nzContentParams: { id: studentInfo.studentId },
      nzClosable: false
    }).afterClose.subscribe(res => {
      res && res == 'appoint' && this.appoint({ studentInfo, cardInfo: res });
    })
  }

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
      nzWidth: 1060,
      nzClosable: false,
      nzContent: PaymentComponent,
      nzContentParams: { id: params.id }
    }).afterClose.subscribe(res => {
      if (res) {
        this.eaTable._request();
      }
      if (res && res.isPaymentCard) {
        this.checkedData[0].cardType = res.cardType;
        if (this.checkedData[0].classId) {
          // this.appoint({ studentInfo: this.checkedData[0] });
        } else {
          this.modal.success({ nzTitle: '完善该学员班级等各项信息后即可入学', nzContent: '请编辑学员信息，完成入学' });
        }
      }
    });
  }

  class(params, cardInfo) {
    this.drawer.create({
      nzTitle: '转/升班',
      nzWidth: 720,
      nzContent: ClassComponent,
      nzBodyStyle: {
        'padding-bottom': '53px'
      },
      nzContentParams: { id: params.id, cardInfo }
    }).afterClose.subscribe((res: boolean) => {
      if (res) {
        this.checkedItems = [];
        this.eaTable._request();
      }
    });
  }
  updateTeach(params, cardInfo) {
    cardInfo.isteacher = true;
    this.drawer.create({
      nzTitle: '修改负责老师',
      nzWidth: 720,
      nzContent: ClassComponent,
      nzBodyStyle: {
        'padding-bottom': '53px'
      },
      nzContentParams: { id: params.id, cardInfo }
    }).afterClose.subscribe((res: boolean) => {
      if (res) {
        this.checkedItems = [];
        this.eaTable._request();
      }
    });
  }

  @DrawerCreate({ content: LeavingComponent, title: '退园', width: 600 }) leaving: ({ id: number }) => void;

  @DrawerCreate({ content: DelayComponent, title: '延期', width: 600 }) delay: ({ id: number }) => void;

  @DrawerCreate({ content: AppointComponent, width: 1148, closable: false }) appoint: ({ studentInfo: any, cardInfo }?) => void;

  paramsDefault = { kindergartenId: null, studentStatus: null }
  tabsetSelectChange() {
    this.paramsDefault.studentStatus = this.customerStatusIndex == 0 ? null : this.customerStatusIndex == 1 ? '2' : this.customerStatusIndex == 2 ? '1' : '3,4';
    this.eaQuery['submit']();
  }

  lookChange(studentId, isLook) {
    this.http.post('/student/updateStudentIsLookStatus', { paramJson: JSON.stringify({ studentId, isLook }) }, true).then(res => this.eaTable._request());
  }


  /* -------------- 点击预约校验 -------------- */
  async appointValid() {
    let valid = await this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.checkedItems[0], buttonName: 'isReserve'
      }),
    });
    if (valid.result == 1000) {
      let cardList = valid.data;
      let studentInfo = this.checkedData[0];
      if (!cardList.length) {
        this.appoint({ studentInfo, cardInfo: {} });
      } else if (cardList.length === 1) {
        this.appoint({ studentInfo, cardInfo: cardList[0] });
      } else {
        this.modal.create({
          nzTitle: '选择开卡',
          nzContent: SelectCardComponent,
          nzComponentParams: { cardList, studentInfo },
          nzFooter: null
        }).afterClose.subscribe(res => {
          if (res && res.operation == 'appoint') {
            this.appoint({ studentInfo, cardInfo: res });
          } else if (res && res.operation == 'update') {
            this.update({ id: studentInfo.studentId, type: 'isReserve' })
          }
        });
      }
    } else {
      this.message.warning(valid.message);
      valid.result != 1999 && this.update({ id: this.checkedItems[0], type: 'isReserve' })
    }
  }

  /* -------------- 点击缴费校验 -------------- */
  paymentValid() {
    this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.checkedItems[0], buttonName: 'isPay'
      }),
    }).then(res => {
      if (res.returnCode == "SUCCESS") {
        this.payment({ id: this.checkedItems[0] });
      } else {
        this.message.warning(res.returnMsg);
        this.update({ id: this.checkedItems[0], type: 'isPay' });
      }
    });
  }

  /* -------------- 点击转班校验 -------------- */
  classValid() {
    this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.checkedItems[0], buttonName: 'isAdjustClass'
      }),
    }).then(res => res.returnCode == "SUCCESS" ? this.class({ id: this.checkedItems[0] }, res.data[0]) : this.message.warning(res.returnMsg));
  }

  /* -------------- 负责老师校验 -------------- */
  teacherValid() {
    let data = this.eaTable.dataSet.filter(d => d.studentId === this.checkedItems[0])[0];
    let teacherName = data.teacherName;
    let type = data.cardType;
    if (teacherName && type == 2 && data.studentStatus != '已过期' ) {
      this.updateTeach({ id: this.checkedItems[0] }, { teacherName , type , classId: data.classId });
    } else {
      if(data.className && data.cardTypeName == '日托' ){
      this.message.warning('日托学员无固定老师，无法修改负责老师');
      }else{
        this.message.warning('该学员不能修改负责老师');
      }
    }
  }
  /* -------------- 点击退园校验 -------------- */
  leavingValid() {
    this.checkedData[0].status != 3 && this.checkedData[0].status != 4 ? this.leaving({ id: this.checkedItems[0] }) : this.message.warning('已退园学员不可再次退园');
  }

  delayValid() {
    let data = this.eaTable.dataSet.filter(d => d.studentId === this.checkedItems[0])[0];
    if (data.cardType != 2) {
      this.message.warning('只有定期学员才可延期')
    } else if (!data.effectDate) {
      this.message.warning('学员未开卡，无法延期');
    } else {
      this.delay({ id: this.checkedItems[0] })
    }
  }

  async validateOpenCard(studentInfo) {
    let studentId = studentInfo.studentId;
    let valid = await this.http.post('/student/getStuOpenCardStatus', { studentId });
    if (valid.result == 1000) {
      let cardList = (await this.http.post('/student/listStuUnopenCard', { studentId })).data;
      this.modal.create({
        nzTitle: '选择开卡',
        nzContent: SelectCardComponent,
        nzComponentParams: { cardList, studentInfo },
        nzFooter: null
      }).afterClose.subscribe(res => {
        if (res && res.operation == 'appoint') {
          this.appoint({ studentInfo, cardInfo: res });
        } else if (res && res.operation == 'update') {
          this.update({ id: studentInfo.studentId, type: 'isReserve' })
        }
      });
    } else {
      this.message.warning(valid.message)
    }
  }

}
import { Component, OnInit } from '@angular/core';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { environment } from 'src/environments/environment';
declare var require: any;
const endOfMonth = require('date-fns/end_of_month');
const addDays = require('date-fns/add_days/index');
const getDay = require('date-fns/get_day/index');
const addMonths = require('date-fns/add_months/index.js');
const startOfMonth = require('date-fns/start_of_month/index.js');
const subDays = require('date-fns/sub_days');

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

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

  queryNode: QueryNode[] = [
    {
      label   : '会员性别',
      key     : 'sex',
      type    : 'tag',
      options : [{ name: '男孩', id: 1}, { name: '女孩', id: 2}],
      isRadio : true
    },
    {
      label   : '会员来源',
      key     : 'sourceId',
      type    : 'tag',
      optionKey: { label: 'fromName', value: 'memberFromId' },
      options: []
    },
    {
      label   : '会员班级',
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
      label   : '会员生日',
      key     : 'birthday',
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
      type    : 'between',
      isHide  : true
    },
    {
      label   : '剩余次数',
      key     : 'residueTimes',
      type    : 'between',
      isHide  : true
    }
  ];

  constructor(
    private http: HttpService
  ) { 
    this.http.post('/student/getStudentListQueryCondition').then(res => {
      this.queryNode[1].options = res.data.memberFromList;
      this.queryNode[2].options = res.data.classList;
      this.queryNode[3].options = res.data.cardList;
    })
  }

  ngOnInit() {
    
  }

  query(params) {
    console.log(params);
  }

}

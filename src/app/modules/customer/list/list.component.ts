import { QueryNode } from './../../../ng-relax/components/query/query.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

  customerStatusIndex = 0;

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
      options: [
        { name: '大众点评', id: 1 },
        { name: '手工录入', id: 2 },
        { name: '今天头条', id: 3 },
        { name: '百度推广', id: 4 },
        { name: '乱七八糟', id: 5 },
        { name: '不知道哪', id: 6, isHide: true },
        { name: '随便在哪', id: 7, isHide: true },
        { name: '在哪都行', id: 8, isHide: true },
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}

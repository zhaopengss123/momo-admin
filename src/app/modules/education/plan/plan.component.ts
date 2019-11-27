import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { ListPageSimpComponent } from './../../../ng-relax/components/list-page-simp/list-page.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.less']
})
export class PlanComponent implements OnInit {
  @ViewChild('listPage') listPage: ListPageSimpComponent;

  queryNode: QueryNode[] = [
    {
      label: '课程名称',
      key: 'className',
      type: 'input'
    },
    {
      label: '课程类别',
      key: 'typeId',
      type: 'select',
      optionsUrl  : '/course/listCourseType'
    },
    {
      label       : '宝宝月龄',
      key         : 'yueling',
      valueKey    : ['startMonthAge', 'endMonthAge'],
      type        : 'between',
      placeholder: ['最小月龄', '最大月龄']
    }
  ];
  pageNum: number = 1;
  pageSize: number = 10;
  imgurl : string = 'https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg';
  loading: boolean;
  listClass:any[] = [];
  classStatusIndex: number = 0;
  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) { 
  }

  ngOnInit() {
    this.http.post('/message/listClassMessage', { }, false).then(res => { this.listClass = res.data.list; })
  }

  select(data){
    this.http.post('/course/queryCourse', { paramJson: JSON.stringify(data) }, false).then(res => {  })
  }

  delete(classId) {
    this.http.post('/classmanager/deleteClassById', { classId }, true).then(res => this.listPage.eaTable._request())
  }
  pageChange(){
      console.log(this.pageNum,this.pageSize);
  } 
  selectclass(id){
    console.log(id);
  }


}

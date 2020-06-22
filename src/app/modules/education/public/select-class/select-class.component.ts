import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService , NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';

@Component({
  selector: 'app-select-class',
  templateUrl: './select-class.component.html',
  styleUrls: ['./select-class.component.less']
})
export class SelectClassComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageComponent;

  @ViewChild('EaTable') table;
  listCourseType:any[] = [];
  queryNode: QueryNode[] = [
    {
      label: '课程名称',
      key: 'name',
      type: 'input',
      placeholder: '请输入课程名称'
    },
    {
      label: '课程类别',
      key: 'typeId',
      type: 'select',
      options: [],
    },
 
    {
      label: '课程状态',
      key: 'status',
      type: 'select',
      options : [{ name: '启用', id: 0 }],
      default : 0,
      isRemove: false
    },
  ];

  tableNode = ['课程名称', '类别', '时长', '适用月龄'];
  checkedData: any;
  checkedItems: number[] = [];

  constructor(
    private drawer: NzDrawerService,
    private http: HttpService,
    private message: NzMessageService,
    private drawerRef: NzDrawerRef,

    ) { 
      this.http.post('/course/listCourseType', { 
      }).then(res => {
        this.listCourseType = res.data.list;
        this.queryNode[1].options = res.data.list;
      });
    }

  ngOnInit() {
    
  }
  updataStatus(data){
    this.http.post('/course/updateCourse', {
      paramJson: JSON.stringify({
        id: data.id,
        status: data.status == 0 ? -1 : 0
      })
    }, true).then(res => {
      if(res.returnCode == "SUCCESS"){
        this.table && this.table._request();
    }  
    }).catch();
  }

  saves(){
    this.drawerRef.close(this.checkedData);
  }
  close(){
    this.drawerRef.close(false);
  }
}

import { UpdateComponent } from './../public/update/update.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService , NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';
import { DetailComponent } from './../public/detail/detail.component';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.less']
})
export class CurriculumComponent implements OnInit {

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
      options : [{ name: '启用', id: 0 }, { name: '停用', id: -1 }]
    },
    {
      label: '班级',
      key: 'classId',
      type: 'select',
      optionKey   : { label: 'className', value: 'id' },
      optionsUrl  : '/message/listClassMessage'
    }
  ];

  tableNode = ['课程名称', '类别', '时长', '适用月龄','状态', '课时数', '创建时间' , '操作'];

  constructor(
    private drawer: NzDrawerService,
    private http: HttpService,
    private message: NzMessageService,
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
//  @DrawerCreate({ title: '新建课程', content: UpdateComponent }) addCustomer: () => void;
  addCustomer(info = {}){
    const drawer = this.drawer.create({
      nzWidth: 820,
      nzTitle: '课程管理',
      nzContent: UpdateComponent,
      nzMaskClosable: false,
      nzContentParams: { info }
    });
    drawer.afterClose.subscribe(res => {
      this.http.post('/course/listCourseType', { 
      }).then(res => {
        this.listCourseType = res.data.list;
        this.queryNode[1].options = res.data.list;
      });
      if(!res){ return false };
      this.listPage && this.listPage.eaTable._request();
      this.table && this.table._request();
    });
}
openDetail(info = {}){
  // if(data.lesson){ window.open(data.lesson) };
  // if(data.vedio){  window.open(data.vedio, '_blank')  };
  const drawer = this.drawer.create({
    nzWidth: 720,
    nzTitle: '课程详情',
    nzContent: DetailComponent,
    nzContentParams: { info }
  });
}
selects(e){
  this.table.request(e);
}

}

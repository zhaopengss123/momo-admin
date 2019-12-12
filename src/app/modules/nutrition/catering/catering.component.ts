import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';

@Component({
  selector: 'app-catering',
  templateUrl: './catering.component.html',
  styleUrls: ['./catering.component.less']
})
export class CateringComponent implements OnInit {
  listClass: any[] = [];
  classId: number ;
  @ViewChild('listPage') listPage: ListPageComponent;
  @ViewChild('EaTable') table;
  tableNode = ['课程名称', '类别', '时长', '适用月龄', '状态', '创建时间' , '操作'];

  queryNode: QueryNode[] = [
   
    {
      label: '食谱',
      key: 'status',
      type: 'select',
      options : [{ name: '食谱1', id: 0 }, { name: '食谱2', id: -1 }]
    },
  ];
  constructor(
    private http: HttpService
  ) { 
    this.http.post('/message/listClassMessage', {}, false).then(res => { this.listClass = res.data.list; this.classId = res.data.list[0].id;  });

  }

  ngOnInit() {
  }
  selectClass(id){
    console.log(id);
  }
}

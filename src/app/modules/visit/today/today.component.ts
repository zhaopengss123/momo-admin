import { UpdateComponent } from './../public/update/update.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { PreviewComponent } from '../../public/customer-preview/preview/preview.component';
import { ImportComponent } from '../public/import/import.component';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { GetList } from 'src/app/ng-relax/decorators/getList.decorator';
import { DatePipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.less']
})
export class TodayComponent implements OnInit {

  @ViewChild('EaTable') table;
  jsonData: any = {
    activity: {},
    allworking: {},
    babysitter: {},
    born: {},
    carer: {},
    gift: {},
    multiplebirth: {},
    nannytime: {},
    near: {},
    problems: {},
    reason:{}
  };

  queryNode: QueryNode[] = [

  ];

  paramsInit;
  stepList:any[] = [];
  // @GetList('/membermanage/returnVisit/getActivities') activityList: any | [];
  // @GetList('/student/getClassList') classList: any | [];
  tableNode = ['图片','广告名', '创建时间', '更新时间', '状态', '操作'];
  constructor(
    private drawer: NzDrawerService,
    private http: HttpService,
    private format: DatePipe,
    private message: NzMessageService
  ) { 
    // typeof this.activityList === 'function' && this.activityList();
    // typeof this.classList === 'function' && this.classList();
    this.paramsInit = {
      startNextFollowTime: this.format.transform(new Date(), 'yyyy-MM-dd'),
      endNextFollowTime: this.format.transform(new Date(), 'yyyy-MM-dd'),
    };
    
  }

  ngOnInit() {
  }

  upShelves(id){
    this.http.post(`/console/banner/upShelves/${ id }`).then(res => {
      console.log(res);
      if(res.returnCode == "SUCCESS"){
        this.message.success('操作成功！');
        this.table._request();
      }else{
        this.message.error(res.returnMsg)
      }
    });
  }
 
  downShelves(id){
    this.http.post(`/console/banner/downShelves/${ id }`).then(res => {
      if(res.returnCode == "SUCCESS"){
        this.message.success('操作成功！');
        this.table._request();
      }else{
        this.message.error(res.returnMsg)
      }
    });
  }
  @DrawerCreate({ content: PreviewComponent, width: 960, closable: false }) preview: ({ id: number, source: string, step: any }) => void;

  @DrawerCreate({ title: '新增客户', content: UpdateComponent }) addCustomer: ({ id: number }) => void;

  @DrawerCreate({ title: '导入客户', content: ImportComponent }) import: () => void;

}

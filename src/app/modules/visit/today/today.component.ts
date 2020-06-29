import { UpdateComponent } from './../public/update/update.component';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { DatePipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.less']
})
export class TodayComponent implements OnInit {

  @ViewChild('EaTable') table;


  queryNode: QueryNode[] = [

  ];

  paramsInit;
  stepList:any[] = [];
  sortList:any[] = [];

  tableNode = ['图片','道具名', '创建时间', '更新时间', '排序','状态',  '操作'];
  constructor(
    private drawer: NzDrawerService,
    private http: HttpService,
    private format: DatePipe,
    private message: NzMessageService
  ) { 

    this.paramsInit = {
      startNextFollowTime: this.format.transform(new Date(), 'yyyy-MM-dd'),
      endNextFollowTime: this.format.transform(new Date(), 'yyyy-MM-dd'),
    };
    
  }

  ngOnInit() {
      this.getSort();
  }

  upShelves(id){
    this.http.post(`/console/banner/upShelves/${ id }`).then(res => {

      if(res.returnCode == "SUCCESS"){
        this.message.success('操作成功！');
        this.table._request();
      }else{
        this.message.error(res.returnMsg)
      }
    });
  }
  getSort(){
    this.http.post(`/console/banner/sort`).then(res => {
      if(res.returnCode == "SUCCESS"){
        this.sortList = res.result;
      }else{
        this.message.error(res.returnMsg)
      }
    });
  }
  //保存排序
  saveSort(data){
    this.http.post(`/console/banner/updateSort`,{
      bannerId: data.id,
      sortId: this.sortList[data.index]
    },true).then(res => {
      if(res.returnCode == "SUCCESS"){
        this.table._request();
        this.getSort();
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
  @DrawerCreate({ title: '广告详情', content: UpdateComponent }) addCustomer: ({ id: number }) => void;


}

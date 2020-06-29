import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { DatePipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { UpdateComponent } from './update/update.component';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

  @ViewChild('EaTable') table;


  queryNode: QueryNode[] = [

  ];

  paramsInit;
  stepList:any[] = [];
  sortList:any[] = [];

  tableNode = ['图片','道具名','类别', '是否特权' , '固定服务费' ,  '固定保证金' , '动态服务费' ,'动态保证金' , '是否用户上传图片' ,'创建时间', '更新时间', '排序','状态',  '操作'];
  constructor(
    private drawer: NzDrawerService,
    private http: HttpService,
    private format: DatePipe,
    private message: NzMessageService
  ) { 


    
  }

  ngOnInit() {
    this.getSort();
  }
  getSort(){
    this.http.post(`/console/props/sort`).then(res => {
      if(res.returnCode == "SUCCESS"){
        this.sortList = res.result;
      }else{
        this.message.error(res.returnMsg)
      }
    });
  }
  upShelves(id){
    this.http.post(`/console/props/upShelves/${ id }`).then(res => {
      if(res.returnCode == "SUCCESS"){
        this.message.success('操作成功！');
        this.table._request();
      }else{
        this.message.error(res.returnMsg)
      }
    });
  }
  //保存排序
  saveSort(data){
    this.http.post(`/console/props/updateSort`,{
      id: data.id,
      sortId: this.sortList[data.index]
    },true).then(res => {
      if(res.returnCode == "SUCCESS"){
        this.table._request();
      }else{
        this.message.error(res.returnMsg)
      }
    });
  }
  downShelves(id){
    this.http.post(`/console/props/downShelves/${ id }`).then(res => {
      if(res.returnCode == "SUCCESS"){
        this.message.success('操作成功！');
        this.table._request();
      }else{
        this.message.error(res.returnMsg)
      }
    });
  }
  @DrawerCreate({ title: '道具详情', content: UpdateComponent }) addCustomer: ({ id: number }) => void;


}

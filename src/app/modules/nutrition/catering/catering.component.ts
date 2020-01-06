import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { ListPageComponent } from 'src/app/ng-relax/components/list-page/list-page.component';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { UpdateComponent } from './update/update.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-catering',
  templateUrl: './catering.component.html',
  styleUrls: ['./catering.component.less']
})
export class CateringComponent implements OnInit {
  domains = environment.domain;
  listClass: any[] = [];
  classId: number;
  week: number;
  @ViewChild('listPage') listPage: ListPageComponent;
  @ViewChild('EaTable') table;
  tableNode = ['课程名称', '类别', '时长', '适用月龄', '状态', '创建时间', '操作'];
  tablist = [0, 1, 2, 3, 4, 5];
  queryNode: QueryNode[] = [

    {
      label: '食谱',
      key: 'status',
      type: 'select',
      options: [{ name: '食谱1', id: 0 }, { name: '食谱2', id: -1 }]
    },
  ];
  cateringList: any[] = [];
  dataList: any = [];
  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
    private message: NzMessageService

  ) {
    this.http.post('/message/listClassMessage', {}, false).then(res => { this.listClass = res.data.list; this.classId = res.data.list[0].id; this.getweek(); });

  }

  ngOnInit() {
  }
  selectClass(id) {
    this.classId = id;
    this.getData();
  }
  getweek() {
    this.http.post('/recipe/listWeekAndName', { classId: this.classId }, false).then(res => {
      this.http.post('/recipe/weekOfYear', {}, false).then(result => {
        this.cateringList = res.data.list;
        // this.week = result.data;
        this.week = result.data;

        this.getData();
      });

    });
  }
  updateWeek() {
    this.getData();
  }
  update() {
    let className: any = this.listClass.filter((item) => item.id == this.classId);
    let week: any = this.cateringList.filter((item) => item.week == this.week);
    if (!week.length) {
      this.message.error('请选择食谱类型');
      return false;
    }
    this.drawer.create({
      nzWidth: 1000,
      nzTitle: `调整食谱`,
      nzContent: UpdateComponent,
      nzContentParams: {
        className: className[0],
        week: week[0],
        dataList: JSON.parse(JSON.stringify(this.dataList)),

      }
    }).afterClose.subscribe(res => {
      this.getData();
      
  });
  }
  printFun(){
    let token = JSON.parse(localStorage.getItem('userInfo')).token;    
    let className: any = this.listClass.filter((item) => item.id == this.classId);
    let weekName: any = this.cateringList.filter((item) => item.week == this.week);
    let classNames = encodeURI(encodeURI(className[0].classSlogan +' '+ className[0].className));
    let weekNames = encodeURI(encodeURI(weekName[0].name));

    window.open(`http://wx.haochengzhang.com/ylbb-activity-recipes/?classId=${ this.classId }&week=${ this.week }&token=${ token }&domain=${ this.domains }&className=${ classNames }&weekName=${ weekNames }`); 
   }
  getData() {
    this.http.post('/recipe/listRecipe', { classId: this.classId, week: this.week }, false).then(res => {
      res.data.list.map(item => {
        if(item.content){
        item.content = item.content.replace(/(\d+):/g, "\"$1\":");
        item.content = JSON.parse(item.content);
        if (item.content.ingredients) {
          let arr = [];
          if( item.content.ingredients['蔬菜']){
            let txt = '【蔬菜】' + '：' + item.content.ingredients['蔬菜'];
            arr.push(txt);
          }
          if( item.content.ingredients['水果']){
            let txt = '【水果】' + '：' + item.content.ingredients['水果'];
            arr.push(txt);
          }
          if( item.content.ingredients['肉禽']){
            let txt = '【肉禽】' + '：' + item.content.ingredients['肉禽'];
            arr.push(txt);
          }
          if( item.content.ingredients['蛋类']){
            let txt = '【蛋类】' + '：' + item.content.ingredients['蛋类'];
            arr.push(txt);
          }
          if( item.content.ingredients['海鲜']){
            let txt = '【海鲜】' + '：' + item.content.ingredients['海鲜'];
            arr.push(txt);
          }
          if( item.content.ingredients['粮油']){
            let txt = '【粮油】' + '：' + item.content.ingredients['粮油'];
            arr.push(txt);
          }
          if( item.content.ingredients['零食']){
            let txt = '【零食】' + '：' + item.content.ingredients['零食'];
            arr.push(txt);
          }
          if( item.content.ingredients['冻品']){
            let txt = '【冻品】' + '：' + item.content.ingredients['冻品'];
            arr.push(txt);
          }
          if( item.content.ingredients['其它']){
            let txt = '【其它】' + '：' + item.content.ingredients['其它'];
            arr.push(txt);
          }
          item.arr = arr;
        }
      }else{
        item.content = {};
      }
      })
      this.dataList = res.data.list;

    });
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { EditComponent } from '../edit/edit.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzDrawerRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less']
})
export class UpdateComponent implements OnInit {
  @Input() className;
  @Input() week;
  @Input() dataList;  
  saveLoading: boolean = false;
  tablist = [0,1,2,3,4,5];
  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
    private drawerRef: NzDrawerRef<boolean>,
  ) { }

  ngOnInit() {
  }
  preview(index1,indexs){
    this.drawer.create({
      nzWidth: 550,
      nzTitle: `调整食谱`,
      nzContent: EditComponent,
      nzContentParams: { 
          index1,
          indexs,
          classId : this.className.id,
          week: this.week.week,
          dataList: JSON.parse(JSON.stringify(this.dataList))

      }
    }).afterClose.subscribe(res => {
      if(res){
      if(indexs == 5){
        this.dataList[index1].content = this.dataList[index1].content ? this.dataList[index1].content : {};
        this.dataList[index1].content.ingredients = res;
        let arr = [];
        if( res['蔬菜']){
          let txt = '【蔬菜】' + '：' + res['蔬菜'];
          arr.push(txt);
        }
        if( res['水果']){
          let txt = '【水果】' + '：' + res['水果'];
          arr.push(txt);
        }
        if( res['肉禽']){
          let txt = '【肉禽】' + '：' + res['肉禽'];
          arr.push(txt);
        }
        if( res['蛋类']){
          let txt = '【蛋类】' + '：' + res['蛋类'];
          arr.push(txt);
        }
        if( res['海鲜']){
          let txt = '【海鲜】' + '：' + res['海鲜'];
          arr.push(txt);
        }
        if( res['粮油']){
          let txt = '【粮油】' + '：' + res['粮油'];
          arr.push(txt);
        }
        if( res['零食']){
          let txt = '【零食】' + '：' + res['零食'];
          arr.push(txt);
        }
        if( res['冻品']){
          let txt = '【冻品】' + '：' + res['冻品'];
          arr.push(txt);
        }
        if( res['其它']){
          let txt = '【其它】' + '：' + res['其它'];
          arr.push(txt);
        }
        this.dataList[index1].arr = arr;
      }else{
        this.dataList[index1].content[indexs+1] = res[indexs+1];
      }
    }
      
  });
  }
  saves(){
    if(this.dataList)
    if(this.saveLoading){ return false;}
    this.saveLoading = true;
    this.http.post('/recipe/batchUpdateRecipe', { paramJson: JSON.stringify(this.dataList) },true).then(res => { 
      this.saveLoading = false;
        if(res.returnCode == "SUCCESS"){
          this.drawerRef.close(true);

        }
   });
  }
  close(){
    this.drawerRef.close(false);
  }

}

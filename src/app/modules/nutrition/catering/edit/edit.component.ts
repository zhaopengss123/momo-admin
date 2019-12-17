import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { DrawerClose } from 'src/app/ng-relax/decorators/drawer/close.decorator';
import { NzDrawerRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
@Input() index1;
@Input() indexs;
@Input() classId;
@Input() week;
@Input() dataList;
datas: any = {
  ingredients: {},
  content:{}
};
values:string;

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,

  ) { 

  }

  ngOnInit() {

    this.datas = this.dataList[this.index1] || {};
    this.datas.content = this.datas.content ? this.datas.content : {};
    this.datas.ingredients = this.datas.content.ingredients ? this.datas.content.ingredients : {};
    if(this.datas.content && this.datas.content[this.indexs+1]){
    let text = this.datas.content[this.indexs+1];
    var reg=new RegExp("<br />","g");
    text= text.replace(reg,"\r\n");
    this.datas.content[this.indexs+1] = text;
  }
  }
  saves(){
    if(this.indexs != 5){
      let text = this.datas.content[this.indexs+1];
      text = text.replace(/\r?\n/g, '<br />');
      this.datas.content[this.indexs+1] = text;
      this.drawerRef.close(this.datas.content);
    }else{
      this.drawerRef.close(this.datas.ingredients);
    }
    
  }
  close(){
    this.drawerRef.close(false);
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from 'src/app/ng-relax/services/http.service';
@Component({
  selector: 'app-update-list',
  templateUrl: './update-list.component.html',
  styleUrls: ['./update-list.component.less']
})
export class UpdateListComponent implements OnInit {
  @Input() type: string;
  @Input() name: string;
  classList: any[] = [];
  editName: string;
  listOfData: any[] = [];
  constructor(
    private message: NzMessageService,
    private http: HttpService,
  ) { 
 
  }

  ngOnInit() {
    this.getData();
}

uploadResult: any[] = [];
uploadInfo: string;

uploadComplate(e) {
  if (e.type === 'start') {
    this.uploadResult = [];
  }
  if (e.type === 'success') {
    this.message.create(e.file.response.result == 1000 ? 'success' : 'warning', e.file.response.message);
    if (e.file.response.result == 1000) {
      this.message.success(e.file.response.message || '操作成功');
    } else {
      this.uploadResult = e.file.response.data.errorClues;
      this.uploadInfo = `本次上传结果（${e.file.response.message}）`;
    }
  }
}
getData(){
  this.http.post('/attribute/getAllAttribute').then(res => {
    let data = res.data;
    let dataArr = Object.keys(data);
    dataArr.map(item => {
      let itemArr = Object.keys(data[item]);
      data[item].list = [];
      itemArr.map(items => {
        data[item].list.push({
          name: data[item][items],
          key: Number(items)
        });
      })
    })
    this.listOfData = data[this.type].list;
  });
}
addClass(){
  let json = {
    name: '',
    edit: true
  };
  this.listOfData.unshift(json);
}
saveEdit(data){
  if(!data.name){
    this.message.warning('名称不能为空！');
    return false;
  }
  let url:  string;
  let paramJson: any;
  if(data.id){
      url =  '/attribute/updateAttribute';
      paramJson= JSON.stringify({
        id: data.key,
        name : data.name,
      })
  }else{
     url = '/attribute/addAttribute';
     paramJson= JSON.stringify({
      attributeName: this.type,
      attributeValue : data.name,
    })    
  }
  this.http.post(url,{
    attributeName: this.type,
    attributeValue : data.name,
  }).then(res => {
    if(res.result == 1000){
      this.message.success('操作成功');
      data.edit = false;
      this.getData();
    }else{
      this.message.warning(res.message);
    }
  });
}

cancel(data){
  if(!data.id){
      this.listOfData.splice(0,1);
  }
  data.edit = false;
}
}
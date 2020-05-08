import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less']
})
export class PreviewComponent implements OnInit {
  @Input() previewInfo;
  detailData: any = {};
  footera: string;
  footerb: string;
  data: any = {};
  arrList: any[] = [];
  fontsizea: any;
  fontsizeb: any;
  constructor() { }

  ngOnInit() {
    let that = this;
    this.detailData =JSON.parse(JSON.stringify(this.previewInfo));
    if(this.detailData.content){    
      this.detailData.content = JSON.parse(this.detailData.content);
      if(this.detailData.content.length>7){
      var dates = this.detailData.content[0];
      if(!(isNaN(dates)&&!isNaN(Date.parse(dates)))){
          this.detailData.content.unshift(new Date());
      }    
      if(!(this.detailData.content[1].indexOf('jpg') == -1 && this.detailData.content[1].indexOf('jpeg') == -1&& this.detailData.content[1].indexOf('png') == -1&& this.detailData.content[1].indexOf('gif') == -1)){
          let arr = this.detailData.content.splice(1,1).join();
          this.detailData.content.push(arr);
      }
      that.detailData = this.detailData;

      var imglist = (this.detailData.content[ this.detailData.content.length - 1 ]).split(',');
      for(var i = 0; i< imglist.length; i++){
          var json:any = {};
          json.url = imglist[i];
          json.text = this.detailData.content[i+1];
          that.arrList.push(json);
      }
      that.footera = this.detailData.content[7];
      if(that.footera.length>55){
          let len = Math.ceil((that.footera.length - 55)/20);
          that.fontsizea = 22 - len;
          that.fontsizea = that.fontsizea >12 ? that.fontsizea: 12;

      }
      that.footerb = this.detailData.content[8];
      if(that.footerb.length>55){
          let len = Math.ceil((that.footerb.length - 55)/20);
          that.fontsizeb = 22 - len;
          that.fontsizeb = that.fontsizeb >12 ? that.fontsizeb: 12;
      }
  }else {
      alert('该学员未生成成长日记！');
      that.detailData = this.detailData;
  }
  }else{
      that.detailData = this.detailData;
  }
  }

}

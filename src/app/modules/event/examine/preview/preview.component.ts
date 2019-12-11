import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../../../../ng-relax/services/http.service';

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
  constructor(
    private http: HttpService,
  ) { }

  ngOnInit() {

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
      this.detailData = this.detailData;

      var imglist = (this.detailData.content[ this.detailData.content.length - 1 ]).split(',');
      for(var i = 0; i< imglist.length; i++){
          var json:any = {};
          json.url = imglist[i];
          json.text = this.detailData.content[i+1];
          this.arrList.push(json);
      }
      this.footera = this.detailData.content[7];
      if(this.footera.length>55){
          let len = Math.ceil((this.footera.length - 55)/20);
          this.fontsizea = 22 - len;
          this.fontsizea = this.fontsizea >12 ? this.fontsizea: 12;
      }
      this.footerb = this.detailData.content[8];
      if(this.footerb.length>55){
          let len = Math.ceil((this.footerb.length - 55)/20);
          this.fontsizeb = 22 - len;
          this.fontsizeb = this.fontsizeb >12 ? this.fontsizeb: 12;
      }
  }else {
      alert('该学员未生成成长日记！');
      this.detailData.year = this.detailData.startTime;
      this.detailData = this.detailData;
  }
  }else{
      this.detailData = this.detailData;
  }
  }

}

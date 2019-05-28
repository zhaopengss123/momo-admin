import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.less']
})
export class ServiceComponent implements OnInit {

  @Input() studentId: number;

  constructor(
    private http: HttpService
  ) { }

  ngOnInit() {
    this.query();
  }


  queryParams: any = {
    pageNo: 1,
    totalCount: 0
  };
  querySubmit(params) {
    this.queryParams = Object.assign({ pageNo: 1, totalCount: this.queryParams.totalCount }, params);
    this.query();
  }

  loading: boolean;
  dataSet: any[] = [];
  query() {
    this.loading = true;
    this.http.post('/message/listEventByCondition', { paramJson: JSON.stringify(Object.assign(this.queryParams, { studentId: this.studentId })) }, false).then(res => {
      this.loading = false;
      this.queryParams.totalCount = res.data.totalCount;
      res.data.list.map(item => {
        try {
          item.appContent = JSON.parse(item.appContent);
          item.appContent.content = item.appContent.content.split('|~!|').join('<i>|</i>');
        } catch (error) {
          item.appContent = { content: '', videoUrl: '', imgUrlList: [] };
        }
        return item;
      });
      this.dataSet = res.data.list;
    })
  }
  loadData(pi: number): void {
    this.queryParams.pageNo = pi;
    this.query();
  }


  previewUrl(url) {
    window.open(url)
  }
}

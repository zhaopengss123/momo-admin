import { FormControl, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less']
})
export class ManagementComponent implements OnInit {
  domain = environment.domain;
  nickName = new FormControl('tom');
  formModel: FormGroup;
  selectindex: any;
  AllList: any;
  findList: any;
  findindex: any;
  successRate = false;
  menu: any;
  pageId: string = '2';
  formList = {};
  dataSet = [];
  ListHeader: any;
  ListContent: any = [];
  datenow: any;
  formData: any = {
    "datePickerList": [],
    "selectList": [],
    "textFieldList": [],
    "writeableSelectList": []
  };
  constructor(
    private http: HttpService,
    private format: DatePipe,
  ) {
    var date = new Date();
    var year = date.getFullYear();
    var month: any = date.getMonth() + 1;
    var day: any = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    this.datenow = year + "-" + month + "-" + day;
    this.getform(this.pageId);
    this.formModel = new FormGroup({

    });
  }
  changefind() {
    let index = this.selectindex - 1;
    this.findList = this.menu[index].children;
  }
  subData() {
    let params = JSON.parse(JSON.stringify(this.formModel.value));

    if (this.formData.datePickerList) {
      this.formData.datePickerList.map(res => {
        params[res.fieldName] = this.format.transform(params[res.fieldName], 'yyyy-MM-dd');
      })
    }

    params.reportId = this.pageId;
    for (let i in params) {
      if (params[i] == null || params[i] == '') {
        delete params[i];
      }
    }
    if (!this.successRate) {
      this.http.post('/report/query', { paramJson: JSON.stringify(params) }, false).then(res => {
        if (res.result == 1000) {
          this.ListHeader = res.data.header;
          this.ListContent = res.data.content;
        }
      });
    } else {
      if (!params.startDate || !params.endDate) {
        this.ListHeader = [];
        this.ListContent = [];
        return false;
      }
      this.http.post('/cardSuccessRate/query', { paramJson: JSON.stringify(params) }, false).then(res => {
        this.ListHeader = res.data.header;
        this.ListContent = res.data.content;
        this.ListHeader = [];
        this.ListContent = [];
        this.ListHeader.push(res.data.header['MONTH']);
        this.ListHeader.push(res.data.header['CARD_TOTAL']);
        this.ListHeader.push(res.data.header['COME_TOTAL']);
        this.ListHeader.push(res.data.header['EXP']);
        this.ListHeader.push(res.data.header['INCOME_TOTAL']);
        this.ListHeader.push(res.data.header['RENEWAL']);
        this.ListHeader.push(res.data.header['SUCCESS_RATE']);
        this.ListHeader.push(res.data.header['TEL']);
        this.ListHeader.push(res.data.header['TOTAL']);
        this.ListHeader.push(res.data.header['UNIT_PRICE']);

        res.data.content.map(item => {
          let arr = [];
          arr.push(item.MONTH);
          arr.push(item.CARD_TOTAL);
          arr.push(item.COME_TOTAL);
          arr.push(item.EXP);
          arr.push(item.INCOME_TOTAL);
          arr.push(item.RENEWAL);
          arr.push(item.SUCCESS_RATE);
          arr.push(item.TEL);
          arr.push(item.TOTAL);
          arr.push(item.UNIT_PRICE);

          this.ListContent.push(arr);
        })
      });
    }
  }
  exports() {
    let params = JSON.parse(JSON.stringify(this.formModel.value));
    if (this.formData.datePickerList) {
      this.formData.datePickerList.map(res => {
        params[res.fieldName] = this.format.transform(params[res.fieldName], 'yyyy-MM-dd');
      })
    }

    params.reportId = this.pageId;
    for (let i in params) {
      if (params[i] == null || params[i] == '') {
        delete params[i];
      }
    }
    window.open(this.domain + '/report/export?paramJson=' + JSON.stringify(params));
  }
  elder(index) {
    let reportId = index == '0' ? '2' : index == '1' ? '3' : '';
    this.pageId = reportId;
    this.getform(reportId);
  }
  getform(reportId) {

    if (reportId != 88) {
      this.successRate = false;
      this.http.post('/report/buildQueryPage', { paramJson: JSON.stringify({ reportId: reportId }) }, false).then(res => {
        this.formData = res.data;
        this.ListHeader = [];
        this.ListContent = [];
        if (this.formData.selectList) {

          this.formData.selectList.map((item, index) => {
            if (item.dataSource) {
              let dataSource = JSON.stringify(item.dataSource);
              dataSource = dataSource.substring(1, dataSource.length - 1);
              item.dataSource = dataSource.split(',');
              item.dataSource.map((items, indexs) => {
                let str = items.split(':')[0];
                let str1 = items.split(':')[1];
                str = str.substring(1, str.length - 1);
                str1 = str1.substring(1, str1.length - 1);
                let jsons: any = {};
                jsons.key = str;
                jsons.name = str1;
                this.formData.selectList[index].dataSource[indexs] = jsons;
              })
            }
          })
        }


        if (this.formData.datePickerList) {
          this.formData.datePickerList.map(res => {
            this.formModel.addControl(res.fieldName, new FormControl(new Date()))
          })
        }

        if (this.formData.selectList) {
          this.formData.selectList.map(res => {
            this.formModel.addControl(res.fieldName, new FormControl())
          })
        }
        if (this.formData.textFieldList) {
          this.formData.textFieldList.map(res => {
            this.formModel.addControl(res.fieldName, new FormControl())
          })
        }
      });
    } else {
      this.successRate = true;
      this.formData = {};
      this.formData.datePickerList = [{ "chineseName": "起始日期", "fieldName": "startDate", "null": false, "pattern": "yyyy-MM-dd" },
      { "chineseName": "终止日期", "fieldName": "endDate", "null": false, "pattern": "yyyy-MM-dd" }];
      this.formData.datePickerList.map(res => {
        this.formModel.addControl(res.fieldName, new FormControl())
      })

    }
  }
  ngOnInit() {

  }

}

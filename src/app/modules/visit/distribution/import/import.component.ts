import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.less']
})
export class ImportComponent implements OnInit {

  constructor(
    private message: NzMessageService,
    private drawerRef: NzDrawerRef
  ) { }

  ngOnInit() {
  }

  uploadResult: any[] = [];
  uploadInfo: string;

  uploadComplate(e) {
    console.log(e)
    if (e.type === 'start') {
      this.uploadResult = [];
    }
    if (e.type === 'success') {
      this.message.create(e.file.response.result == 1000 ? 'success' : 'warning', e.file.response.message);
      if (e.file.response.result == 1000) {
        this.message.success(e.file.response.message);
      } else {
        this.uploadResult = e.file.response.data.errorClues;
        this.uploadInfo = `本次上传结果（${e.file.response.message}）`;
      }
    }
  }
  
  save() {
    this.drawerRef.close(true)
  }
  
}

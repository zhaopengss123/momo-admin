import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.less']
})
export class MemberlistComponent implements OnInit {


  @Input() teacherId: any[] = [];

  constructor(
    private http: HttpService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
  }

  // appint(cardInfo) {
  //   this.http.post('/student/studentInfoIsComplete', {
  //     paramJson: JSON.stringify({
  //       studentId: this.studentInfo.studentId, buttonName: 'isReserve'
  //     }),
  //   }).then(res => {
  //     if (res.returnCode == "SUCCESS") {
  //       cardInfo.operation = 'appoint';
  //       this.modalRef.close(cardInfo);
  //     } else if (res.result == 1028) {
  //       this.modalRef.close({ operation: 'update' });
  //       this.message.warning(res.returnMsg);
  //     } else {
  //       this.message.warning(res.returnMsg);
  //     }
  //   });
  // }

}

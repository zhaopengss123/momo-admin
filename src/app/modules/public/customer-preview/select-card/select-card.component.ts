import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-select-card',
  templateUrl: './select-card.component.html',
  styleUrls: ['./select-card.component.less']
})
export class SelectCardComponent implements OnInit {

  @Input() cardList: any[] = [];

  @Input() studentInfo: any;

  constructor(
    private http: HttpService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
  }

  appint(cardInfo) {
    this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.studentInfo.studentId, buttonName: 'isReserve'
      }),
    }).then(res => {
      if (res.result == 1000) {
        cardInfo.operation = 'appoint';
        this.modalRef.close(cardInfo);
      } else if (res.result == 1028) {
        this.modalRef.close({ operation: 'update' });
        this.message.warning(res.message);
      } else {
        this.message.warning(res.message);
      }
    });
  }

}

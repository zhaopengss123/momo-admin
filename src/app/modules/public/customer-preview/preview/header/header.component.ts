import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { PaymentComponent } from '../../payment/payment.component';
import { ClassComponent } from '../../class/class.component';
import { LeavingComponent } from '../../leaving/leaving.component';
import { AppointComponent } from '../../appoint/appoint.component';
import { NzDrawerService, NzDrawerRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UpdateComponent } from '../../update/update.component';
import { SelectCardComponent } from '../../select-card/select-card.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  @Input() memberInfo: any = {};
  
  showReserverBtn: boolean;

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
    private drawerRef: NzDrawerRef,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit() {
  }

  /* -------------- 点击预约校验 -------------- */
  async appointValid() {
    let valid = await this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.memberInfo.studentInfo.studentId, buttonName: 'isReserve'
      }),
    });
    if (valid.result == 1000) {
      let cardList = valid.data;
      let studentInfo = this.memberInfo.studentInfo;
      if (!cardList.length) {
        this.appoint({ studentInfo, cardInfo: {} });
      } else if (cardList.length === 1) {
        this.appoint({ studentInfo, cardInfo: cardList[0] });
      } else {
        this.modal.create({
          nzTitle: '选择开卡',
          nzContent: SelectCardComponent,
          nzComponentParams: { cardList, studentInfo },
          nzFooter: null
        }).afterClose.subscribe(res => {
          if (res && res.operation == 'appoint') {
            this.appoint({ studentInfo, cardInfo: res });
          } else if (res && res.operation == 'update') {
            this.update({ id: studentInfo.studentId, type: 'isReserve' })
          }
        });
      }
    } else {
      this.message.warning(valid.message);
      valid.result != 1999 && this.update({ id: this.memberInfo.studentInfo.studentId, type: 'isReserve' })
    }
  }

  /* -------------- 点击缴费校验 -------------- */
  paymentValid() {
    this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.memberInfo.studentInfo.studentId, buttonName: 'isPay'
      }),
    }).then(res => {
      if (res.result == 1000) {
        this.payment({ id: this.memberInfo.studentInfo.studentId });
      } else {
        this.message.warning(res.message);
        this.update({ id: this.memberInfo.studentInfo.studentId, type: 'isPay' })
      }
    });
  }

  /* -------------- 点击转班校验 -------------- */
  classValid() {
    this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.memberInfo.studentInfo.studentId, buttonName: 'isAdjustClass'
      }),
    }).then(res => res.result == 1000 ? this.class({ id: this.memberInfo.studentInfo.studentId }, res.data[0]) : this.message.warning(res.message));
  }

  @DrawerCreate({ title: '学员信息', content: UpdateComponent }) update: ({ id: number, type: string }) => void;

  @DrawerCreate({ content: PaymentComponent, width: 1060, closable: false }) payment: ({ id: number }) => void;

  // @DrawerCreate({ content: ClassComponent, title: '转/升班' }) class: ({ id: number }, cardInfo) => void;
  class(params, cardInfo) {
    this.drawer.create({
      nzTitle: '转/升班',
      nzWidth: 720,
      nzContent: ClassComponent,
      nzBodyStyle: {
        'padding-bottom': '53px'
      },
      nzContentParams: { id: params.id, cardInfo }
    }).afterClose.subscribe((res: boolean) => {});
  }

  @DrawerCreate({ content: LeavingComponent, title: '退园', width: 460 }) leaving: ({ id: number }) => void;

  @DrawerCreate({ content: AppointComponent, width: 1148, closable: false }) appoint: ({ studentInfo: any, cardInfo }) => void;

}

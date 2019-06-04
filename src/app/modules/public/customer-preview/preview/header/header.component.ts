import { HttpService } from 'src/app/ng-relax/services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { PaymentComponent } from '../../payment/payment.component';
import { ClassComponent } from '../../class/class.component';
import { LeavingComponent } from '../../leaving/leaving.component';
import { AppointComponent } from '../../appoint/appoint.component';
import { NzDrawerService, NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { ModifyData } from 'src/app/ng-relax/decorators/list/modify.decorator';
import { UpdateComponent } from '../../update/update.component';

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
    private message: NzMessageService
  ) { }

  ngOnInit() {
  }


  appointValid() {
    this.http.post('/student/studentInfoIsComplete', {
      paramJson: JSON.stringify({
        studentId: this.memberInfo.studentInfo.studentId, buttonName: 'isReserve'
      }),
    }).then(res => {
      if (res.result == 1000) {
        this.appoint({ studentInfo: this.memberInfo.studentInfo })
      } else {
        this.message.warning(res.message);
        /* ? 1999 => 定期已经预约过 */
        res.result != 1999 && this.update({ id: this.memberInfo.studentInfo.studentId, type: 'isReserve' })
      }
    })
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
    }).then(res => res.result == 1000 ? this.class({ id: this.memberInfo.studentInfo.studentId }) : this.message.warning(res.message));
  }

  @DrawerCreate({ title: '学员信息', content: UpdateComponent }) update: ({ id: number, type: string }) => void;

  @DrawerCreate({ content: PaymentComponent, width: 1060, closable: false }) payment: ({ id: number }) => void;

  @DrawerCreate({ content: ClassComponent, title: '转/升班' }) class: ({ id: number }) => void;

  @DrawerCreate({ content: LeavingComponent, title: '退园', width: 460 }) leaving: ({ id: number }) => void;

  @DrawerCreate({ content: AppointComponent, width: 1148, closable: false }) appoint: ({ studentInfo: any }) => void;

  @ModifyData('/membermanage/returnVisit/setNoIntention') nointention: (id: number) => void;


}

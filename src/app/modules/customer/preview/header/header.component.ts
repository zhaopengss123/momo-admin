import { HttpService } from 'src/app/ng-relax/services/http.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { DrawerCreate } from 'src/app/ng-relax/decorators/drawer/create.decorator';
import { PaymentComponent } from '../../payment/payment.component';
import { ClassComponent } from '../../class/class.component';
import { LeavingComponent } from '../../leaving/leaving.component';
import { AppointComponent } from '../../appoint/appoint.component';
import { NzDrawerService, NzDrawerRef } from 'ng-zorro-antd';
import { ModifyData } from 'src/app/ng-relax/decorators/list/modify.decorator';

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
    private drawerRef: NzDrawerRef
  ) { }

  ngOnInit() {
    this.memberInfo.schoolRollId = this.memberInfo.type ? this.memberInfo.type : null;
    this.memberInfo.type == 2 &&
      this.http.post('/student/studentInfoIsComplete', {
        paramJson: JSON.stringify({
          studentId: this.memberInfo.studentInfo.studentId, buttonName: 'isReserve'
        }),
      }).then(res => {
        this.showReserverBtn = res.result != 1999;
      })
  }


  @DrawerCreate({ content: PaymentComponent, closable: false }) payment: ({ id: number }) => void;

  @DrawerCreate({ content: ClassComponent, title: '转/升班' }) class: ({ id: number }) => void;

  @DrawerCreate({ content: LeavingComponent, title: '退园', width: 460 }) leaving: ({ id: number }) => void;

  @DrawerCreate({ content: AppointComponent, width: 1148, closable: false }) appoint: ({ studentInfo: any }) => void;

  @ModifyData('/membermanage/returnVisit/setNoIntention') nointention: (id: number) => void;

}

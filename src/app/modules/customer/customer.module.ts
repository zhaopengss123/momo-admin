import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { UpdateComponent } from './update/update.component';
import { PreviewComponent } from './preview/preview.component';
import { InformationComponent } from './preview/information/information.component';
import { TrackComponent } from './preview/track/track.component';
import { TransactionComponent } from './preview/transaction/transaction.component';
import { AttendanceComponent } from './preview/attendance/attendance.component';
import { ServiceComponent } from './preview/service/service.component';
import { JournalComponent } from './preview/journal/journal.component';
import { HeaderComponent } from './preview/header/header.component';
import { PaymentComponent } from './payment/payment.component';
import { ClassComponent } from './class/class.component';
import { LeavingComponent } from './leaving/leaving.component';

@NgModule({
  declarations: [ListComponent, UpdateComponent, PreviewComponent, InformationComponent, TrackComponent, TransactionComponent, AttendanceComponent, ServiceComponent, JournalComponent, HeaderComponent, PaymentComponent, ClassComponent, LeavingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListComponent
      }
    ]),
    NgZorroAntdModule,
    NgRelaxModule
  ],
  entryComponents: [UpdateComponent, PreviewComponent, PaymentComponent, ClassComponent, LeavingComponent]
})
export class CustomerModule { }

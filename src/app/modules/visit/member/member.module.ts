import { VisitModule } from './../visit.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberComponent } from './member.component';
import { RouterModule } from '@angular/router';
import { CustomerPreviewModule } from '../../public/customer-preview/customer-preview.module';

@NgModule({
  declarations: [MemberComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    VisitModule,
    RouterModule.forChild([{
      path: '',
      component: MemberComponent
    }]),
    CustomerPreviewModule,
  ]
})
export class MemberModule { }

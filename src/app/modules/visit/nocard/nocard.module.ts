import { RouterModule } from '@angular/router';
import { VisitModule } from './../visit.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NocardComponent } from './nocard.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CustomerPreviewModule } from '../../public/customer-preview/customer-preview.module';

@NgModule({
  declarations: [NocardComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    VisitModule,
    RouterModule.forChild([{
      path: '',
      component: NocardComponent
    }]),
    CustomerPreviewModule,
  ]
})
export class NocardModule { }

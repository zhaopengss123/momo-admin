import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgRelaxModule } from './../../../ng-relax/ng-relax.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClueComponent } from './clue.component';
import { VisitModule } from '../visit.module';
import { RouterModule } from '@angular/router';
import { CustomerPreviewModule } from '../../public/customer-preview/customer-preview.module';

@NgModule({
  declarations: [ClueComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    VisitModule,
    RouterModule.forChild([{
      path: '',
      component: ClueComponent
    }]),
    CustomerPreviewModule,
  ]
})
export class ClueModule { }

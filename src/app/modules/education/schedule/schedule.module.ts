import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { EducationModule } from '../education.module';
import { RouterModule } from '@angular/router';
import { CustomerPreviewModule } from '../../public/customer-preview/customer-preview.module';

@NgModule({
  declarations: [ScheduleComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    EducationModule,
    RouterModule.forChild([{
      path: '',
      component: ScheduleComponent
    }]),
    CustomerPreviewModule,
  ]
})
export class ScheduleModule { }

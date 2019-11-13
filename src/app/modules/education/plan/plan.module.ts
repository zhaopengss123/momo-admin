import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { PlanComponent } from './plan.component';
import { RouterModule } from '@angular/router';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { EducationModule } from '../education.module';

@NgModule({
  declarations: [PlanComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    EducationModule,
    RouterModule.forChild([{
      path: '',
      component: PlanComponent
    }]),
  ],
  providers: [ DatePipe ]
})
export class PlanModule { }

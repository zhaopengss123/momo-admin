import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { TimetableComponent } from './timetable.component';
import { RouterModule } from '@angular/router';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { EducationModule } from '../education.module';

@NgModule({
  declarations: [TimetableComponent],
  imports: [
    CommonModule,
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    EducationModule,
    RouterModule.forChild([{
      path: '',
      component: TimetableComponent
    }]),
  ],
  providers: [ DatePipe ]

})
export class TimetableModule { }

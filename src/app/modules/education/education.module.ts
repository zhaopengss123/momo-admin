import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ImportComponent } from './public/import/import.component';
import { UpdateComponent } from './public/update/update.component';
import { DetailComponent } from './public/detail/detail.component';
import { UpdateScheduleComponent } from './public/update-schedule/update-schedule.component';
import { UpdatetimeComponent } from './public/updatetime/updatetime.component';
import { AdjustmentComponent } from './public/adjustment/adjustment.component';
import { SelectClassComponent } from './public/select-class/select-class.component';
import { QuillModule } from 'ngx-quill';
import { LessonDetailComponent } from './public/lesson-detail/lesson-detail.component';
import { SafeHtmlPipe } from '../../core/safe-html.pipe';
// import quillBetterTable from 'node_modules/quill-better-table/dist/quill-better-table.min.js'
@NgModule({
  declarations: [UpdateComponent, ImportComponent, DetailComponent, UpdateScheduleComponent, UpdatetimeComponent, AdjustmentComponent, SelectClassComponent, LessonDetailComponent,SafeHtmlPipe],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    QuillModule.forRoot()
  ],
  entryComponents: [UpdateComponent, ImportComponent , DetailComponent , UpdateScheduleComponent, UpdatetimeComponent, AdjustmentComponent, SelectClassComponent, LessonDetailComponent],
  providers: [ DatePipe ]
}) 
export class EducationModule { }

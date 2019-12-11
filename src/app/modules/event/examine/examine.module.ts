import { ExamineComponent } from './examine.component';
import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';

import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { UpdateComponent } from './update/update.component';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExamineComponent
      }
    ]),
    NgZorroAntdModule,
    NgRelaxModule
  ],
  declarations: [ExamineComponent, UpdateComponent, PreviewComponent],
  entryComponents: [UpdateComponent,PreviewComponent],
  providers: [ DatePipe ]
})
export class ExamineModule { }

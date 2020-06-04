import { NgModule } from '@angular/core';
import { ScienceComponent } from './science.component';
import { VisitModule } from '../visit.module';
import { RouterModule } from '@angular/router';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule ,DatePipe } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { TextUpdateComponent } from './text-update/text-update.component';
import { EditorModule } from 'src/app/ng-relax/components/editor/editor.module';

@NgModule({
  declarations: [ScienceComponent,TextUpdateComponent],
  imports: [
    CommonModule,
    VisitModule,
    NgRelaxModule,
    NgZorroAntdModule,
    RouterModule.forChild([{
      path: '',
      component: ScienceComponent
    }]),
    QuillModule.forRoot(),
    EditorModule

  ],
  entryComponents: [TextUpdateComponent],
  providers:[ DatePipe ]
})
export class ScienceModule { }

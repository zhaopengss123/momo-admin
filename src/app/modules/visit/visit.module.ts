import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './public/preview/preview.component';
import { UpdateComponent } from './public/update/update.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { VisitComponent } from './visit.component';
import { RouterModule } from '@angular/router';
import { NoExperienceClueComponent } from './no-experience-clue/no-experience-clue.component';
@NgModule({
  declarations: [PreviewComponent, UpdateComponent, VisitComponent, NoExperienceClueComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    RouterModule.forChild([
      {
        path: '',
        component: VisitComponent
      }
    ]),

  ],
  entryComponents: [PreviewComponent, UpdateComponent]
})
export class VisitModule { }

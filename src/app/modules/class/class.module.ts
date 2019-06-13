import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { UpdateComponent } from './list/update/update.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { PreviewComponent } from './list/preview/preview.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AddComponent } from './list/preview/add/add.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListComponent
      }
    ]),
    NgZorroAntdModule,
    NgRelaxModule
  ],
  declarations: [ListComponent, UpdateComponent, PreviewComponent, AddComponent],
  entryComponents: [UpdateComponent, PreviewComponent, AddComponent]
})
export class ClassModule { }

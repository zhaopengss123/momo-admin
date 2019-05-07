import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { UpdateComponent } from './list/update/update.component';
import { QuitComponent } from './list/quit/quit.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { ImportComponent } from './list/import/import.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListComponent
      },
    ]),
    NgRelaxModule,
    NgZorroAntdModule
  ],
  declarations: [ListComponent, UpdateComponent, QuitComponent, ImportComponent],
  entryComponents: [UpdateComponent, ImportComponent]
})
export class ChildrenModule { }

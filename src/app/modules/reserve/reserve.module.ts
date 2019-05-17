import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReserveComponent } from './list/list.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ReserveComponent
      }
    ]),
    NgZorroAntdModule,
    NgRelaxModule
  ],
  declarations: [ReserveComponent],
  entryComponents: [ReserveComponent]
})

export class ReserveModule { }

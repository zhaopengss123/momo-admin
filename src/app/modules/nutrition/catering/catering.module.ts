import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';

import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CateringComponent } from './catering.component';
import { UpdateComponent } from './update/update.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CateringComponent
      }
    ]),
    NgZorroAntdModule,
    NgRelaxModule
  ],
  declarations: [CateringComponent, UpdateComponent, EditComponent],
  entryComponents: [UpdateComponent,EditComponent],
  providers:[ DatePipe ]
})

export class CateringModule { }

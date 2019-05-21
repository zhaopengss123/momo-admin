import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigComponent } from './config.component';
import { RouterModule } from '@angular/router';

import { NgRelaxModule } from './../../../ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';


@NgModule({
  declarations: [ConfigComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    NgRelaxModule,
    RouterModule.forChild([
      {
        path: '',
        component: ConfigComponent
      }
    ]),
  ]
})
export class ConfigModule { }
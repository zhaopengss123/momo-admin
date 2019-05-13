import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceComponent } from './service.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [ServiceComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild([
      {
        path: '',
        component: ServiceComponent
      }
    ])
  ],
})
export class ServiceModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceComponent } from './service.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { QuillModule } from 'ngx-quill';

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
    ]),
    NgRelaxModule,
    QuillModule.forRoot()
  ],
})
export class ServiceModule { }

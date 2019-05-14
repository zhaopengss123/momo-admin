import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { UpdateComponent } from './update/update.component';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  declarations: [ListComponent, UpdateComponent, PreviewComponent],
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
  entryComponents: [UpdateComponent, PreviewComponent]
})
export class CustomerModule { }

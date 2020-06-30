import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishedComponent } from './published.component';
import { UpdateComponent } from './update/update.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [PublishedComponent, UpdateComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    RouterModule.forChild([{
      path: '',
      component: PublishedComponent
    }]),
  ],
  entryComponents:[ UpdateComponent ],
})
export class PublishedModule { }

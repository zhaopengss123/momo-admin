import { NgModule } from '@angular/core';
import { CommonModule , DatePipe} from '@angular/common';
import { ListComponent } from './list.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PropModule } from '../prop.module';
import { RouterModule } from '@angular/router';
import { CustomerPreviewModule } from '../../public/customer-preview/customer-preview.module';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [ListComponent, UpdateComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    PropModule,
    RouterModule.forChild([{
      path: '',
      component: ListComponent
    }]),
    CustomerPreviewModule,
  ],
  entryComponents:[ UpdateComponent ],

  providers: [ DatePipe ]
})
export class ListModule { }

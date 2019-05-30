import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClueComponent } from './clue.component';
import { VisitModule } from '../visit.module';
import { RouterModule } from '@angular/router';
import { CustomerPreviewModule } from '../../public/customer-preview/customer-preview.module';
import { ImportComponent } from './import/import.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';

@NgModule({
  declarations: [ClueComponent, ImportComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    VisitModule,
    RouterModule.forChild([{
      path: '',
      component: ClueComponent
    }]),
    CustomerPreviewModule,
  ],
  entryComponents: [ImportComponent]
})
export class ClueModule { }

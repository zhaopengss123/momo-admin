import { VisitModule } from './../visit.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionComponent } from './distribution.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { ImportComponent } from './import/import.component';
import { CustomerPreviewModule } from '../../public/customer-preview/customer-preview.module';

@NgModule({
  declarations: [DistributionComponent, ImportComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    VisitModule,
    RouterModule.forChild([{
      path: '',
      component: DistributionComponent
    }]),
    CustomerPreviewModule,
  ],
  entryComponents: [ImportComponent]
})
export class DistributionModule { }

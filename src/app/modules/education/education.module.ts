import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ImportComponent } from './public/import/import.component';
import { UpdateComponent } from './public/update/update.component';
import { DetailComponent } from './public/detail/detail.component';

@NgModule({
  declarations: [UpdateComponent, ImportComponent, DetailComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
  ],
  entryComponents: [UpdateComponent, ImportComponent , DetailComponent],
  providers: [ DatePipe ]
}) 
export class EducationModule { }

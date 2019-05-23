import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentStatusComponent } from './student-status.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';

@NgModule({
  declarations: [StudentStatusComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild([
      {
        path: '',
        component: StudentStatusComponent
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
    NgRelaxModule,
    QuillModule.forRoot(),
  ]
})
export class StudentStatusModule { }

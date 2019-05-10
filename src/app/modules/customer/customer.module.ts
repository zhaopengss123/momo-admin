import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'list',
        data: { title: '客户列表' },
        component: ListComponent
      }
    ])
  ]
})
export class CustomerModule { }

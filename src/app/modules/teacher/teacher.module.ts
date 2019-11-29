import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';

import { ListComponent } from './list/list.component';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { UpdateComponent } from './list/update/update.component';
import { RouterModule } from '@angular/router';
import { MemberlistComponent } from './list/memberlist/memberlist.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListComponent
      },
    ]),
    NgZorroAntdModule,
    NgRelaxModule
  ],
  declarations: [ListComponent, UpdateComponent, MemberlistComponent],
  entryComponents: [UpdateComponent , MemberlistComponent],
  providers: [ DatePipe ]
})
export class TeacherModule { }

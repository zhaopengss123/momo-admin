import { NgModule } from '@angular/core';
import { MemberComponent } from './member.component';
import { CommonModule , DatePipe} from '@angular/common';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [MemberComponent],
  imports: [
    CommonModule,
    NgRelaxModule,
    NgZorroAntdModule,
    RouterModule.forChild([{
      path: '',
      component: MemberComponent
    }]),
  ],
  entryComponents:[ MemberComponent ],

  providers: [ DatePipe ]
})
export class MemberModule { }

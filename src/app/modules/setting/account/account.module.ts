import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgRelaxModule } from 'src/app/ng-relax/ng-relax.module';
import { DistributionComponent } from './distribution/distribution.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { PasswordComponent } from '../../password/password.component';

@NgModule({
  declarations: [AccountComponent, DistributionComponent,PasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AccountComponent
      }
    ]),
    NgRelaxModule,
    NgZorroAntdModule
  ],
  entryComponents: [DistributionComponent,PasswordComponent]
})
export class AccountModule { }

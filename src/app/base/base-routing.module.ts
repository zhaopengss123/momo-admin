import { BaseComponent } from './base.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../ng-relax/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: 'index',
        data: { title: '首页', noReuse: true },
        loadChildren: 'src/app/modules/index/index.module#IndexModule'
      },
      {
        path: 'password',
        data: { title: '修改密码', noReuse: true },
        loadChildren: 'src/app/modules/password/password.module#PasswordModule'
      },
 
     
      {
        path: 'visit',
        data: { noReuse: true },
        children: [
          {
            path: 'today',
            data: { title: '广告管理' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/visit/today/today.module#TodayModule'
          },
        ]
      },
      {
        path: 'member',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '用户列表' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/member/member.module#MemberModule'
          },
        ]
      },
      {
        path: 'published',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '发布列表' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/published/published.module#PublishedModule'
          },
        ]
      },
      {
        path: 'prop',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '道具管理' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/prop/list/list.module#ListModule'
          },
        ]
      },
      {
        path: 'order',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '订单管理' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/order/order.module#OrderModule'
          },
        ]
      },
      {
        path: 'business',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '交易记录' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/business/business.module#BusinessModule'
          },
        ]
      },
      {
        path: 'sms',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '短信记录' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/sms/sms.module#SmsModule'
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }

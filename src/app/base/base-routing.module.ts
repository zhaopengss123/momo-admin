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
        path: 'teacher',
        data: { title: '老师管理' },
        canLoad: [AuthGuardService],
        loadChildren: 'src/app/modules/teacher/teacher.module#TeacherModule'
      },
      {
        path: 'class',
        data: { title: '班级管理' },
        canLoad: [AuthGuardService],
        loadChildren: 'src/app/modules/class/class.module#ClassModule'
      },
      {
        path: 'reserve',
        data: { title: '预约管理' },
        canLoad: [AuthGuardService],
        loadChildren: 'src/app/modules/reserve/reserve.module#ReserveModule'
      },
      {
        path: 'setting',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '事件设置' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/setting/list/list.module#ListModule'
          },
          {
            path: 'notice',
            data: { title: '公告设置' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/setting/notice/notice.module#NoticeModule'
          },
          {
            path: 'account',
            data: { title: '账号管理' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/setting/account/account.module#AccountModule'
          },
          {
            path: 'role',
            data: { title: '角色管理' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/setting/role/role.module#RoleModule'
          },
          {
            path: 'monitor',
            data: { title: '监控管理' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/setting/monitor/monitor.module#MonitorModule'
          },
          {
            path: 'config',
            data: { title: '基础设置' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/setting/config/config.module#ConfigModule'
          }
        ]
      },
      {
        path: 'event',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '个人事件' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/event/list/list.module#ListModule'
          },
          {
            path: 'examine',
            data: { title: '审核事件' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/event/examine/examine.module#ExamineModule'
          },
        ]
      },
      {
        path: 'customer',
        data: { title: '学员管理' },
        canLoad: [AuthGuardService],
        loadChildren: 'src/app/modules/customer/customer.module#CustomerModule'
      },
      {
        path: 'commodity',
        data: { noReuse: true },
        children: [
          {
            path: 'studentstatus',
            data: { title: '学籍项' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/commodity/student-status/student-status.module#StudentStatusModule'
          },
          {
            path: 'service',
            data: { title: '服务' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/commodity/service/service.module#ServiceModule'
          },
        ]
      },
      {
        path: 'analysis',
        data: { title: '数据管理' },
        canLoad: [AuthGuardService],
        loadChildren: 'src/app/modules/analysis/analysis.module#AnalysisModule'
      },
      {
        path: 'visit',
        data: { noReuse: true },
        children: [
          {
            path: 'clue',
            data: { title: '线索回访' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/visit/clue/clue.module#ClueModule'
          },
          {
            path: 'nocard',
            data: { title: '未办卡回访' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/visit/nocard/nocard.module#NocardModule'
          },
          {
            path: 'member',
            data: { title: '会员回访' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/visit/member/member.module#MemberModule'
          },
          {
            path: 'nointention',
            data: { title: '无意向客户' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/visit/nointention/nointention.module#NointentionModule'
          },
          {
            path: 'distribution',
            data: { title: '线索分配' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/visit/distribution/distribution.module#DistributionModule'
          }
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

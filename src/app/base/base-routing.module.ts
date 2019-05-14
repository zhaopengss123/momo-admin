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
        path: 'children',
        data: { title: '孩子管理' },
        loadChildren: 'src/app/modules/children/children.module#ChildrenModule'
      },
      {
        path: 'teacher',
        data: { title: '老师管理' },
        loadChildren: 'src/app/modules/teacher/teacher.module#TeacherModule'
      },
      {
        path: 'class',
        data: { title: '班级管理' },
        loadChildren: 'src/app/modules/class/class.module#ClassModule'
      },
      {
        path: 'reserve',
        data: { title: '预约管理' },
        loadChildren: 'src/app/modules/reserve/reserve.module#ReserveModule'
      },
      {
        path: 'setting',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '事件设置' },
            loadChildren: 'src/app/modules/setting/list/list.module#ListModule'
          },
          {
            path: 'notice',
            data: { title: '公告设置' },
            loadChildren: 'src/app/modules/setting/notice/notice.module#NoticeModule'
          },
        ]
      },
      {
        path: 'event',
        data: { noReuse: true },
        children: [
          {
            path: 'list',
            data: { title: '个人事件' },
            loadChildren: 'src/app/modules/event/list/list.module#ListModule'
          },
          {
            path: 'examine',
            data: { title: '审核事件' },
            loadChildren: 'src/app/modules/event/examine/examine.module#ExamineModule'
          },
        ]
      },
      {
        path: 'monitor',
        data: { title: '监控管理' },
        loadChildren: 'src/app/modules/monitor/monitor.module#MonitorModule'
      },
      {
        path: 'analysis',
        data: { title: '数据管理' },
        loadChildren: 'src/app/modules/analysis/analysis.module#AnalysisModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }

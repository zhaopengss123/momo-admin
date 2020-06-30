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
        data: { title: '员工管理' },
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
        path: 'nutrition',
        data: { noReuse: true },
        children: [
          {
            path: 'catering',
            data: { title: '膳食配餐' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/nutrition/catering/catering.module#CateringModule'
          }
        ]
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
            path: 'payment',
            data: { noReuse: true },
            children: [
              {
                path: 'pay',
                data: { title: '在线充值' },
                canLoad: [ AuthGuardService ],
                loadChildren: 'src/app/modules/setting/payment/pay/pay.module#PayModule'
              },
              {
                path: 'record',
                data: { title: '充值记录' },
                canLoad: [AuthGuardService],
                loadChildren: 'src/app/modules/setting/payment/record/record.module#RecordModule'
              }
            ]
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
          },
          {
            path: 'class',
            data: { title: '班级管理' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/class/class.module#ClassModule'
          },
          {
            path: 'teacher',
            data: { title: '员工管理' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/teacher/teacher.module#TeacherModule'
          }
        ]
      },
      {
        path: 'message',
        data: { noReuse: true },
        children: [
          {
            path: 'sendout',
            data: { title: '短信发送' },
            canLoad: [ AuthGuardService ],
            loadChildren: 'src/app/modules/message/sendout/sendout.module#SendoutModule'
          },
          {
            path: 'template',
            data: { title: '模板配置' },
            canLoad: [ AuthGuardService ],
            loadChildren: 'src/app/modules/message/template/template.module#TemplateModule'
          },
          {
            path: 'sendlog',
            data: { title: '发送日志' },
            canLoad: [ AuthGuardService ],
            loadChildren: 'src/app/modules/message/sendlog/sendlog.module#SendlogModule'
          },
        ]
      },
      {
        path: 'event',
        data: { noReuse: true },
        children: [
          {
            path: 'examine',
            data: { title: '审核事件' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/event/examine/examine.module#ExamineModule'
          },
          {
            path: 'list',
            data: { title: '个人事件' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/event/list/list.module#ListModule'
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
            path: 'card',
            data: { title: '卡项' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/commodity/card/card.module#CardModule'
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
        data: { noReuse: true },
        children: [
          {
            path: 'management',
            data: { title: '收入/退款分析' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/management/management.module#ManagementModule'          },
          {
            path: 'list',
            data: { title: '全部学位' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/analysis/all/all.module#AllModule'
          },
          {
            path: 'class',
            data: { title: '班级学位' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/analysis/class/class.module#ClassModule'
          },
          {
            path: 'teacher',
            data: { title: '老师服务' },
            canLoad: [AuthGuardService],
            loadChildren: 'src/app/modules/analysis/teacher/teacher.module#TeacherModule'
          },
        ]
      },
      {
        path: 'management',
        data: { title: '经营分析' },
        canLoad: [AuthGuardService],
        loadChildren: 'src/app/modules/management/management.module#ManagementModule'
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }

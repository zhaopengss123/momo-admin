export const MenuConfig = [
  {
    title : '首页',
    brief : '首页',
    key   : '/home/index',
    icon  : 'home',
    disabled: true,
    isLeaf: true
  },
  // {
  //   title : '预约管理',
  //   brief : '预约',
  //   key   : '/home/reserve',
  //   icon  : 'desktop',
  //   isLeaf: true
  // },
  // {
  //   title : '学员管理',
  //   brief : '学员',
  //   key   : '/home/customer',
  //   icon  : 'user',
  //   isLeaf: true
  // },

  {
    title : '广告管理',
    brief : '广告',
    key   : '/home/visit',
    icon  : 'customer-service',
    children : [
      {
        title : '广告列表',
        key   : '/home/visit/today',
        isLeaf: true
      }

    ]
  },
  {
    title : '道具管理',
    brief : '道具',
    key   : '/home/prop',
    icon  : 'customer-service',
    children : [
      {
        title : '道具列表',
        key   : '/home/prop/list',
        isLeaf: true
      }
    ]
  },
  {
    title : '用户',
    brief : '用户',
    key   : '/home/member',
    icon  : 'customer-service',
    children : [
      {
        title : '用户列表',
        key   : '/home/member/list',
        isLeaf: true
      }
    ]
  },
  {
    title : '已发布列表',
    brief : '发布',
    key   : '/home/published',
    icon  : 'customer-service',
    children : [
      {
        title : '已发布列表',
        key   : '/home/published/list',
        isLeaf: true
      }
    ]
  },
  {
    title : '订单列表',
    brief : '订单',
    key   : '/home/order',
    icon  : 'customer-service',
    children : [
      {
        title : '订单列表',
        key   : '/home/order/list',
        isLeaf: true
      }
    ]
  },
  {
    title : '交易记录',
    brief : '交易',
    key   : '/home/business',
    icon  : 'customer-service',
    children : [
      {
        title : '交易记录',
        key   : '/home/business/list',
        isLeaf: true
      }
    ]
  },
  {
    title : '短信记录',
    brief : '短信',
    key   : '/home/sms',
    icon  : 'customer-service',
    children : [
      {
        title : '短信记录',
        key   : '/home/sms/list',
        isLeaf: true
      }
    ]
  },
  {
    title : '事件管理',
    brief : '事件',
    key   : '/home/event',
    icon  : 'appstore',
    children : [
      {
        title : '审核事件',
        key   : '/home/event/examine',
        isLeaf: true
      },
      {
        title : '个人事件',
        key   : '/home/event/list',
        isLeaf: true
      }
    ]
  }, 
  {
    title : '短信管理',
    brief : '短信',
    key   : '/home/message',
    icon  : 'message',
    children : [
      {
        title : '发送短信', 
        key   : '/home/message/sendout',
        isLeaf: true
      },
      {
        title : '短信模板',
        key   : '/home/message/template',
        isLeaf: true
      },
      {
        title : '发送记录',
        key   : '/home/message/sendlog',
        isLeaf: true
      }
    ]
  },        
  {
    title : '教务管理',
    brief : '教务',
    key   : '/home/education',
    icon  : 'book',
    children : [
      {
        title : '课程教案',
        key   : '/home/education/plan',
        isLeaf: true
      },
      {
        title : '班级课表',
        key   : '/home/education/timetable',
        isLeaf: true
      },
      {
        title : '日程安排',
        key   : '/home/education/schedule',
        isLeaf: true
      },
      {
        title : '课程管理',
        key   : '/home/education/curriculum',
        isLeaf: true
      }
    ]
  },
  {
    title : '营养保健',
    brief : '营养',
    key   : '/home/nutrition',
    icon  : 'schedule',
    children : [
      {
        title : '膳食配餐',
        key   : '/home/nutrition/catering',
        isLeaf: true
      }
    ]
  },
  // {
  //   title : '员工管理',
  //   brief : '员工',
  //   key   : '/home/teacher',
  //   icon  : 'team',
  //   isLeaf: true
  // },
  // {
  //   title : '班级管理',
  //   brief : '班级',
  //   key   : '/home/class',
  //   icon  : 'solution',
  //   isLeaf: true
  // },
  // {
  //   title : '预约坑位占用统计',
  //   brief : '数据',
  //   key   : '/home/analysis',
  //   icon  : 'database',
  //   isLeaf: true
  // },

  {
    title : '数据中心',
    brief : '数据',
    key   : '/home/analysis',
    icon  : 'database',
    children : [
      {
        title : '收入/退款',
        key   : '/home/analysis/management',
        isLeaf: true
      },
      {
        title : '全部学位',
        key   : '/home/analysis/list',
        isLeaf: true
      },
      {
        title : '班级学位',
        key   : '/home/analysis/class',
        isLeaf: true
      },
      {
        title : '老师服务',
        key   : '/home/analysis/teacher',
        isLeaf: true
      }
    ]
  },
  // {
  //   title : '经营分析',
  //   brief : '经营',
  //   key   : '/home/management',
  //   icon  : 'line-chart',
  //   isLeaf: true
  // },
  {
    title : '商品管理',
    brief : '商品',
    key   : '/home/commodity',
    icon  : 'shopping',
    children : [
      {
        title : '卡项',
        key   : '/home/commodity/card',
        isLeaf: true
      },
      {
        title : '服务',
        key   : '/home/commodity/service',
        isLeaf: true
      }
    ]
  },
  {
    title : '设置',
    brief : '设置',
    key   : '/home/setting',
    icon  : 'setting',
    children : [
      {
        title : '基础设置',
        key   : '/home/setting/config',
        isLeaf: true
      },
      {
        title : '角色设置',
        key   : '/home/setting/role',
        isLeaf: true
      },
      {
        title : '账号管理',
        key   : '/home/setting/account',
        isLeaf: true
      },
      {
        title : '员工管理',
        key   : '/home/setting/teacher',
        isLeaf: true
      },
      {
        title : '班级管理',
        key   : '/home/setting/class',
        isLeaf: true
      },
      // {
      //   title : '在线充值',
      //   key   : '/home/setting/payment/pay',
      //   isLeaf: true
      // },
      // {
      //   title : '充值记录',
      //   key   : '/home/setting/payment/record',
      //   isLeaf: true
      // },
      {
        title : '公告设置',
        key   : '/home/setting/notice',
        isLeaf: true
      },
      {
        title : '监控管理',
        key   : '/home/setting/monitor',
        isLeaf: true
      },
      {
        title : '事件设置',
        key   : '/home/setting/list',
        isLeaf: true
      },
 
   

  
  
    ]
  },
];
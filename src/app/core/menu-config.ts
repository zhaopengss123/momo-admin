export const MenuConfig = [
  {
    title : '首页',
    brief : '首页',
    key   : '/home/index',
    icon  : 'home',
    disabled: true,
    isLeaf: true
  },
  {
    title : '孩子管理',
    brief : '孩子',
    key   : '/home/children',
    icon  : 'team',
    isLeaf: true
  },
  {
    title : '老师管理',
    brief : '老师',
    key   : '/home/teacher',
    icon  : 'user',
    isLeaf: true
  },
  {
    title : '班级管理',
    brief : '班级',
    key   : '/home/class',
    icon  : 'solution',
    isLeaf: true
  },
  {
    title : '设置',
    brief : '设置',
    key   : '/home/setting',
    icon  : 'setting',
    children : [
      {
        title : '事件设置',
        key   : '/home/setting/list',
        isLeaf: true
      },
      {
        title : '公告设置',
        key   : '/home/setting/notice',
        isLeaf: true
      },
    ]
  },
  {
    title : '事件管理',
    brief : '事件',
    key   : '/home/event',
    icon  : 'appstore',
    children : [
      {
        title : '个人事件',
        key   : '/home/event/list',
        isLeaf: true
      },
      {
        title : '审核事件',
        key   : '/home/event/examine',
        isLeaf: true
      }
    ]
  },
  {
    title : '监控管理',
    brief : '监控',
    key   : '/home/monitor',
    icon  : 'desktop',
    isLeaf: true
  },
  {
    title : '商品管理',
    brief : '商品',
    key   : '/home/commodity',
    icon  : 'shopping',
    children : [
      {
        title : '学籍项',
        key   : '/home/commodity/StudentStatus',
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
    title : '客户管理',
    brief : '客户',
    key   : '/home/customer',
    icon  : 'user',
    isLeaf: true
  },
  {
    title : '预约管理',
    brief : '预约',
    key   : '/home/reserve',
    icon  : 'desktop',
    isLeaf: true
  },
  {
    title : '预约坑位占用统计',
    brief : '数据',
    key   : '/home/analysis',
    icon  : 'desktop',
    isLeaf: true
  },
  {
    title : '回访管理',
    brief : '回访',
    key   : '/home/visit',
    icon  : 'customer-service',
    children : [
      {
        title : '线索回访',
        key   : '/home/visit/clue',
        isLeaf: true
      },
      {
        title : '未办卡回访',
        key   : '/home/visit/nocard',
        isLeaf: true
      },
      {
        title : '会员回访',
        key   : '/home/visit/member',
        isLeaf: true
      },
      {
        title : '线索分配',
        key   : '/home/visit/distribution',
        isLeaf: true
      }
    ]
  },
];
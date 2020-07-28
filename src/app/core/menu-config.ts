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
    icon  : 'desktop',
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
    icon  : 'user',
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
    icon  : 'schedule',
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
    icon  : 'book',
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
    icon  : 'appstore',
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
    icon  : 'message',
    children : [
      {
        title : '短信记录',
        key   : '/home/sms/list',
        isLeaf: true
      }
    ]
  },
  {
    title : '退款记录',
    brief : '退款',
    key   : '/home/refund',
    icon  : 'message',
    children : [
      {
        title : '退款记录',
        key   : '/home/refund/list',
        isLeaf: true
      }
    ]
  }
];
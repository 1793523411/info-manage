export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/avator',
      },
      {
        path: '/admin/avator',
        name: '头像管理',
        icon: 'smile',
        component: './Admin/components/AvatorManage',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: '创作中心',
    icon: 'table',
    path: '/create',

    routes: [
      {
        path: '/create',
        icon: 'table',
        component: './Create',
      },
      {
        path: '/create/editor-video/:rid',
        icon: 'table',
        component: './Create/VideoEditor',
      },
      {
        path: '/create/editor-video',
        icon: 'table',
        component: './Create/VideoEditor',
      },
      {
        path: '/create/editor-list',
        name: '视频列表',
        icon: 'table',
        component: './Create/VideoList',
      },
      {
        path: '/create/topic-editor/:rid',
        icon: 'table',
        component: './Create/TopicEditor',
      },
      {
        path: '/create/topic-editor',
        icon: 'table',
        component: './Create/TopicEditor',
      },
      {
        path: '/create/topic-list',
        name: '文章列表',
        icon: 'table',
        component: './Create/TopicList',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '用户信息',
    icon: 'user',
    path: '/user-info',
    routes: [
      {
        path: '/user-info',
        icon: 'user',
        component: './UserInfo',
      },
      {
        path: '/user-info/center',
        name: '个人中心',
        icon: 'user',
        component: './UserInfo',
      },
      {
        path: '/user-info/editor',
        name: '编辑信息',
        icon: 'user',
        component: './UserInfo/components/EditorInfo',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/user-info',
  },
  {
    component: './404',
  },
];

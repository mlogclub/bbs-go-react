import { DashboardOutlined } from '@ant-design/icons';
import Loader from './loader';

// TODO: 多维无限嵌套， 按照目录分离单个文件
// type RoutesItem<K extends string> = {
//   [k in K]: RoutesItem<K>[];
// };

// type Flatten<K extends string, T extends RoutesItem<K>> = T[];

// function flatten<K extends string, T extends RoutesItem<K>>(data: T[], k: K & keyof T): Flatten<K, T>;

// 菜单Item
export type RouteItem = {
  name: string;
  path?: string;
  key?: string;
  auth?: boolean;
  hideInMenu?: boolean; // 是否显示在菜单， 默认flase
  icon?: any;
  routes?: RouteItem[];
  exact?: boolean;
  component?: React.ComponentType;
  redirect?: string;
};

// 不需要权限
const noAuthMenus: RouteItem[] = [
  {
    name: '登录页',
    exact: true,
    path: '/login',
    component: Loader(() => import('@/pages/login')),
  },
  {
    name: 'github-登录页',
    exact: true,
    path: '/login/github',
    component: Loader(() => import('@/pages/login/third/github')),
  },
  {
    name: '注册页',
    exact: true,
    path: '/register',
    component: Loader(() => import('@/pages/login')),
  },
  {
    name: '测试页',
    exact: true,
    path: '/test',
    component: Loader(() => import('@/pages/test')),
  },
  {
    name: 'playground',
    path: '/playground',
    icon: DashboardOutlined,
    component: Loader(() => import('@/pages/playground')),
  },
];

// 需要权限
const authRoutes: RouteItem[] = [
  {
    name: '首页',
    path: '/',
    hideInMenu: true,
    component: Loader(() => import('@/pages')),
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: DashboardOutlined,
    component: Loader(() => import('@/pages/dashboard')),
  },

  {
    key: 'content',
    name: '内容管理',
    // path: '/content',
    icon: DashboardOutlined,
    routes: [
      {
        key: 'content/aritlce',
        name: '文章',
        path: '/content/article',
        component: Loader(() => import('@/pages/content/article')),
      },
      {
        key: 'content/aritlce/detail',
        name: '文章详情页',
        path: '/content/article/:id',
        hideInMenu: true,
        component: Loader(() => import('@/pages/content/articleDetail')),
      },
      {
        key: 'content/topic',
        name: '话题',
        path: '/content/topic',
        component: Loader(() => import('@/pages/content/topic')),
      },
      {
        key: 'content/tag',
        name: '标签',
        path: '/content/tag',
        component: Loader(() => import('@/pages/content/tag')),
      },
      {
        key: 'content/node',
        name: '节点',
        path: '/content/node',
        component: Loader(() => import('@/pages/content/topicNode')),
      },
      {
        key: 'content/comment',
        name: '评论',
        path: '/content/comment',
        component: Loader(() => import('@/pages/content/comment')),
      },
    ],
  },
  {
    key: 'authmanage',
    name: '人员管理',
    // path: '/authmanage',
    redirect: '/authmanage/user',
    routes: [
      {
        key: 'authmanage/user',
        name: '用户',
        path: '/authmanage/user',
        component: Loader(() => import('@/pages/authManage/user/list')),
      },
      {
        key: 'authmanage/detail',
        name: '用户详情',
        hideInMenu: true,
        path: '/authmanage/user/detail/:id',
        component: Loader(() => import('@/pages/authManage/user/detail')),
      },
      {
        key: 'authmanage/user/post',
        name: '添加用户',
        hideInMenu: true,
        path: '/authmanage/user/post',
        component: Loader(() => import('@/pages/authManage/user/post')),
      },
      {
        key: 'authmanage/user/edit',
        name: '编辑用户',
        hideInMenu: true,
        path: '/authmanage/user/post/:id',
        component: Loader(() => import('@/pages/authManage/user/post')),
      },
      {
        key: 'authmanage/role',
        name: '角色',
        hideInMenu: true,
        path: '/authmanage/role',
        component: Loader(() => import('@/pages/user')),
      },
      {
        key: 'authmanage/thirdAccount',
        name: '第三方账号',
        hideInMenu: true,
        path: '/authmanage/third-account',
        component: Loader(() => import('@/pages/authManage/thirdAccount/list')),
      },
      {
        key: 'authmanage/userScore',
        name: '积分管理',
        path: '/authmanage/user-score',
        component: Loader(() => import('@/pages/authManage/user/score')),
      },
    ],
  },
  {
    key: 'siteConfig',
    name: '网站配置',
    icon: DashboardOutlined,
    redirect: '/site/config',
    routes: [
      {
        key: 'siteConfig/index',
        name: '网站配置',
        path: '/site/config',
        component: Loader(() => import('@/pages/system/siteConfig')),
      },
      // {
      //   key: 'siteConfig/all',
      //   name: '所有配置',
      //   path: '/site/config/all',
      //   hideInMenu: true,
      //   component: Loader(() => import('@/pages/system/siteConfig/list')),
      // },
      {
        key: 'siteConfig/config/common',
        name: '通用',
        path: '/site/config/common',
        hideInMenu: true,
        component: Loader(() => import('@/pages/system/siteConfig/common')),
      },
      {
        key: 'siteConfig/config/publish',
        name: '发帖',
        path: '/site/config/publish',
        hideInMenu: true,
        component: Loader(() => import('@/pages/system/siteConfig/publish')),
      },
      {
        key: 'siteConfig/config/score',
        name: '积分',
        path: '/site/config/score',
        hideInMenu: true,
        component: Loader(() => import('@/pages/system/siteConfig/score')),
      },
      {
        key: 'siteConfig/nav',
        name: '导航菜单',
        path: '/site/config/nav',
        hideInMenu: true,
        component: Loader(() => import('@/pages/system/siteConfig/topNav')),
      },
      {
        key: 'siteConfig/friendlink',
        name: '友链',
        path: '/site/friendlink',
        component: Loader(() => import('@/pages/system/friendLink')),
      },
    ],
  },
  {
    key: 'systemSetting',
    name: '系统',
    icon: DashboardOutlined,
    routes: [
      {
        key: 'systemSetting/operatelog',
        name: '日志',
        path: '/system/setting/log',
        component: Loader(() => import('@/pages/system/setting/log')),
      },
    ],
  },
];

export default noAuthMenus;

export { authRoutes };

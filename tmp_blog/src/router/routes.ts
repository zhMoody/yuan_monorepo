import BasicLayout from '@/layouts/BasicLayout/index.vue';
import {RouteRecordRaw} from 'vue-router';

// 主框架内显示的路由
export const frameIn: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          keepAlive: true,
          transition: 'animate__fadeIn'
        },
      },
      {
        path: "/article/:id",
        name: "article",
        component: () => import( "@/components/article/index.vue"),
        meta: {
          title: '正文',
          keepAlive: true,
          transition: 'animate__fadeIn'
        },
      },
      {
        path: '/cross',
        name: 'cross',
        component: () => import('@/views/cross/index.vue'),
        meta: {
          title: '归档',
          keepAlive: true,
          transition: 'animate__fadeIn'
        },
      },
      {
        path: '/acg',
        name: 'acg',
        component: () => import('@/views/Acg/index.vue'),
        meta: {
          title: 'test',
          keepAlive: true,
          transition: 'animate__fadeIn'
        },
      },
      {
        path: '/categroy',
        name: 'categroy',
        component: () => import('@/components/categroy/index.vue'),
        meta: {
          title: '分类',
          keepAlive: true,
          transition: 'animate__fadeIn'
        },
      },
    ],
  },
];

// 主框架外显示的路由
const frameOut = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/index.vue'),
    meta: {
      title: '登录验证',
      transition: 'animate__fadeIn'
    },
  },
  {
    path: '/backStageManagement',
    name: 'backStageManagement',
    component: () => import('@/views/sys/backStageManagement/index.vue'),
    meta: {
      title: '后台管理',
      transition: 'animate__fadeIn'
    },
    children: [
      {
        path: '/backStageManagement',
        name: 'monitor',
        component: () => import('@/views/sys/backStageManagement/components/monitor/monitor.vue'),
        meta: {
          title: '仪表盘',
          transition: 'animate__fadeIn'
        },
      },
      {
        path: '/addArticle',
        name: 'addArticle',
        component: () => import('@/views/sys/backStageManagement/components/addArticle/addArticle.vue'),
        meta: {
          title: '撰写文章',
          transition: 'animate__fadeIn'
        },
      },
      {
        path: '/articleManagement',
        name: 'articleManagement',
        component: () => import('@/views/sys/backStageManagement/components/articleManagement/articleManagement.vue'),
        meta: {
          title: '文章管理',
          transition: 'animate__fadeIn'
        },
      },
      {
        path: '/categroyManagement',
        name: 'categroyManagement',
        component: () => import('@/views/sys/backStageManagement/components/categroyManagement/index.vue'),
        meta: {
          title: '分类管理',
          transition: 'animate__fadeIn'
        },
      },
      {
        path: '/infoConfig',
        name: 'infoConfig',
        component: () => import('@/views/sys/backStageManagement/components/infoConfig/index.vue'),
        meta: {
          title: '个人配置',
          transition: 'animate__fadeIn'
        },
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/sys/login/index.vue'),
    meta: {
      title: '登录',
      transition: 'animate__fadeIn'
    },
  },
];

const errorPage = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/sys/error/404.vue'),
    meta: {
      title: '404',
      keepAlive: false,
      transition: 'animate__fadeIn'
    },
  },
];

export default [
  ...frameIn,
  ...frameOut,
  ...errorPage,
];

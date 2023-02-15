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
          keepAlive: false,
          transition: 'animate__fadeIn'
        },
      },
      {
        path: "/article/:id",
        name: "article",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "article" */ "@/components/article/index.vue"),
        meta: {
          title: '正文',
          keepAlive: false,
          transition: 'animate__fadeIn'
        },
      },
      {
        path: '/acg',
        name: 'acg',
        component: () => import('@/views/Acg/index.vue'),
        meta: {
          title: 'test',
          keepAlive: false,
          transition: 'animate__fadeIn'
        },
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test.vue'),
        meta: {
          title: 'test',
          keepAlive: false,
          transition: 'animate__fadeIn'
        },
      },
    ],
  },
];

// 主框架外显示的路由
const frameOut = [
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

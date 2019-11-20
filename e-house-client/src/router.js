import Vue from "vue";
import Router from "vue-router";
// import Layout from "./views/Layout";
import store from './store'

const components = {
  Login: () => import('@/views/Login'),
  Layout: () => import('@/views/Layout'),
  Home: () => import('@/views/Home'),
  Admin: () => import('@/views/Admin'),
  addAdmine: () => import('@/views/Admin/addAdmine'),
  resetPassword: () => import('@/views/Admin/resetPassword'),
  PostList: () => import('@/views/Interactive/PostList.vue'),
  AddPostList:() => import ('@/views/Interactive/AddPostList.vue'),
  Swiper: () => import('@/views/Swiper'),
  addSwiper: () => import('@/views/Swiper/addSwiper'),
  addComments: () => import('@/views/Comments/AddComments'),
  commentsList: () => import('@/views/Comments/CommentsList'),
  News: () => import('@/views/News'),
  addNews: () => import('@/views/News/addNews'),
};

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: "/login",
  },{
    path: "/login",
    name: "login",
    meta: { title: '登录页' },
    component: components.Login,
  }, {
    path: '/layout',
    redirect: '/layout/home',
    component: components.Layout,
    children: [
      {
        path: 'home',
        name: 'home',
        meta: { title: '首页' },
        component: components.Home
      },{
        path: 'admin',
        name: 'admin',
        meta: { title: '管理员列表' },
        component: components.Admin
      }
      ,{
        path: 'addAdmine',
        name: 'addAdmine',
        meta: { title: '添加用户' },
        component: components.addAdmine
      },
      {
        path: 'editAdmine',
        name: 'editAdmine',
        meta: { title: '编辑用户' },
        component: components.addAdmine
      },
      {
        path: 'resetPassword',
        name: 'resetPassword',
        meta: { title: '修改密码' },
        component: components.resetPassword
      },
      {
        path: 'postList',
        name: 'postList',
        meta: {title: '帖子列表'},
        component: components.PostList
      },
      {
        path: 'addPostList',
        name: 'addPostList',
        meta: {title: '增加帖子'},
        component: components.AddPostList
      },
      {
        path: 'addComments',
        name: 'addComments',
        meta: {title: '发起评议'},
        component: components.addComments
      },
      {
        path: 'commentsList',
        name: 'commentsList',
        meta: {title: '评议列表'},
        component: components.commentsList
      },
      {
        path: 'editComments',
        name: 'editComments',
        meta: { title: '编辑评议' },
        component: components.addComments
      },
      {
        path: 'news',
        name: 'news',
        meta: { title: '新闻列表' },
        component: components.News
      }
      ,{
        path: 'addNews',
        name: 'addNews',
        meta: { title: '添加新闻' },
        component: components.addNews
      }
      ,{
        path: 'editNews',
        name: 'editNews',
        meta: { title: '编辑新闻' },
        component: components.addNews
      }
      ,{
        path: 'swiper',
        name: 'swiper',
        meta: { title: '轮播图' },
        component: components.Swiper
      },{
        path: 'addSwiper',
        name: 'addSwiper',
        meta: { title: '添加轮播图' },
        component: components.addSwiper
      },{
        path: 'editSwiper',
        name: 'editSwiper',
        meta: { title: '编辑轮播图' },
        component: components.addSwiper
      }
    ]
  }]
});

router.beforeEach((to, from, next) => {
  // 修改标题
  // if (to.meta.title) {
  //   document.title = to.meta.title
  // } else {
  //   document.title = '未定义标题'
  // }

  // 登陆拦截
  // if (to.meta.requireAuth) {
  //   // 判断对象是否为空
  //   // obj = {}
  //   // 一、JSON.stringify(obj) === '{}'
  //   // 二、Object.keys(obj) // []
  //   //     Object.keys(obj).length === 0
  //   if (JSON.stringify(store.state.userInfo) === '{}') {
  //     next({
  //       path: '/login',
  //       // 将跳转的路由path作为参数，登录成功后跳转至改路由
  //       query: {
  //         redirect: to.fullPath
  //       }
  //     })
  //   } else {
  //     next()
  //   }
  // } else {
  //   next()
  // }
  next()
})

export default router

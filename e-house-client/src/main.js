import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './plugins/element.js'
// import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css' //样式的初始化
// import axios from "axios";
import $axios from './axios'; // 全局实例挂载
Vue.prototype.$axios = $axios;


import Cookie from 'cookie.js'; // cookie.js
import"./unitls/filter";

// 引入富文本编辑器以及样式文件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'  // require styles
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);  /* { default global options } */

Vue.config.productionTip = false;

//Expecto Patronum呼神守卫 注册呼神守卫
router.beforeEach((to, from, next) => {
    let token = Cookie.get("mytoken");
    if(token) {
        next();
    } else {
        if(to.path !== "/login") { // 没有登录，它想访问其它页面，让它到达登录页面
            next({path: "/login"});
        } else { // 没有登录，但是人家去访问Login，则放行
            next();
        }
    }
});

/* eslint-disable no-new */

// 绑定滚动事件
Vue.directive('loadmore', {
  // bind(el, binding) {
  //   const selectWrap = el.querySelector('.el-table__body-wrapper')
  //   selectWrap.addEventListener('scroll', function() {
  //     let sign = 100
  //     const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
  //     if (scrollDistance <= sign) {
  //       binding.value()
  //     }
  //   })
  // }

  bind(el, binding) {
    var p = 0;
    var t = 0;
    var down = true;
    var selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function () {
      //判断是否向下滚动
      p = this.scrollTop;
      // if ( t < p){down=true}else{down=false}
      if (t < p) {
        down = true;
      } else {
        down = false;
      }
      t = p;
      //判断是否到底
      const sign = 5;
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign && down) {
        binding.value()
      }
    })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

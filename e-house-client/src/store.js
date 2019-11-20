import Vue from "vue";
import Vuex from "vuex";
import createPersistedState  from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    userId: "", // 此处存储的userId是数据库中的_id
  },
  mutations: {
    CHANGE_USERINFO(state,userInfo){
      state.userInfo = userInfo
    },
    DELETE_USERINFO(state){
      state.userInfo = {}
    },
    KEEP_USERID(state, userId) {
      state.userId = userId;
    },
    REMOVE_USERID(state) {
      state.userId = ""
    }
  },
  actions: {},
  plugins: [createPersistedState({
    storage: {
      getItem: key => sessionStorage.getItem (key),
      setItem: (key, value) =>
      sessionStorage.setItem(key, value,),
      removeItem: key => sessionStorage.removeItem(key),
    },
  })],
});

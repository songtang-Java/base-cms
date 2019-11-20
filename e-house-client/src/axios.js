import axios from 'axios';
// import Vue from 'vue'
import { Message, MessageBox} from 'element-ui'
// 对发送的数据格式进行转码
import qs from 'qs';    // qs.stringify()将对象 序列化成URL的形式，以&进行拼接。
import router from "./router";
import Cookie from "cookie.js";

const env = process.env.NODE_ENV; // 判断是生产环境还是开发环境
let baseURL = env === 'development' ? '/api' : 'http://139.129.90.18:3000';

const instance = axios.create({
    baseURL,
    timeout: 10000,
});

// http request 拦截器
instance.interceptors.request.use(
    // 在发送之前
    config => {
        config.headers.authorization =  Cookie.get("mytoken");// 判断是否存在token，如果存在的话，则每个http header都加上token
        return config;
    },
    error => {
        Promise.reject(error)
    }
)

// http response 拦截器
instance.interceptors.response.use(
    // 相应数据
    response => {
        const res = response.data;
        if(res.code === 403){
            MessageBox.confirm(
                "登陆状态已失效，请重新登陆！",
                "提示",
                { onfirmButtonText: '重新登录', type: "info", center: true, showClose: false, showCancelButton: false}
            ).then(() => {
            // console.log(res); //confirm
                router.push('/login')
            })
            // .catch(() => {
            // console.log(err); //cancel
                // return Promise.reject('response 拦截器：error')
            // })
        }else{
            return response
        }
    },
    // 错误
    error => {
        Message({
            message: "response 拦截器2333："+error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

const xhr = {
    get(url, data, config){
        return new Promise((resolve, reject) => {
            instance.get(url, {params: data, ...config}).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    fatch(url, data, config, methods){
        return new Promise((resolve, reject) => {
            instance[methods](url, data, config).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    post(url, data, config){
        // 将data转换成application/x-www-form-urlencoded格式
        let datastr = qs.stringify(data)
        return this.fatch(url, datastr, config, 'post')
    },
    // DELETE方法不能用body传值
    del(url, data, config){
        return this.fatch(url, data, config, 'delete')
    },
    patch(url, data, config){
        return this.fatch(url, data, config, 'patch')
    },
};

// 在此页面直接挂载，错误：TypeError找不到post方法
// Vue.prototype.$axios = xhr
export default xhr


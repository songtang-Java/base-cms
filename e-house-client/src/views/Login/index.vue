<template>
  <div class="login">
    <div class="login-wrap">
      <el-form ref="form" :rules="rules" :model="form" status-icon class="form-wrap">
        <!-- required prop="账号" 账号 is required -->
        <h2 class="title">后台管理系统</h2>
        <el-form-item  prop="username" status-icon>
          <el-input v-model="form.username" placeholder='请输入账号'></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type='password' placeholder='请输入密码'></el-input>
        </el-form-item>
<!--        <el-form-item prop="captcha">-->
<!--          <el-input v-model="form.captcha" class="svg-input" placeholder='请输入验证码'></el-input>-->
<!--          <img src="http://139.129.90.18:3000/captcha" ref="captcha" alt="" style="float: right" @click="getCaptcha">-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Cookie from 'cookie.js';
export default {
  name: "login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        captcha: ""
      },
      svgCaptcha: "",
      textCaptcha: "",
      rules: {
        username: [
          // 限制用户输入的账号以及密码的格式和长度，trigger: "blur"：在失去焦点时验证，trigger: 'change'：在每次改变时验证
          {min: 4, max: 11, message: "长度在 4 到 11 个字符", trigger: ["blur", "change"]},
          {pattern: /^[a-zA-Z0-9]{4,10}$/, message: "请输入正确格式", trigger: ["blur", "change"]}
        ],
        password: [
          {min: 4, max: 11, message: "长度在 4 到 11 个字符", trigger: ["blur", "change"]},
          {pattern: /^[a-zA-Z0-9]{4,10}$/, message: "请输入正确格式", trigger: ["blur", "change"]}
        ],
        captcha: [
          {min: 4, max: 4, message: "长度为4字符", trigger: ["blur", "change"]},
          {pattern: /^[a-zA-Z0-9]{4}$/, message: "请输入正确格式", trigger: ["blur", "change"]}
        ]
      }
    };
  },
  methods: {
    // 1. 提交登录
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$axios.post("/admine/login", this.form).then(res => {
            if (res.code === 200) {
              var millisecond = new Date().getTime();
              var expiresTime = new Date(millisecond + 60 * 1000 * 60);
              Cookie.set('mytoken', res.token, {
                expires: expiresTime,
              });
              this.$message({
                message: "成功登陆！",
                type: "success",
                duration: 500,
                center: true
              });
              this.$store.commit('CHANGE_USERINFO', res.data); // 将用户信息存储到Vuex中
              setTimeout(() => {
                this.$router.push("/layout");
              }, 500);
            } else {
              this.$message({
                message: res.msg,
                type: "error",
                duration: 1000,
                center: true
              });
            }
          });
        } else {
          this.$message({
            message: "账号或密码格式不正确！",
            type: "error",
            duration: 1000,
            center: true
          });
        }
      });
    },

    // 2. 获取验证码
    getCaptcha() {
        this.$refs.captcha.src = "http://139.129.90.18:3000/captcha?girl=" + Math.random()*1000;
    }
  },
  created() {
  }
}
</script>

<style scoped lang='scss'>
.login {
  height: 100vh;
  background: url("../../../public/images/dj-bg02.jpg")  no-repeat;
  background-size: cover;
  overflow: hidden;
  text-align: center;
  position: relative;
  h2 {
    margin: 10px auto 40px;
  }
}
.login-wrap {
  box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
  overflow: hidden;
  box-sizing: border-box;
  width: 400px;
  height: 300px;
  border: 1px solid skyblue;
  border-radius: 10px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  padding: 10px 40px;
  background-color:#35394a;
  opacity: 0.9;
  // position: absolute;
  // position: fixed;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%,-50%)
  .el-button {
    width: 100%;
  }
  .svg-input{
    width: 160px;
    float: left;
  }
  .title {

  }
}
</style>

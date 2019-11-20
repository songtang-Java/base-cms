<template>
    <div class="edit-wrap">
        <el-card class="card-wrap" shadow='never'>
            <div slot="header" class="header-card">修改密码</div>
            <el-form class="demo-ruleForm" status-icon size='mini' ref='form' :rules="rules" :model='formData' label-width="100px" label-position="left">
                <el-form-item label="旧密码：" prop='password'>
                    <el-input v-model="formData.password" type='password'></el-input>
                </el-form-item>
                <el-form-item label="新密码：" required prop='newPassword'>
                    <el-input v-model="formData.newPassword" type='password'></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" required prop='rNewPassword'>
                    <el-input v-model="formData.rNewPassword" type='password'></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetForm('form')">重置</el-button>
                    <el-button @click="CancelForm">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import {mapState} from "vuex";
export default {
  name: "resetPassword",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.rNewPassword !== "") {
          this.$refs.form.validateField("rNewPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        password: "",
        newPassword: "",
        rNewPassword: "",
        id: ""
      },
      rules: {
        password: [
          { required: true, message: "请输入旧密码！", trigger: "blur" },
          { pattern: /^[a-zA-Z0-9]{4,10}$/, message: "请输入正确格式", trigger: ["blur", "change"] }
        ],
          newPassword: [
          // { required: true, message: '请输入新密码！', trigger: 'blur'},
          { validator: validatePass, trigger: "blur" },
          { pattern: /^[a-zA-Z0-9]{4,10}$/, message: "请输入正确格式", trigger: ["blur", "change"] }
        ],
          rNewPassword: [
          // { required: true, message: '请再次输入密码！', trigger: 'blur'},
          { validator: validatePass2, trigger: "blur" },
          { pattern: /^[a-zA-Z0-9]{4,10}$/, message: "请输入正确格式", trigger: ["blur", "change"] }
        ]
      }
    };
  },
  computed: {
      ...mapState(["userId"]),
  },
  created() {
      this.getId();
  },
  methods: {
      resetForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post("/users/editPassword", this.formData)
            .then(res => {
                // console.log(this.formData);
                // console.log(res);
              if (res.code === 200) {
                this.$message({
                  message: "密码修改成功！！！",
                  type: "success",
                  center: true
                });
                setTimeout(() => { this.$router.push("/layout/admin"); }, 1000);
              } else {
                this.$message({
                  message: "密码修改失败。" + res.msg,
                  type: "error",
                  duration: 1000,
                  center: true
                });
              }
            })
            .catch(err => {
              this.$message({
                message: "网络链接错误！" + err,
                type: "error",
                duration: 1000,
                center: true
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
      CancelForm() {
      this.$message({
        message: "取消修改！！！",
        type: "info",
        duration: 1000,
        center: true
      });
      setTimeout(() => { this.$router.push("/layout/admin") }, 500);
    },
      getId() {
          // console.log(this.userId);
          this.formData.id = this.userId;
      }
  }
};
</script>

<style scoped>
.card-wrap {
  width: 600px;
}
.el-input--mini {
  width: 400px;
}
</style>

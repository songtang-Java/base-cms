<template>
    <el-upload
            class="avatar-uploader"
            action="https://upload-z1.qiniup.com"
            :data='formData'
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
import axios from 'axios';
export default {
  name: "uploadImg",
  props:{
      value:String
  },
  data() {
      return {
        imageUrl: this.value,
        formData: {
            token: ''
        }
      };
    },
    methods: {
      /**
      * 上传图片成功触发的方法，也即刚上传完以后就会显示图片，试想如果是编辑页面呢？我们要达到的效果就是刚进入编辑页面就能显示图片，
       * 但是显然如果不进行动态的监听，imgUrl就是空的，因为我们本意是想在上传组件拿到父组件传过来的avatar*/
      handleAvatarSuccess(res, file) {
          // console.log(res);
          this.imageUrl = res.url;
          this.$emit('input', this.imageUrl);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      getToken(){
          this.$axios.get('/getToken').then(res => {
              // console.log("......................");
              // console.log(res);
              if(res.code === 200){
                  this.formData.token = res.token;
                  // console.log(this.formData.token);
              }else{
                  this.$message({
                    message: 'getToken:' + res.data.msg,
                    type: "error",
                    duration: 1000,
                    center: true
                  });
              }
          }).catch(err => {
            this.$message({
                message: "网络链接错误！",
                type: "error",
                duration: 1000,
                center: true
            });
          })
      },
    },
    created() {
        this.getToken();
    },
    //watch很重要。data（）函数只是在初始化的时候会运行一次。所以总是空。而我们异步过来的数据，需要watch他 才能得到
    watch:{
        value(val){
            // console.log(val);
            this.imageUrl = val;
            console.log(this.value);
            console.log(this.imageUrl);
        }
    }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

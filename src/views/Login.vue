<template>
  <div id="login">
    <section class="form-wrap">
      <div class="img">
        <img src="../assets/left.png">
      </div>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="60px"
      >
        <h1 class="title">用户登录</h1>
        <el-form-item prop="phone">
          <span slot="label"> <img
              class="icon"
              src="../assets/phone.png"
              alt=""
            ></span>
          <el-input
            v-model="form.phone"
            placeholder="请输入账号"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <span slot="label"> <img
              class="icon"
              src="../assets/password.png"
              alt=""
            ></span>
          <el-input
            type="password"
            @keyup.enter.native="login('form')"
            v-model="form.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          @click="login('form')"
          v-loading.fullscreen.lock="fullscreenLoading"
          element-loading-text="登录中"
        >登录</el-button>
        <!-- <router-link to="/forgetPassword" class="forget">忘记密码？</router-link> -->
      </el-form>
    </section>

  </div>
</template>
<script>
import API from '../api/api'
import { mapActions } from 'vuex'
import { Base64 } from 'js-base64'
export default {
  data() {
    return {
      fullscreenLoading: false,
      form: {
        phone: '15116486236',
        password: '486236'
      },
      rules: {
        phone: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.removeAdminInfo()
  },
  methods: {
    ...mapActions(['removeAdminInfo', 'saveAdminInfo']),
    // 登录
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {}
          // 手机号正则
          let regPhone = new RegExp('^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$')
          // 邮箱正则
          let regEmail = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$')
          if (regPhone.test(this.form.phone)) {
            data = {
              phone: this.form.phone,
              password: this.form.password
            }
          } else if (regEmail.test(this.form.phone)) {
            data = {
              email: this.form.phone,
              password: this.form.password
            }
          } else {
            data = this.form
          }
          this.fullscreenLoading = true
          this.axios.post(API.USER_LOGIN, data).then(res => {
            let adminInfo = res.data.data
            sessionStorage.setItem('adminInfo', Base64.encode(JSON.stringify(adminInfo)))
            this.saveAdminInfo()
            this.$router.push('/home')
            this.fullscreenLoading = false
            this.form = {
              phone: '',
              password: ''
            }
          }).catch(() => { this.fullscreenLoading = false })
        } else {
          return false
        }
      })
    }
  },
  mounted() {
    // `dev
    if (this.$store.state.dev) {
      this.login('form')    }
  }
}
</script>
<style lang="scss">
@mixin flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
@mixin flex($direction, $justify) {
  display: flex;
  flex-direction: $direction;
  align-items: center;
  justify-content: $justify;
}
#login {
  background: url("../assets/background.png") no-repeat fixed top;
  background-size: cover;
  min-height: 100vh;
  min-width: 1148px;
  @include flex-row-center();
  height: 100%;
  overflow: hidden;
  .form-wrap {
    @include flex-row-center();
    width: 1148px;
    .img {
      width: 620px;
      height: 550px;
    }
  }
  .el-form {
    width: 528px;
    height: 550px;
    @include flex(column, flex-start);
    background-color: #fff;
    .title {
      margin-top: 76px;
      margin-bottom: 92px;
      @include flex-row-center();
      font-size: 34px;
      font-family: FZDHTJW--GB1-0, FZDHTJW--GB1;
      font-weight: 600;
      color: rgba(64, 158, 255, 1);
      line-height: 38px;
    }
    .el-form-item {
      width: 320px;
      border-bottom: #f1f1f1 2px solid;
      .el-input__inner {
        border: none;
      }
      .icon {
        width: 24px;
        height: 24px;
        padding: 1px 2px;
      }
    }
    .el-button {
      width: 320px;
      height: 60px;
      margin-top: 80px;
    }
    .forget {
      text-decoration: none;
      color: #999;
      &:hover {
        text-decoration: underline;
        color: #409eff;
      }
    }
  }
}
</style>

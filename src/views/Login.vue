<template>
  <div class="login-page">
    <Card class="login-box" :dis-hover="true" :bordered="false">
      <div class="login-logo">
        {{ pageTitle }}
      </div>
      <Form :model="loginUser" :ref="loginUser">
        <FormItem prop="username">
          <Input :autofocus="true"
                 size="large"
                 type="text"
                 v-model="loginUser.username"
                 placeholder="请输入账号">
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input size="large"
                 type="password"
                 v-model="loginUser.password"
                 @on-enter="login"
                 placeholder="请输入密码">
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="login"
                  long size="large"
                  :loading="isBtnLoading">
            {{btnText}}
          </Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<style scoped>
  .login-page {
    width: 100%;
    height: 100%;
    min-height: 100%;
    position: fixed;
    background: linear-gradient(0deg, #0b4182 1%, #1e88e5 100%);
  }
  .login-logo {
    font-weight: 500;
    font-size: 35px;
    text-align: center;
    margin-bottom: 25px;
  }
  .login-box {
    min-height: 300px;
    max-width: 380px;
    margin: 7% auto;
  }
  @media (max-width: 768px) {
    .login-box {
      width: 90%;
      margin-top: 20px;
    }
  }
</style>

<script>
import axios from 'axios'
import * as util from '../assets/js/util'
// 登录
const requestLogin = params => {
  let tokenHeader = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  }
  // return axios.post(`http://192.168.202.201:9968/jwt/v1/auth/login`, params, {headers: tokenHeader})
  return axios.post(`http://192.168.1.170:9968/jwt/v1/auth/login`, params, {headers: tokenHeader})
}

export default {
  name: 'Login',
  data () {
    return {
      pageTitle: '报表系统',
      // pageTitle: '信息管理系统',
      isBtnLoading: false,
      loginUser: {
        username: '',
        password: ''
      }
    }
  },
  created: function () {
    sessionStorage.clear()
  },
  computed: {
    btnText () {
      if (this.isBtnLoading) return '登录中...'
      return '登录'
    }
  },
  mounted: function () {
  },
  methods: {
    login () {
      var vm = this
      vm.isBtnLoading = true
      if (vm.loginUser.username === '' || vm.loginUser.password === '') {
        vm.$Message.warning('用户名或密码不能为空')
        vm.isBtnLoading = false
        return
      }
      util.appLocal('token', 'test')
      util.appLocal('username', vm.loginUser.username)
      let tokenBody = {
        username: vm.loginUser.username,
        password: vm.loginUser.password,
        appcode: 'report-app'
      }
      requestLogin(tokenBody).then(res => {
        vm.isBtnLoading = false
        let token = res.data.access_token
        if (token) {
          util.appLocal('token', token)
          // util.docCookies.setItem('sczq-token', token, '', '', 'sc.local')
          util.appLocal('username', tokenBody.username)
          // util.docCookies.setItem('sczq-username', tokenBody.username, '', '', 'sc.local')
          vm.$emit('login', vm.$router.currentRoute.query.from)
        } else {
          vm.$Message.error(res.data.message || '用户名或密码不正确！！！')
        }
      }).catch(util.catchError)
    }
  },
  components: {
  }
}
</script>

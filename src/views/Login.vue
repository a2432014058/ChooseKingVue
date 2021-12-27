<template>
  <div>
    <el-row>
      <el-col :span="12">
        <img class="loginImg" src="../static/mky.png">
      </el-col>
      <el-col :span="12">
        <div class="title"><img class="head" src="../static/head1.gif"></div>
        <el-form :model="form" status-icon :rules="rules" ref="ruleForm" label-width="0">
          <div class="myInput username1">
            <el-form-item prop="username">
              <el-input class="search1 search2 search3" prefix-icon="el-icon-user" v-model="form.username" placeholder="请输入账号" :clearable="true"></el-input>
            </el-form-item>
          </div>
          <div class="myInput password">
            <el-form-item prop="password">
              <el-input class="search1 search2 search3" prefix-icon="el-icon-magic-stick" placeholder="请输入密码" v-model="form.password" show-password></el-input>
            </el-form-item>
          </div>

          <div class="login">
            <el-form-item>
              <el-button class="logBtn" @click="login('ruleForm')">登录</el-button>
            </el-form-item>
          </div>
        </el-form>
        <div class="link">
          <el-link type="info" @click="register()">没有账号?去注册!</el-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在10个字符以内', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    recorded_username: function () {
      return this.$store.state.recorded_username;
    }
  },
  methods: {
    login() {
      // this.$axios.post('http://localhost:8082/login', {
      //   username: this.form.username,
      //   password: this.form.password
      // }).then(Response => {
      //   if(Response.data.status == 'success'){
      //     this.$store.commit('change_user', Response.data.result.username)
      //     this.$message({showClose: true, message: '登陆成功', type: 'success', center: true})
      //     this.$router.push({name: 'Home'})
      //   }else {
      //     this.$message({showClose: true, message: Response.data.msg, type: 'error', center: true})
      //   }
      // })
    var check = true
      var sum = localStorage.length
      console.log(this.$store)
       for (var i = 0; i < sum; i++) {
         var key = localStorage.key(i);
         var value = localStorage.getItem(key);
         if (this.form.username == key && this.form.password == value) {
           check = false
          this.$store.commit('change_user', this.form.username)
          //  localStorage.setItem(token, true)
          this.$message({showClose: true, message: '登陆成功', type: 'success', center: true})
          this.$router.push({name: 'Home'})
         }
       }
       console.log(this.$store)
       if(check){
         this.$message({showClose: true, message: "登陆失败", type: 'error', center: true})
       }
    },
    register() {
      this.$router.push({name: 'Register'});
    }
  }
}
</script>

<style>
.logo {
  margin: 0 auto;
}

.loginImg {
  width: 500px;
  margin: 0 auto;
  float: right;
}

/* ------------------------------ */

.title {
  margin-top: 5%;
  width: 100%;
  text-align: center;
}

.head {
  width: 350px;
}

.username1 {
  width: 40%;
  margin-top: 10%;
  margin-left: auto;
  margin-right: auto;
}

.password {
  width: 40%;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
}

.login {
  margin-top: 8%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.logBtn {
  width: 150px;
  height: 40px;
  border-radius: 25px;
  border: none;
  outline: none;
  background-color: #4F6E9D;
  color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.logBtn:focus,
.logBtn:hover {
  color: #FFFFFF;
  border-color: #7E9DCA;
  background-color: #7E9DCA;
}

.logBtn:active {
  color: #FFFFFF;
  border-color: #7E9DCA;
  outline: 0;
}

.link {
  margin-top: 10%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>


<template>
  <div>
    <el-row>
      <el-col :span="12">
        <img class="regImg"  alt="text" src="../static/left3.png">
      </el-col>

      <el-col :span="12">
        <div class="title"><img class="head" alt="text" src="../static/head2.gif"></div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
          <div class="myInput username2">
            <el-form-item prop="tel">
              <el-input class="search1 search2 search3" prefix-icon="el-icon-user" v-model="ruleForm.username" placeholder="请输入手机号" :clearable="true"></el-input>
            </el-form-item>
          </div>
          <div class="myInput password">
            <el-form-item prop="password">
              <el-input class="search1 search2 search3" prefix-icon="el-icon-magic-stick" placeholder="请输入密码" v-model="ruleForm.password" show-password></el-input>
            </el-form-item>
          </div>
          <div class="myInput password">
            <el-form-item prop="checkPass">
              <el-input class="search1 search2 search3" prefix-icon="el-icon-magic-stick" placeholder="确认密码" v-model="ruleForm.checkPass" show-password></el-input>
            </el-form-item>
          </div>

          <div class="login">
            <el-form-item prop="checkPass">
              <el-button class="logBtn" @click="submitForm('ruleForm')">注册</el-button>
            </el-form-item>
          </div>
        </el-form>
        <div class="link">
          <el-link type="info" @click="toLog()">已有账号?去登录!</el-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  data () {
    let checkTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(' 账号不能为空'))
      } else {
        callback()
      }
    }
    let validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(' 密码不能为空'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空 '))
      } else if (value !== this.ruleForm.password) {
        callback(new Error(' 两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        password: '',
        checkPass: ''
      },
      rules: {
        password: [{
          validator: validatePass1,
          trigger: 'change'
        }],
        checkPass: [{
          validator: validatePass2,
          trigger: 'change'
        }],
        tel: [{
          validator: checkTel,
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        //   axios.post('http://localhost:8082/register',
        //       {
        //         username: this.ruleForm.username,
        //         password: this.ruleForm.password
        //       }
        //   ).then(response => {
        //     let res = response.data
        //     if (res.status === 'success') { // 显示登录结果
        //       this.$message({showClose: true, message: '注册成功', type: 'success', center: true})
        //       this.$router.push({
        //         path: '/login'})
        //     } else if (res.status === 'error') { // 显示登录结果
        //       this.$message({showClose: true, message: res.msg, type: 'error', center: true})
        //     }
        //     // eslint-disable-next-line handle-callback-err
        //   })
        // } else {
        //    this.$message({showClose: true, message: '抱歉！注册失败！请稍后重试！', type: 'error', center: true})
        //   return false
        // }
        var sum = localStorage.length
        var check = true
        for (let index = 0; index < sum; index++) {
          var key = localStorage.key(index);
          var value = localStorage.getItem(key);
          if (this.ruleForm.username == key && this.ruleForm.password == value) {
            check = false
            this.$message({showClose: true, message: '注册失败', type: 'error', center: true});
         } 
        }
        if(check){
        localStorage.setItem(this.ruleForm.username, this.ruleForm.password)
        this.$message({showClose: true, message: '注册成功', type: 'success', center: true})
        this.$router.push({ path: '/login'})
        }  
        }
      })
    },
    toLog () {
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>
<style>

.regImg {
  width: 700px;
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

.username2 {
  width: 40%;
  margin-top: 5%;
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

.link {
  margin-top: 10%;
  margin-bottom: 50px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>

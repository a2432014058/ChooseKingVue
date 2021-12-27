<template>
  <div id="tool-bar">
    <div class="box top" ref="topbox">
      <el-row class="h-row">
        <el-col :span="14">   <h1>上一次的猴王是：{{y}} 号</h1> </el-col>
        <el-col :span="10" class="v-col">
          <el-button :disabled="disabled" @click="clickCount">显示</el-button>
        </el-col>
        <el-col :span="14">
        </el-col>
      </el-row>
      <el-row class="h-row">
        <h1>裁判</h1>
      </el-row>
      <el-row type="flex" class="h-row">
        <el-col :span="14"> <h2>猴子总数</h2> </el-col>
        <el-col :span="10" class="v-col">
          <el-input-number v-model="totalNum" :disabled="disabled" :min="2" :max="NaN" label="游戏人数" />
        </el-col>
      </el-row>
      <el-row type="flex" class="h-row">
        <el-col :span="14">
          <h2>起始位置</h2>
        </el-col>
        <el-col :span="10" class="v-col">
          <el-input-number v-model="startPos" :disabled="disabled" :min="1" :max="totalNum" label="起始位置" />
        </el-col>
      </el-row>
       <el-row type="flex" justify="space-between" class="h-row">
         <el-col :span="14"> <h2>N</h2> </el-col>
         <el-col :span="10" class="v-col">
          <el-input-number v-model="n" :disabled="disabled" :min="1" label="10" />
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" class="h-row last">
        <el-col :span="14"> <h2>开始游戏</h2> </el-col>
        <el-col :span="10" class="v-col">
          <el-button :disabled="disabled" @click="play">开始</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" class="h-row last">
        <el-col :span="14"> <h2>重置游戏</h2> </el-col>
        <el-col :span="10" class="v-col">
          <el-button :disabled="rdisabled" @click="remake">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div  class="box bottom" ref="bottombox">
      <el-row v-show="begin" type="flex" justify="space-between" class="h-row last">
        <el-col :span="7"> <h2>踢出该位置的猴子</h2> </el-col>
        <el-col :span="10" class="v-col">
          <el-input v-model="left" style="margin: 30px;"/>
          <el-button @click="deleteByNo">确定</el-button>
        </el-col>
      </el-row>
      <el-row v-show="begin" type="flex" justify="space-between" class="h-row last">
        <el-col :span="14"> <h2>增加一人</h2> </el-col>
        <el-col :span="10" class="v-col">
          <el-button @click="addByNo">确定</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import { globalBus } from '../store/index';
export default {
  name: "justice",
  data() {
    return {
      totalNum: 10,
      startPos: 1,
      aniInt: 1000,
      timer: 0,
      disabled: false,
      rdisabled: true,
      begin: false,
      cPersons: [],
      cur: '',
      n: '',
      left: 1,
      y: '',
      num: '',
      ad: '',
    }
  },
  created(){
      const res = JSON.parse(localStorage.getItem('set'))
      const king= JSON.parse(localStorage.getItem('reed'))
      this.y =king.persons[0].name
      this.totalNum=res.totalNum
      this.startPos=res.startPos
      this.n=res.n
  },
  computed: {
    ...mapState(["persons", "marker"]),
  },
  mounted() {
    this.initPersons(this.totalNum)
    this.selectPerson(this.startPos - 1)
  },
  methods: {
    ...mapMutations([
      "initPersons",
      "clearPersons",
      "leavePerson",
      "addPerson",
      "selectPerson",
      "deselectPerson",
      "king",
      "setMarker",
      "set"
    ]),
    clickCount() {
      globalBus.$emit('data',1);
      this.rdisabled = false
      this.disabled = true
    },
    // 计算Persons中对应的序号
    getCurIndex(nameIndex) {
      var bias = 0
      for (var i = 0; i < this.cPersons.length; i++) {
        if (this.cPersons[i].left === true) {
          ++bias
          continue
        }
        if (this.cPersons[i].index === nameIndex) {
          return i - bias
        }
      }
    },
    // 闪烁选中某人
    shinePerson(index, mark = true) {
      setTimeout(() => {
        if (mark) {
          this.setMarker(index)
          this.handleSpeak(this.ad)
          this.ad=(this.ad+1)%(this.n+1)===0?1:(this.ad+1)%(this.n+1)
          console.log(this.ad)
        }
        this.selectPerson(index)
      }, this.aniInt * this.timer)
      setTimeout(() => {
        this.deselectPerson(index)
      }, this.aniInt * this.timer + this.aniInt / 4)
      setTimeout(() => {
        this.selectPerson(index)
      }, this.aniInt * this.timer + this.aniInt / 4)
      setTimeout(() => {
        this.deselectPerson(index)
      }, this.aniInt * this.timer++ + (this.aniInt / 4))
    },
    handleSpeak(text){
      const synth = window.speechSynthesis;
      const msg = new SpeechSynthesisUtterance();
      if(window.speechSynthesis){
        msg.text = text;     // 文字内容
        msg.lang = "zh-CN";  // 使用的语言:中文
        msg.volume = 1;      // 声音音量：1
        msg.rate = 1;        // 语速：1
        msg.pitch = 1;       // 音高：1
        synth.speak(msg);    // 播放
      }
    },
    getWindowVoice(){  // 获取浏览器中语音 (中文 + 本地服务)
      return window.speechSynthesis.getVoices().find(item => item.localService && item.lang === 'zh-CN')
    },
// 语音停止
    handleStop(e){
      const synth = window.speechSynthesis;
      const msg = new SpeechSynthesisUtterance();
      if(window.speechSynthesis){
        msg.text = e;
        msg.lang = "zh-CN";
        synth.cancel(msg);
      }
    },
    // 重置游戏
    remake() {
      this.clearPersons()
      this.initPersons(this.totalNum)
      this.selectPerson(this.startPos - 1)
      this.rdisabled = true
      this.disabled = false
      this.n=1
      this.ad = 1
    },
    deleteByNo() {
      this.leavePerson(this.left);
      this.totalNum--;
    },
    addByNo() {
      this.num++;
    },

    // 开始游戏
   play() {
      this.num = this.totalNum
      this.begin = true
      this.disabled = true
      this.rdisabled = true
      this.timer = 0
      var i, j, choice
      while (this.cPersons.length > 0) {
        this.cPersons.pop()
      }
      for (i = 0; i < this.num; ++i) {
        this.cPersons.push({
          index: i + 1,
          left: false,
        })
      }
      for (i = 0; i < this.num; i++) {
        this.cPersons[i].prior = this.cPersons[(i - 1 + this.num) % this.num]
        this.cPersons[i].next = this.cPersons[(i + 1) % this.num]
      }
      var cur = this.cPersons[this.startPos - 1]
      i=0
      while (i < this.num - 1) {
        choice = this.n;
        this.timer += 1000 / this.aniInt
        for (j = 0; j < choice; j++) {
          this.shinePerson(this.getCurIndex(cur.index))
          cur = cur.next
        }
        cur = cur.prior;
        ((i) =>
          setTimeout(() => {
            this.leavePerson(i)
          }, this.aniInt * this.timer++))(this.getCurIndex(cur.index))
        cur.left = true
        cur.prior.next = cur.next
        cur.next.prior = cur.prior
        cur = cur.next
        if (i !== this.num - 2) {
          this.shinePerson(this.getCurIndex(cur.index), false);
          ((i) =>
            setTimeout(() => {
              this.selectPerson(i)
            }, this.aniInt * this.timer++))(this.getCurIndex(cur.index))
        }else{
            ((i) =>
            setTimeout(() => {
              this.king(i)
            }, this.aniInt * this.timer++))(this.getCurIndex(cur.index))
        }
        i++
      }
      setTimeout(() => {
        this.rdisabled = false
        this.begin = false
        const king= JSON.parse(localStorage.getItem('reed'))
        globalBus.$emit('save',1);
        this.y =king.persons[0].name
      }, this.aniInt * this.timer + 500)
      const res={
      totalNum: this.totalNum,
      startPos: this.startPos,
      aniInt: this.aniInt,
      n:  this.n
      }
      localStorage.setItem("set", JSON.stringify(res))
    },

  },
  watch: {
    totalNum(newValue) {
      this.clearPersons()
      this.initPersons(newValue)
      if (this.startPos > newValue) {
        this.startPos = newValue
      }
      this.selectPerson(this.startPos - 1)
    },
    startPos(newValue, oldValue) {
      this.deselectPerson(oldValue - 1)
      this.selectPerson(newValue - 1)
    },
  },
}
</script>

<style scoped>
king {
  width: 100px;
  height: 100px;
}
#tool-bar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.box {
  width: 85%;
  /* margin: auto; */
  border-width: 2px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  float: left;
}
.box.top {
  margin: auto 0 5% 5%;
}
.box.bottom {
  margin: 5% 0 auto 5%;
}
.box.last {
  margin-right: 20px;
}
.v-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
h1 {
  font-size: 20px;
  font-weight: bold;
  height: 25px;
  line-height: 25px;
  margin-top: 18px;
  margin-bottom: 5px;
}
h2 {
  font-size: 17px;
  font-weight: bold;
  height: 20px;
  line-height: 20px;
  color: #1f2f3d;
  margin-bottom: 2px;
}
p {
  padding: 0 0 5px 0px;
  text-align: center;
  color: #1f2f3d;
}
.h-row {
  margin-bottom: 5px;
  padding: 1% 6% 0 6%;
  flex-wrap: wrap;
  /* display: flex; */
  align-items: center;
}
.i-row {
  margin-top: 5px;
  margin-bottom: 5px;
}
.i-row.s-row {
  margin-top: 15px;
}
.m-row {
  margin-bottom: 15px;
}
.block {
  text-align: center;
}
.s-line {
  line-height: 44px;
}
.last {
  margin-bottom: 20px;
}
#dice-box {
  margin: auto;
  width: 100px;
  height: 150px;
}
</style>

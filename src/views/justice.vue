<template>
  <div id="tool-bar">
    <div class="box top" ref="topbox">
      <el-row class="h-row">
        <h1>配置项</h1>
      </el-row>
      <el-row type="flex" class="h-row">
        <el-col :span="14"> <h2>猴子总数</h2> </el-col>
        <el-col :span="10" class="v-col">
          <el-input-number v-model="totalNum" :min="2" :max="NaN" label="游戏人数" />
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
    <div class="box bottom">
      <el-row class="h-row">
        <h1>操作</h1>
      </el-row>
      <el-row type="flex" justify="space-between" class="h-row">
         <el-col :span="5"> <h2>填写下一个:</h2> </el-col>
        <el-input v-model="set" style="width: 200px" autocomplete="off" />
        <el-col :span="10" class="v-col">
          <el-button @click="away">确定</el-button>
        </el-col>
        
      </el-row>
      <el-row>
        <div id="dice-box"></div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"


export default {
  name: "ToolBar",
  data() {
    return {
      totalNum: 10,
      startPos: 1,
      aniInt: 600,
      timer: 0,
      disabled: false,
      rdisabled: true,
      points: "- -",
      cPersons: [],
      cur: '',
      set: '',
    }
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
      "selectPerson",
      "deselectPerson",
      "king",
      "setMarker",
    ]),
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
    // 重置游戏
    remake() {
      this.clearPersons()
      this.initPersons(this.totalNum)
      this.selectPerson(this.startPos - 1)
      this.rdisabled = true
      this.disabled = false
    },
    // 开始游戏
    play() {
      this.disabled = true
      this.rdisabled = true
      this.timer = 0
      var i
      while (this.cPersons.length > 0) {
        this.cPersons.pop()
      }
      for (i = 0; i < this.totalNum; ++i) {
        this.cPersons.push({
          index: i + 1,
          left: false,
        })
      }
      for (i = 0; i < this.totalNum; i++) {
        this.cPersons[i].prior = this.cPersons[(i - 1 + this.totalNum) % this.totalNum]
        this.cPersons[i].next = this.cPersons[(i + 1) % this.totalNum]
      }
      this.cur = this.cPersons[this.startPos - 1]
      // 开始
    },
    away() {
      for (var j = 0; j < this.set; j++) {
          this.shinePerson(this.getCurIndex(this.cur.index))
          this.cur = this.cur.next
        }
        this.cur = this.cur.prior;
        ((i) =>
          setTimeout(() => {
            this.leavePerson(i)
          }, this.aniInt * this.timer++))(this.getCurIndex(this.cur.index))
        this.cur.left = true
        this.cur.prior.next = this.cur.next
        this.cur.next.prior = this.cur.prior
        this.cur = this.cur.next;
        if(this.cur.next === this.cur.prior){
            ((i) =>
            setTimeout(() => {
              this.king(i)
            }, this.aniInt * this.timer++))(this.getCurIndex(this.cur.index))
        } else{
          this.shinePerson(this.getCurIndex(this.cur.index), false);
          ((i) =>
            setTimeout(() => {
              this.selectPerson(i)
            }, this.aniInt * this.timer++))(this.getCurIndex(this.cur.index))
        }
           
    }
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

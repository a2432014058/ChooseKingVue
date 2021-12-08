import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const actions = {

};

const state = {
    recorded_username: '',
    persons: [],
    outPersons: [],
    marker: [],
    showMarker: [],
    dis: 150,
    radius: 0,
};
const mutations = {
    change_user(state, username) {
        state.recorded_username = username;
    },
    // 初始化数组
    initPersons(state, num) {
        state.radius = Math.sqrt(num - 1) * state.dis;
        var angle = 2 * Math.PI / num, i;
        for (i = 0; i < num; i++) {
            state.persons.push({
                name: (i + 1).toString(),
                x: state.radius * Math.sin(angle * i),
                y: -state.radius * Math.cos(angle * i),
                symbolSize: 60,
                symbol:'image://'+require('@/static/othermonkney.png'),
                itemStyle: {
                    color: "#409EFF",
                },
                value: '一只勇敢的猴儿',
            });
        }
    },
    // 清空所有人
    clearPersons(state) {
        while (state.persons.length > 0) {
            state.persons.pop();
        }
        while (state.outPersons.length > 0) {
            state.outPersons.pop();
        }
    },
    // 一人出列
    leavePerson(state, index) {
        // 出列则清空报数标记
        while (state.marker.length > 0) {
            state.marker.pop();
        }
        while (state.showMarker.length > 0) {
            state.showMarker.pop();
        }
        var newPersons = state.persons.concat([]);
        // 一人出列
        state.outPersons.push(newPersons.splice(index, 1)[0]);
        state.radius = Math.sqrt(newPersons.length - 1) * state.dis;
        state.outPersons[state.outPersons.length - 1].symbol='image://'+require('@/static/monkney.png'),
        state.outPersons[state.outPersons.length - 1].value = "一只失败的猴儿"
        var angle = 2 * Math.PI / newPersons.length, i;
        // 重新计算未出列人的坐标
        for (i = 0; i < newPersons.length; i++) {
            newPersons[i].x = state.radius * Math.sin(angle * i);
            newPersons[i].y = -state.radius * Math.cos(angle * i);
        }
        // 重新计算已出列人的坐标
        var middle = ((state.outPersons.length - 1) % 8 + 2) / 2;
        for (i = 0; i < state.outPersons.length; i++) {
            if (Math.floor(i / 8) === Math.floor((state.outPersons.length - 1) / 8)) {
                state.outPersons[i].x = (i % 8 + 1 - middle) * state.dis;
            }
            state.outPersons[i].y = state.radius + state.dis * (Math.floor(i / 8) + 1);
        }
        state.persons = newPersons;
    },
    // 选中某人
    selectPerson(state, index) {
        var newPersons = state.persons.concat([])
        newPersons[index].symbol='image://'+require('@/static/choosemonkney.png')
        state.persons = newPersons;
    },
    // 反选某人
    deselectPerson(state, index) {
        var newPersons = state.persons.concat([])
        newPersons[index].symbol='image://'+require('@/static/othermonkney.png')
        state.persons = newPersons
    },
    // 王的诞生
    king(state, index) {
        var newPersons = state.persons.concat([])
        newPersons[index].symbol='image://'+require('@/static/King.png')
        newPersons[index].symbolSize=200
        state.persons = newPersons
    },
    // 报数标记
    setMarker(state, index) {
        var angle = 2 * Math.PI / state.persons.length, mark = ['①', '②', '③', '④', '⑤', '⑥'], i;
        for (i = 0; i < state.marker.length; ++i) {
            if (state.marker[i].i === index) {
                // 置重复标记的show属性
                state.marker[i].show = false;
            }
        }
        state.marker.push({
            name: mark[state.marker.length],
            i: index,
            x: (state.radius - state.dis / 2) * Math.sin(angle * index),
            y: -(state.radius - state.dis / 2) * Math.cos(angle * index),
            symbolSize: 1,
            itemStyle: {
                color: "#909399",
            },
            value: '当前报数',
            label: {
                show: true,
                color: "#E6A23C",
                fontStyle: 'bold',
                fontSize: 25,
            },
            show: true,
        })
        // 过滤重复标记
        state.showMarker = state.marker.filter((e) => e.show);
    },
};

export default new Vuex.Store({
    actions,
    mutations,
    state,
})

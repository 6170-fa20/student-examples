import Vue from 'vue'
import Vuex from 'vuex'

// vuex logic borrowed from Alex Kozack
// https://codesandbox.io/s/407zvllxw4?file=/src/main.js

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        messageLine: [],
        userAuth: '',
      },
      mutations: {
        push(state, message) {
          state.messageLine.push(message);
        },
        shift(state) {
          state.messageLine.shift();
        },
        authenticate(state, name) {
            state.userAuth = name; 
        },
      }
})
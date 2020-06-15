import Vue from 'vue'
    import vueView from '../src/views/vueView.vue'
    new Vue({
      el:'#vueView',
      render:h=>h(vueView)
    })
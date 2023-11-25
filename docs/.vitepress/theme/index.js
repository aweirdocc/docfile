// import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './index.scss';
import ZoomImg from './components/zoomImg.vue'

export default {
  ...DefaultTheme,
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //     // "aside-top": () => h(asideTop),
  //   })
  // },
  enhanceApp({ app }) {
    app.component('ZoomImg', ZoomImg)
  }
}
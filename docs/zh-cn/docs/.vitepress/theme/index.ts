import { onMounted, ref } from 'vue';
import { EnhanceAppContext } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import mediumZoom, { Zoom } from 'medium-zoom';
import './custom.css';
import ListBoxContainer from './components/ListBoxContainer.vue';
import ListBox from './components/ListBox.vue';
import ACImage from './components/ACImage.vue';

const zoom = ref<Zoom | null>(null);

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)

    ctx.app.provide('medium-zoom', zoom);

    ctx.app.component('ListBoxContainer', ListBoxContainer);
    ctx.app.component('ListBox', ListBox);
    ctx.app.component('ACImage', ACImage);
  },
  setup() {
    onMounted(() => {
      zoom.value = mediumZoom();
    });
  },
};

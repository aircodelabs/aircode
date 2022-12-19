import { EnhanceAppContext } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import mediumZoom from 'medium-zoom';
import './custom.css';
import ListBoxContainer from './components/ListBoxContainer.vue';
import ListBox from './components/ListBox.vue';
import ACImage from './components/ACImage.vue';

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)

    const zoom = mediumZoom();
    ctx.app.provide('medium-zoom', zoom);

    ctx.app.component('ListBoxContainer', ListBoxContainer);
    ctx.app.component('ListBox', ListBox);
    ctx.app.component('ACImage', ACImage);
  },
};

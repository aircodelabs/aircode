import DefaultTheme from 'vitepress/theme';
import './custom.css';
import ListBoxContainer from './components/ListBoxContainer.vue';
import ListBox from './components/ListBox.vue';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ListBoxContainer', ListBoxContainer);
    app.component('ListBox', ListBox);
  }
};

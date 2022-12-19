<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, inject, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Zoom } from 'medium-zoom';

const ZOOM_DELAY = 500;

const props = withDefaults(defineProps<{
  src: string;
  alt?: string;
  mode: 'light' | 'dark';
}>(), {
  mode: 'light',
});

const { isDark } = useData();
const show = computed(
  () => isDark.value === (props.mode === 'dark')
);
const image = ref<HTMLImageElement | null>(null);
const zoom = inject('medium-zoom') as Zoom;

const attachZoom = () => {
  setTimeout(() => {
    if (image.value) {
      zoom.attach(image.value);
    }
  }, ZOOM_DELAY);
}

const detachZoom = () => {
  if (image.value) {
    zoom.detach(image.value);
  }
}

onMounted(() => {
  attachZoom();
});

onBeforeUnmount(() => {
  detachZoom();
});

watch(
  show,
  (val) => {
    if (val) {
      attachZoom();
    } else {
      detachZoom();
    }
  }
)

</script>

<template>
<img v-if="show" :src="src" :alt="alt" ref="image">
</template>

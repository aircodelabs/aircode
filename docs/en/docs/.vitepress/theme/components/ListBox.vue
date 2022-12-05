<script setup lang="ts">
import { withBase } from 'vitepress';

const props = defineProps<{
  link: string;
  title: string;
  description?: string;
  single?: boolean;
}>();
const linkWithBase = withBase(props.link);
</script>

<template>
<div class="list-box" :class="{ 'single-box': !!single }">
  <a :href="linkWithBase" class="list-box-link">
    <p class="list-box-title">{{ title }}</p>
    <p class="list-box-description">{{ description }}</p>
  </a>
</div>
</template>

<style scoped>
.list-box {
  padding: 12px;
  flex: 0 1 100%;
}

.list-box-link {
  text-decoration: none;
  cursor: pointer;
  outline: none;
  display: flex;
  border-radius: 8px;
  box-shadow: var(--vp-shadow-1);
  padding: 18px;
  transition: box-shadow .15s ease;
  text-decoration: none;
  background: var(--vp-c-bg-soft);
  flex-direction: column;
  height: 100%;
}

.list-box-link:hover {
  box-shadow: var(--vp-shadow-2);
}

.list-box-title {
  margin: 0 0 8px 0;
}

.list-box-description {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .list-box {
    flex-basis: 50%;
  }

  .list-box.single-box {
    flex-basis: 100%;
  }

  .list-box-link {
    padding: 24px;
  }
}
</style>

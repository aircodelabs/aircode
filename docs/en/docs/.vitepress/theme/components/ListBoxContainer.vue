<template>
<div class="list-box-container">
  <slot></slot>
</div>
</template>

<style scoped>
.list-box-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 16px -12px;
}
</style>

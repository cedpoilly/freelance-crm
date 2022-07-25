<scrpt setup></scrpt>

<template>
  <button
    class="base-button"
    v-bind="$attrs"
    @click.stop="$emit('button-click', $event)"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  @apply px-3 py-2 rounded-md;
}
</style>

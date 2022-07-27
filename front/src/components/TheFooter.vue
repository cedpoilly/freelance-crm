<template>
  <section class="footer">
    <h3 class="footer-text">This is the app footer.</h3>
  </section>
</template>

<style lang="scss" scoped>
  .footer {
    @apply absolute bottom-0;
    @apply w-full h-12 px-10 py-4 flex;
    @apply bg-sky-100 text-sky-900 font-bold;

    &-text {
      @apply opacity-50;
    }
  }
</style>

<template>
  <section class="footer">
    <h3 class="footer-text">
      <span class="app-name">Freelance CRM - </span>
      Made with 💙 by
      <a class="link" href="mailto:cedpoilly@gmail.com">cedpoilly</a>
    </h3>
  </section>
</template>

<style lang="scss" scoped>
  .footer {
    @apply absolute grid content-center;
    @apply w-full h-10 px-4 py-1 bottom-0;
    @apply bg-blue-100 text-sky-600;

    &-text {
      @apply w-full opacity-70 text-center;
    }

    .app-name {
      @apply hidden md:inline-block italic;
    }

    .link {
      @apply font-bold;
    }
  }
</style>

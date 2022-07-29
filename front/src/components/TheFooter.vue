<template>
  <section class="footer text-micro">
    <h3 class="footer-text text-micro">
      <span class="app-name">Freelance CRM - </span>
      Made with 💙 by
      <a class="link" href="mailto:cedpoilly@gmail.com">cedpoilly</a>
    </h3>
  </section>
</template>

<style lang="scss" scoped>
  .footer {
    @apply grid content-center;
    @apply w-full h-8 md:h-10 px-4 md:py-1 bottom-0;
    @apply bg-teal-100 dark:bg-slate-800 text-sky-600 dark:text-sky-100;

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

<template>
  <div class="loader"></div>
</template>

<style lang="scss" scoped>
  .loader {
    position: relative;
    content: "";
    width: 100%;
    height: 4px;
    overflow: hidden;
    @apply bg-yellow-900;
    transition: all 1s linear;
    animation: gradient 2s linear infinite alternate-reverse;
  }

  .loader::before {
    position: absolute;
    content: "";
    width: 30%;
    height: 4px;
    @apply bg-gradient-to-r from-yellow-800;
    @apply bg-yellow-600;
    animation: move 2s linear infinite;
  }

  @keyframes gradient {
    0% {
      @apply bg-gradient-to-r from-sky-800;
      @apply bg-sky-600;
    }
    100% {
      @apply bg-gradient-to-r from-sky-800;
      @apply bg-sky-800;
    }
  }

  @keyframes move {
    0% {
      transform: translateX(-90%);
      @apply bg-gradient-to-r from-slate-800;
      @apply bg-slate-600;

      width: 30%;
    }
    50% {
      width: 50%;
      @apply bg-slate-700;
    }
    100% {
      width: 30%;
      transform: translateX(100% * 4);
      @apply bg-gradient-to-r from-slate-800;
      @apply bg-slate-600;
    }
  }
</style>

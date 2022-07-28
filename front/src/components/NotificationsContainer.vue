<script setup>
  import { watch, ref, computed } from "vue"

  import BaseNotification from "./BaseNotification.vue"

  const removalDelay = 5000

  const props = defineProps({
    notifications: { type: Array, required: true },
  })

  const currentList = ref([])

  const reversedList = computed(() => currentList.value.reverse())

  watch(
    () => props.notifications,
    newValue => {
      addToList(getLastItem(newValue))
      removeAfter(removalDelay)
    }
  )

  function addToList(notification) {
    currentList.value = [notification, ...currentList.value]
  }

  function removeAfter(removalDelay) {
    setTimeout(() => {
      currentList.value = [...currentList.value].slice(1)
    }, removalDelay)
  }

  function getLastItem(list) {
    return list[list.length - 1]
  }
</script>

<template>
  <TransitionGroup name="list" tag="ul" class="notifications">
    <BaseNotification
      v-for="({ title, message }, index) in currentList"
      :key="index"
      :title="title"
      :message="message"
    />
  </TransitionGroup>
</template>

<style lang="scss" scoped>
  .notifications {
    z-index: 1;
    @apply absolute px-16 min-w-0 h-0 top-24 right-0 justify-end grid gap-4;
    grid-template-rows: repeat(6, 5rem);
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>

<script setup>
import { computed, nextTick, ref, toRaw, watch } from 'vue'

import BaseModal from './BaseModal.vue'

const dialog = ref(null)

defineExpose({ open, close, cancelAndClose })


/** Inteactions */
async function open(callback) {
  await setIsOpen(true)


  await dialog?.value?.open(callback)
  const ret = dialog.value?.isCancelled ? '' : toRaw(client.value)

  await setIsOpen(false)
  return ret
}

function close() { return dialog?.value?.close() }
function cancelAndClose() { return dialog?.value?.cancelAndClose() }

const isOpen = ref(false)
async function setIsOpen(shouldOpen) {
  isOpen.value = shouldOpen
  await nextTick()
}
</script>

<template>
  <BaseModal v-if="isOpen" tabindex="0" :is-default-actions="true" role="dialog" ref="dialog" key="INFO_DIALOG">
    <template #title class="tile-container">
      Shortcuts
    </template>

    <template #content>
      <div class="info-container">
        <section class="edit-modal">
          <h3 class="section-title">Dashboard / Projects</h3>

          <p class="section-instructions">
            <span class="code">ctrl</span> + <span class="code">F</span> <span class="font-bold">:</span> Focus on the
            table search.
          </p>

          <p class="section-instructions">
            <span class="code">ctrl</span> + <span class="code">L</span> <span class="font-bold">:</span> Focus on the
            navbar.
          </p>

          <p class="section-instructions">
            <span class="code">ctrl</span> + <span class="code">D</span> <span class="font-bold">:</span> Focus on the
            data table.
          </p>
        </section>

        <section class="settings-page">
          <h3 class="section-title">Settings Page</h3>
          <p class="section-instructions">
            No shortcuts availale yet. 🤷
          </p>
        </section>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
.info-container {
  @apply w-full grid grid-cols-2 gap-3
}

.section-title {
  @apply mb-5 text-xl font-bold
}

.section-instructions {
  @apply text-lg py-2
}

.code {
  @apply bg-gray-100 px-1 py-1 border border-gray-300 rounded
}
</style>
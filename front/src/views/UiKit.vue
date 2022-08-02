<script setup>
  import { ref } from "vue"

  import BaseButton from "../ui-kit/BaseButton.vue"
  import BaseInput from "../ui-kit/BaseInput.vue"
  import BaseSelect from "../ui-kit/BaseSelect.vue"
  import BaseToggle from "../ui-kit/BaseToggle.vue"
  import Loader from "../ui-kit/Loader.vue"

  const OPTIONS = ["option 1", "option 2", "option 3"]

  const toggleEnabledUnchecked = ref(false)
  const toggleEnabledChecked = ref(true)

  function updateToggleUnChecked(event) {
    toggleEnabledUnchecked.value = event
  }

  function updateToggleChecked(event) {
    toggleEnabledChecked.value = event
  }
</script>

<template>
  <div class="view-container bg-slate-100 dark:bg-slate-900">
    <div
      class="ui-kit-container px-10 py-10 my-4 container mx-auto flex flex-col justify-center items-center rounded-sm"
      style="max-width: 40rem"
    >
      <h2 class="h2">Loaders</h2>

      <div
        class="flex flex-col items-center justify-center w-full gap-6 mt-7 mb-20"
      >
        <Loader class="w-30" />
      </div>

      <h2 class="h2">Buttons</h2>
      <div class="flex flex-col items-center justify-center w-full gap-6">
        <div class="container w-auto">
          <h3 class="h3 text-center my-4">Enabled</h3>
          <div class="enabled flex items-center justify-center w-auto gap-6">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="cancel">Cancel</BaseButton>
          </div>
        </div>
        <div class="container w-auto">
          <h3 class="h3 text-center my-4">Disabled</h3>
          <div class="enabled flex items-center justify-center w-auto gap-6">
            <BaseButton disabled="disabled" variant="primary">
              Primary
            </BaseButton>
            <BaseButton disabled="disabled" variant="secondary">
              Secondary
            </BaseButton>
            <BaseButton disabled="disabled" variant="cancel">
              Cancel
            </BaseButton>
          </div>
        </div>
        <div class="container w-auto">
          <h3 class="h3 text-center my-4">Loading</h3>
          <div
            class="enabled flex flex-wrap items-center justify-center w-auto gap-6"
          >
            <BaseButton :is-loading="true" variant="primary">
              Primary
            </BaseButton>
            <BaseButton :is-loading="true" variant="secondary">
              Secondary
            </BaseButton>
            <BaseButton :is-loading="true" variant="cancel">
              Cancel
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div
      class="ui-kit-container px-10 py-10 my-4 container mx-auto flex flex-col justify-center items-center rounded-sm"
      style="max-width: 40rem"
    >
      <h2 class="h2">Inputs</h2>
      <div class="flex flex-col items-center justify-center w-full gap-6">
        <div class="enabled container w-full">
          <h3 class="h3 text-center my-4">Enabled</h3>
          <div
            class="enabled flex flex-wrap items-center justify-center w-full gap-6"
          >
            <BaseInput label="Base input" field-name="base-input" />

            <BaseToggle
              :is-checked="toggleEnabledUnchecked"
              label="Base toggle"
              field-name="base-toggle"
              @toggled="updateToggleUnChecked($event)"
            />

            <BaseToggle
              :is-checked="toggleEnabledChecked"
              label="Base toggle"
              field-name="base-toggle"
              @toggled="updateToggleChecked($event)"
            />

            <BaseSelect
              :options="OPTIONS"
              label="Base select"
              field-name="base-select"
              blank-option-label="Select one option."
            />

            <BaseSelect
              :is-multi="true"
              :options="OPTIONS"
              label="Base multi select"
              field-name="base-select"
              blank-option-label="Select one or more option(s)."
            />
          </div>
        </div>

        <div class="enabled container w-full">
          <h3 class="h3 text-center my-4">Errors</h3>
          <div
            class="enabled flex flex-wrap items-center justify-center w-full gap-6"
          >
            <BaseInput
              label="Base input"
              :error="'Something went wrong'"
              field-name="base-input"
            />

            <BaseToggle
              :is-checked="toggleEnabledUnchecked"
              label="Base toggle"
              error="Something went wrong"
              field-name="base-toggle"
              @toggled="updateToggleUnChecked($event)"
            />

            <BaseToggle
              :is-checked="toggleEnabledChecked"
              label="Base toggle"
              error="Something went wrong"
              field-name="base-toggle"
              @toggled="updateToggleChecked($event)"
            />

            <BaseSelect
              :options="OPTIONS"
              label="Base select"
              error="Something went wrong"
              field-name="base-select"
              blank-option-label="Select one option."
            />

            <BaseSelect
              :is-multi="true"
              :options="OPTIONS"
              label="Base multi select"
              error="Something went wrong"
              field-name="base-select"
              blank-option-label="Select one or more option(s)."
            />
          </div>
        </div>

        <div class="disabled container w-full">
          <h3 class="h3 text-center my-4">Disabled</h3>
          <div
            class="enabled flex flex-wrap items-center justify-center w-full gap-6"
          >
            <BaseInput disabled label="Base input" field-name="base-input" />

            <BaseToggle
              disabled
              label="Base toggle"
              field-name="base-toggle"
              :is-checked="false"
            />

            <BaseToggle
              disabled
              label="Base toggle"
              field-name="base-toggle"
              :is-checked="true"
            />

            <BaseSelect
              disabled
              :options="OPTIONS"
              label="Base select"
              field-name="base-select"
              blank-option-label="Select one option."
            />

            <BaseSelect
              disabled
              :is-multi="true"
              :options="OPTIONS"
              label="Base multi select"
              field-name="base-select"
              blank-option-label="Select one or more option(s)."
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ui-kit-container {
    max-width: 40rem;
    @apply bg-slate-100 dark:bg-slate-900;
  }
</style>

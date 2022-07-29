<script setup>
  import { ref } from "vue"

  import BaseButton from "../ui-kit/BaseButton.vue"
  import BaseInput from "../ui-kit/BaseInput.vue"
  import BaseSelect from "../ui-kit/BaseSelect.vue"
  import BaseToggle from "../ui-kit/BaseToggle.vue"

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
  <div class="flex-col w-full pt-40 pb-32 bg-slate-50 overflow-y-auto">
    <div
      class="container mx-auto flex flex-col justify-center items-center bg-white px-10 py-20 rounded-sm"
    >
      <h2 class="h2">Buttons</h2>
      <div class="flex flex-col items-center justify-center w-full gap-4">
        <div class="container w-auto">
          <h3 class="h3 text-center">Enabled</h3>
          <div class="enabled flex items-center justify-center w-auto gap-4">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="cancel">Cancel</BaseButton>
          </div>
        </div>
        <div class="container w-auto">
          <h3 class="h3 text-center">Disabled</h3>
          <div class="enabled flex items-center justify-center w-auto gap-4">
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
          <h3 class="h3 text-center">Loading</h3>
          <div class="enabled flex items-center justify-center w-auto gap-4">
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
      class="container mx-auto flex flex-col justify-center items-center bg-white px-10 py-20 rounded-sm"
    >
      <h2 class="h2">Inputs</h2>
      <div class="flex flex-col items-center justify-center w-full gap-4">
        <div class="enabled container w-full">
          <h3 class="h3 text-center">Enabled</h3>
          <div
            class="enabled flex flex-wrap items-center justify-center w-full gap-4"
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

        <div class="disabled container w-full">
          <h3 class="h3 text-center">Disabled</h3>
          <div
            class="enabled flex flex-wrap items-center justify-center w-full gap-4"
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

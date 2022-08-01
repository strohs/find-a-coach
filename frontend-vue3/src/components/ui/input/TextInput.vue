<script lang="ts">
// TextInput
// a general purpose text input field that allows you to pass in the validation rules as props. It uses
// vee-validate for validation
import { defineComponent, computed, watch } from "vue";
import { useField } from "vee-validate";

export default defineComponent({
  name: "TextInput",
  props: {
    // set to true if this a required field, else false
    required:{
      type: Boolean,
      required: true,
    },
    // minimum length accepted
    minLength: {
      type: Number,
      required: true,
    },
    // maximum characters accepted
    maxLength: {
      type: Number,
      required: true,
    },
    // the name of the field. Used be vee-validate to identify this field within a form
    fieldName: {
      type: String,
      default: 'field',
    }
  },
  // once this field has valid data, the "isValid" event will be emitted
  emits: ['isValid'],

  setup(props, context) {

    // the validation rules for this input
    const validationRules = {
      required: props.required,
      min: props.minLength,
      max: props.maxLength,
    }

    const { errorMessage, value, meta, handleChange } = useField<string>(props.fieldName, validationRules, { initialValue: ''});

    function isFieldValid() {
      console.log(`value=${value.value}   dirty=${meta.dirty}  valid=${meta.valid}`);
      context.emit('isValid', { value, valid: meta.valid });
    }

    watch(value, (oldVal, newVal) => {
      context.emit('isValid', { value, valid: meta.valid});
    });


    const validationListeners = computed(() => {
      // If the field is valid or has not been validated yet
      // lazy
      if (!errorMessage.value) {
        return {
          blur: handleChange,
          change: handleChange,
          input: handleChange,
        };
      }

      // Aggressive
      return {
        blur: handleChange,
        change: handleChange,
        input: handleChange, // only switched this
      };
    });

    return {
      errorMessage,
      value,
      validationListeners,
      isFieldValid,
    };

  }
})
</script>

<template>
  <input
      v-bind="$attrs"
      :value="value"
      type="text"
      v-on="validationListeners"
  />
  <p class="text-sm font-medium italic md:text-base text-red-400">{{ errorMessage }}</p>
</template>

<style scoped>

</style>
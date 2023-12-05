<template>
  <div :class="$style['labeled-input-text']">
    <input
      :class="$style['input-text']"
      :type="inputType"
      :id="inputId"
      placeholder=" "
      :value="inputText"
      @input="(event) => (inputText = (event.target as HTMLInputElement).value)"
    />
    <label :class="$style['input-label']" :for="inputId"
      ><small>{{ labelText }}</small></label
    >
    <small :class="$style['warn']" v-if="isShowWarn">{{ warnText }}</small>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUniqueIdStore } from '@/stores/UniqueIdStore';

export default defineComponent({
  name: 'LabeledInputText',
  props: {
    inputType: {
      type: String,
      required: true
    },
    labelText: {
      type: String,
      required: true
    },
    warnText: {
      type: String
    },
    isShowWarnText: {
      type: Boolean,
      default: false
    },
    defaultText: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      inputText: '',
      inputId: ''
    };
  },
  computed: {
    isShowWarn() {
      return this.isShowWarnText;
    }
  },
  watch: {
    inputText(newText) {
      this.$emit('input-text', newText);
    }
  },
  mounted() {
    const store = useUniqueIdStore();
    const id = store.getId();
    this.inputId = `input-id-${id}`;
    this.inputText = this.defaultText ?? '';
  }
});
</script>

<style module lang="scss">
.labeled-input-text {
  position: relative;
  padding-top: 0.5rem;
  margin-top: 1.5rem;

  .input-text {
    border: none;

    &:focus {
      outline: none;
    }
  }

  .input-label {
    position: absolute;
    left: 0;
    color: gray;
    transition: all 300ms ease-in-out;
  }

  .warn {
    position: absolute;
    color: red;
    right: 0;
  }

  &:focus-within .input-label,
  .input-text:not(:placeholder-shown) + .input-label {
    transform: translateY(-20px);
  }

  &:focus-within .input-label {
    color: blue;
  }

  &:focus-within {
    border-bottom: 1px solid blue;
  }
}
</style>

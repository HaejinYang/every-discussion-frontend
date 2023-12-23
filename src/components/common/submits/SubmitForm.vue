<template>
  <div :class="$style['submit-form']">
    <div :class="$style['header']">
      <slot name="header" />
    </div>
    <div :class="$style['content']">
      <slot name="content" />
    </div>
    <div :class="$style['footer']">
      <slot name="footer" />
    </div>
    <div :class="$style['submit']">
      <button :class="$style['btn']" @mousedown.left="onSubmit">{{ btnMsg }}</button>
      <WaitAnimation v-show="isSubmitWaiting" />
      <small :class="$style['end']">{{ submitResultMsg }}</small>
    </div>
    <div :class="$style['extra']">
      <slot name="extra" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WaitAnimation from '@/components/common/animations/WaitAnimation.vue';

export default defineComponent({
  name: 'SubmitForm',
  emits: ['on-submit'],
  components: { WaitAnimation },
  props: {
    btnMsg: {
      type: String,
      required: true
    },
    submitResultMsg: {
      type: String,
      required: true
    },
    isSubmitWaiting: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onSubmit() {
      this.$emit('on-submit');
    }
  }
});
</script>

<style module lang="scss">
.submit-form {
  padding: 1rem;
  width: 360px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

  > * {
    width: 90%;
    padding-bottom: 0.5rem;
  }

  > *:first-child {
    margin-top: 0.5rem;
    border-bottom: none;
  }

  .header {
  }

  .content {
    > * {
      border-bottom: $border-weak-line;
    }
  }

  .footer, .extra {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .submit {
    border-bottom: none;
    position: relative;
    padding-bottom: 0;

    .btn {
      width: 100%;
      min-height: 2.2rem;
      padding: 0.5rem;
      border: none;
      color: white;
      font-weight: bold;
      background-color: $primary-color;
      filter: brightness(100%);
      border-radius: 5px;

      &:hover {
        cursor: pointer;
        filter: brightness(85%);
      }
    }

    .end {
      color: red;
    }
  }
}
</style>

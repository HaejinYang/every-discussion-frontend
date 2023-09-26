<template>
  <div :class="$style['container']">
    <h2>오류 발생!</h2>
    <p :class="$style['msg']">{{ msg }}.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorView',
  props: {
    msg: {
      type: String,
      required: true
    }
  }
});
</script>

<style module lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  > * {
    padding: 1rem;
  }

  h2 {
    margin-top: 1rem;
    color: red;
  }

  .msg {
    font-weight: bold;
  }
}
</style>

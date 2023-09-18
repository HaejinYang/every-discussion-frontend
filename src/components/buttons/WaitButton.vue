<template>
  <div :class="$style.container">
    <img src="@/assets/spinner-white.svg" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WaitButton'
});
</script>

<style module lang="scss">
.container {
  > img {
    position: absolute;
    object-fit: contain;
    height: 100%;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

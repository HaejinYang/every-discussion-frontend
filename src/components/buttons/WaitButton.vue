<template>
  <div :class="$style.container">
    <img src="@/assets/spinner-white.svg" :class="currentPoision" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type alignPosition = 'left' | 'middle' | 'right';

export default defineComponent({
  name: 'WaitButton',
  props: {
    position: {
      type: String as PropType<alignPosition>,
      default: 'middle'
    }
  },
  computed: {
    currentPoision() {
      if (this.position === 'left') {
        return this.$style['left'];
      }

      if (this.position === 'middle') {
        return this.$style['middle'];
      }

      if (this.position === 'right') {
        return this.$style['right'];
      }

      return this.$style['middle'];
    }
  }
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
  }

  .left {
    left: 0;
    transform: translate(-40%, -50%);
  }

  .middle {
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .right {
    right: 0;
    transform: translate(40%, -50%);
  }
}
</style>

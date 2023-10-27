<template>
  <div :class="$style.container">
    <img
      :src="spinnerImgUrl"
      :class="
        position === 'middle'
          ? $style['middle']
          : position === 'left'
          ? $style['left']
          : $style['right']
      "
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

type AlignPosition = 'left' | 'middle' | 'right';
type SpinnerColor = 'black' | 'white';

export default defineComponent({
  name: 'WaitAnimation',
  props: {
    position: {
      type: String as PropType<AlignPosition>,
      default: 'middle'
    },
    color: {
      type: String as PropType<SpinnerColor>,
      default: 'white'
    }
  },
  computed: {
    spinnerImgUrl() {
      if (this.color === 'black') {
        console.log('black');
        return new URL('/src/assets/spinner-black.svg', import.meta.url).toString();
      }

      return new URL('/src/assets/spinner-white.svg', import.meta.url).toString();
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

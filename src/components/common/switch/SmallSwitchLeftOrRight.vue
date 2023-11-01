<template>
  <span :class="$style['small-switch-left-or-right']">
    <small v-if="isShowLeftt" @mousedown.left="onClickSwitch('left')">{{ leftText }} </small>
    <small v-if="select === 'both'"> / </small>
    <small v-if="isShowRight" @mousedown.left="onClickSwitch('right')">{{ rightText }}</small>
  </span>
</template>

<script lang="ts">
import type { PropType } from 'vue';

type SmallSwitchSelect = 'left' | 'right' | 'both';

export default {
  name: 'SmallSwitchLeftOrRight',
  emits: ['on-click-left-switch', 'on-click-right-switch'],
  props: {
    select: {
      type: String as PropType<SmallSwitchSelect>,
      required: true,
      default: 'both'
    },
    leftText: {
      type: String,
      required: true
    },
    rightText: {
      type: String,
      required: true
    }
  },
  computed: {
    isShowLeftt() {
      return this.select === 'both' || this.select === 'left';
    },
    isShowRight() {
      return this.select === 'both' || this.select === 'right';
    }
  },
  methods: {
    onClickSwitch(select: SmallSwitchSelect) {
      if (select === 'left') {
        this.$emit('on-click-left-switch');
      }

      if (select === 'right') {
        this.$emit('on-click-right-switch');
      }
    }
  }
};
</script>

<style module lang="scss">
.small-switch-left-or-right {
  color: gray;
  font-weight: lighter;

  > small {
    &:hover {
      cursor: pointer;
      color: blue;
    }

    &:nth-of-type(even) {
      cursor: default;
      color: gray;
    }
  }
}
</style>

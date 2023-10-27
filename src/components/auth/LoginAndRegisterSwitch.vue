<template>
  <span :class="$style['login-and-register-switch']">
    <small v-if="select === 'both' || select === 'register'" @mousedown.left="switchRegisterForm"
      >회원가입</small
    >
    <small v-if="select === 'both'"> / </small>
    <small v-if="select === 'both' || select === 'login'" @mousedown.left="switchLoginForm"
      >로그인</small
    >
  </span>
</template>

<script lang="ts">
import type { PropType } from 'vue';

type LoginAndRegisterSelect = 'login' | 'register' | 'both';

export default {
  name: 'LoginAndRegisterSwitch',
  props: {
    select: {
      type: String as PropType<LoginAndRegisterSelect>,
      required: true,
      default: 'both'
    }
  },
  methods: {
    switchRegisterForm() {
      this.$emit('switch-register-form');
    },
    switchLoginForm() {
      this.$emit('switch-login-form');
    }
  }
};
</script>

<style module lang="scss">
.login-and-register-switch {
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

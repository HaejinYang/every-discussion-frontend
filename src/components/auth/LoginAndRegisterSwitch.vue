<template>
  <span :class="$style['login-and-register-switch']">
    <small v-if="isShowRegister" @mousedown.left="authFromStore.show(eAuthForm.Register)"
      >회원가입</small
    >
    <small v-if="select === 'both'"> / </small>
    <small v-if="isShowLogin" @mousedown.left="authFromStore.show(eAuthForm.Login)">로그인</small>
  </span>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { eAuthForm, useAuthFromStore } from '@/stores/AuthFormStore';

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
  data() {
    return {
      authFromStore: useAuthFromStore()
    };
  },
  computed: {
    eAuthForm() {
      return eAuthForm;
    },
    isShowRegister() {
      return this.select === 'both' || this.select === 'register';
    },
    isShowLogin() {
      return this.select === 'both' || this.select === 'login';
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

<template>
  <span :class="$style['find-account-and-password-switch']">
    <small v-if="isShowFindAccount" @mousedown.left="authFormStore.show(eAuthForm.FindAccount)"
      >아이디 {{ select === 'account' ? '찾기' : '' }}</small
    >
    <small v-if="select === 'both'"> / </small>
    <small v-if="isShowFindPassword" @mousedown.left="authFormStore.show(eAuthForm.FindPassword)"
      >비밀번호 찾기</small
    >
  </span>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { eAuthForm, useAuthFromStore } from '@/stores/AuthFormStore';

type FindAccountAndPasswordSelect = 'account' | 'password' | 'both';

export default {
  name: 'FindAccountAndPasswordSwitch',
  props: {
    select: {
      type: String as PropType<FindAccountAndPasswordSelect>,
      required: true,
      default: 'both'
    }
  },
  data() {
    return {
      authFormStore: useAuthFromStore()
    };
  },
  computed: {
    eAuthForm() {
      return eAuthForm;
    },
    isShowFindAccount() {
      return this.select === 'both' || this.select === 'account';
    },
    isShowFindPassword() {
      return this.select === 'both' || this.select === 'password';
    }
  }
};
</script>

<style module lang="scss">
.find-account-and-password-switch {
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

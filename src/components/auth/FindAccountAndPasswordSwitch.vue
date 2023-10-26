<template>
  <span>
    <small v-if="select === 'both' || select === 'account'" @mousedown.left="switchFindAccountForm"
      >아이디 {{ select === 'account' ? '찾기' : '' }}</small
    >
    <small v-if="select === 'both'"> / </small>
    <small
      v-if="select === 'both' || select === 'password'"
      @mousedown.left="switchFindPasswordForm"
      >비밀번호 찾기</small
    >
  </span>
</template>

<script lang="ts">
import type { PropType } from 'vue';

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
  methods: {
    switchFindAccountForm() {
      this.$emit('switch-find-account-form');
    },
    switchFindPasswordForm() {
      this.$emit('switch-find-password-form');
    }
  }
};
</script>

<style module lang="scss">
span {
  color: gray;
  font-weight: lighter;

  small {
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

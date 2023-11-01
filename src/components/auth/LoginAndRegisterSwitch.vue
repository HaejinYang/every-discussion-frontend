<template>
  <SmallSwitchLeftOrRight
    rightText="로그인"
    leftText="회원가입"
    :select="currentSelect"
    @on-click-left-switch="authFormStore.show(eAuthForm.Register)"
    @on-click-right-switch="authFormStore.show(eAuthForm.Login)"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { eAuthForm, useAuthFormStore } from '@/stores/AuthFormStore';
import SmallSwitchLeftOrRight from '@/components/common/switch/SmallSwitchLeftOrRight.vue';

type LoginAndRegisterSelect = 'login' | 'register' | 'both';

export default {
  name: 'LoginAndRegisterSwitch',
  components: { SmallSwitchLeftOrRight },
  props: {
    select: {
      type: String as PropType<LoginAndRegisterSelect>,
      required: true,
      default: 'both'
    }
  },
  data() {
    return {
      authFormStore: useAuthFormStore()
    };
  },
  computed: {
    currentSelect() {
      if (this.select === 'register') {
        return 'left';
      }

      if (this.select === 'login') {
        return 'right';
      }

      return 'both';
    },
    eAuthForm() {
      return eAuthForm;
    }
  }
};
</script>

<style module lang="scss"></style>

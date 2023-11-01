<template>
  <SmallSwitchLeftOrRight
    :leftText="currentFindAccountText"
    rightText="비밀번호 찾기"
    :select="currentSelect"
    @on-click-left-switch="authFormStore.show(eAuthForm.FindAccount)"
    @on-click-right-switch="authFormStore.show(eAuthForm.FindPassword)"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { eAuthForm, useAuthFormStore } from '@/stores/AuthFormStore';
import SmallSwitchLeftOrRight from '@/components/common/switch/SmallSwitchLeftOrRight.vue';

type FindAccountAndPasswordSelect = 'account' | 'password' | 'both';

export default {
  name: 'FindAccountAndPasswordSwitch',
  components: { SmallSwitchLeftOrRight },
  props: {
    select: {
      type: String as PropType<FindAccountAndPasswordSelect>,
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
      if (this.select === 'account') {
        return 'left';
      }

      if (this.select === 'password') {
        return 'right';
      }

      return 'both';
    },
    currentFindAccountText() {
      if (this.select === 'account' || this.select === 'password') {
        return '아이디 찾기';
      }

      return '아이디';
    },
    eAuthForm() {
      return eAuthForm;
    }
  }
};
</script>

<style module lang="scss"></style>

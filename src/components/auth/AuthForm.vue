<template>
  <ModalContainer
    v-if="authFormStore.selectedAuthForm !== eAuthForm.NotSelected"
    @on-click-white-space="onClickWhiteSpaceInModal"
  >
    <RegisterForm v-if="authFormStore.selectedAuthForm === eAuthForm.Register" />
    <LoginForm v-if="authFormStore.selectedAuthForm === eAuthForm.Login" />
    <FindAccountForm v-if="authFormStore.selectedAuthForm === eAuthForm.FindAccount" />
    <FindPasswordForm v-if="authFormStore.selectedAuthForm === eAuthForm.FindPassword" />
  </ModalContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModalContainer from '@/components/common/modals/ModalContainer.vue';
import { eAuthForm, useAuthFormStore } from '@/stores/AuthFormStore';
import RegisterForm from '@/components/auth/RegisterForm.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import FindAccountForm from '@/components/auth/FindAccountForm.vue';
import FindPasswordForm from '@/components/auth/FindPasswordForm.vue';
import KakaoLogin from "@/components/auth/login/KakaoLogin.vue";

export default defineComponent({
  name: 'AuthForm',
  components: { FindPasswordForm, FindAccountForm, LoginForm, RegisterForm, ModalContainer },
  data() {
    return {
      authFormStore: useAuthFormStore()
    };
  },
  computed: {
    eAuthForm() {
      return eAuthForm;
    }
  },
  methods: {
    onClickWhiteSpaceInModal() {
      this.authFormStore.hide();
    }
  }
});
</script>

<style module lang="scss"></style>

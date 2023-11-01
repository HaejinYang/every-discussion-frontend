<template>
  <div :class="$style.container">
    <Header :class="$style.header" @show-login="switchLoginForm" />
    <section>
      <Aside :class="$style.aside" />
      <main ref="main">
        <div :class="$style['main-item']">
          <RouterView />
        </div>
      </main>
    </section>
    <div v-if="isShowAuthForm" @mousedown.left="hideAuthForm">
      <RegisterForm
        @switch-login-form="switchLoginForm"
        @switch-find-account-form="switchFindAccountForm"
        @switch-find-password-form="switchFindPasswordForm"
        @register-success="switchLoginForm"
        v-show="isShowRegisterForm"
      />
      <LoginForm
        @switch-register-form="switchRegisterForm"
        @switch-find-account-form="switchFindAccountForm"
        @switch-find-password-form="switchFindPasswordForm"
        @close-form="hideAuthForm"
        v-show="isShowLoginForm"
      />
      <FindAccountForm
        @switch-register-form="switchRegisterForm"
        @switch-login-form="switchLoginForm"
        @switch-find-password-form="switchFindPasswordForm"
        v-show="isShowFindAccountForm"
      />
      <FindPasswordForm
        @switch-register-form="switchRegisterForm"
        @switch-login-form="switchLoginForm"
        @switch-find-account-form="switchFindAccountForm"
        v-show="isShowFindPasswordForm"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/layouts/Header.vue';
import Aside from '@/components/layouts/Aside.vue';
import { RouterView } from 'vue-router';
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';
import { eAuthForm, useAuthFromStore } from '@/stores/AuthFormStore';
import FindAccountForm from '@/components/auth/FindAccountForm.vue';
import FindPasswordForm from '@/components/auth/FindPasswordForm.vue';

export default defineComponent({
  name: 'App',
  components: {
    FindPasswordForm,
    FindAccountForm,
    RegisterForm,
    LoginForm,
    Aside,
    Header,
    RouterView
  },
  computed: {
    isShowAuthForm() {
      const store = useAuthFromStore();
      return store.isShow;
    },
    isShowLoginForm() {
      const store = useAuthFromStore();
      return store.isShow && store.selectedAuthForm === eAuthForm.Login;
    },
    isShowRegisterForm() {
      const store = useAuthFromStore();
      return store.isShow && store.selectedAuthForm === eAuthForm.Register;
    },
    isShowFindAccountForm() {
      const store = useAuthFromStore();
      return store.isShow && store.selectedAuthForm === eAuthForm.FindAccount;
    },
    isShowFindPasswordForm() {
      const store = useAuthFromStore();
      return store.isShow && store.selectedAuthForm === eAuthForm.FindPassword;
    }
  },
  methods: {
    switchLoginForm() {
      const store = useAuthFromStore();
      store.show(eAuthForm.Login);
    },
    switchRegisterForm() {
      const store = useAuthFromStore();
      store.show(eAuthForm.Register);
    },
    switchFindAccountForm() {
      const store = useAuthFromStore();
      store.show(eAuthForm.FindAccount);
    },
    switchFindPasswordForm() {
      const store = useAuthFromStore();
      store.show(eAuthForm.FindPassword);
    },
    hideAuthForm() {
      const store = useAuthFromStore();
      store.hide();
    }
  }
});
</script>

<style module lang="scss">
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    height: 3rem;
  }

  section {
    display: flex;
    flex: 1;

    main {
      flex: 1;
      position: relative;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }

      .main-item {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        border-top: 0;
      }
    }

    .aside {
      flex: 0 75px;
      overflow-y: unset;
    }

    @media screen and (min-width: $middle-size) {
      .aside {
        flex: 0 250px;
      }
    }
  }
}
</style>

<template>
  <div :class="$style.container">
    <Header :class="$style.header" @show-login="showAuthForm" />
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
        @register-success="switchLoginForm"
        v-show="!isShowLoginForm"
      />
      <LoginForm
        @switch-register-form="switchRegisterForm"
        @close-form="hideAuthForm"
        v-show="isShowLoginForm"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/layouts/Header.vue';
import Aside from '@/components/layouts/Aside.vue';
import { RouterView } from 'vue-router';
import { useMainWheelHandler } from '@/stores/MainWheel';
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';
import { useShowAuthFormHandler } from '@/stores/ShowAuthForm';

export default defineComponent({
  name: 'App',
  components: { RegisterForm, LoginForm, Aside, Header, RouterView },
  computed: {
    isDisabledWheel() {
      const handler = useMainWheelHandler();
      return handler.isDisabled;
    },
    isShowLoginForm() {
      const handler = useShowAuthFormHandler();
      return handler.isShowLogin;
    },
    isShowAuthForm() {
      const handler = useShowAuthFormHandler();
      return handler.isShowAuth;
    }
  },
  methods: {
    switchLoginForm() {
      const handler = useShowAuthFormHandler();
      handler.showLogin();
    },
    switchRegisterForm() {
      const handler = useShowAuthFormHandler();
      handler.hideLogin();
    },
    showAuthForm() {
      const handler = useShowAuthFormHandler();
      handler.showAuth();
    },
    hideAuthForm() {
      const handler = useShowAuthFormHandler();
      handler.hideAuth();
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

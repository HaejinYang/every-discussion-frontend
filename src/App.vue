<template>
  <div :class="$style.container">
    <Header :class="$style.header" />
    <section>
      <Aside :class="$style.aside" />
      <main ref="main">
        <div :class="$style['main-item']">
          <RouterView />
        </div>
      </main>
    </section>
    <div v-if="authFormStore.isShow" @mousedown.left="authFormStore.hide">
      <RegisterForm v-show="authFormStore.isShowRegister()" />
      <LoginForm v-show="authFormStore.isShowLogin()" @close-form="authFormStore.hide" />
      <FindAccountForm v-show="authFormStore.isShowFindAccount()" />
      <FindPasswordForm v-show="authFormStore.isShowFindPassword()" />
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
import { useAuthFormStore } from '@/stores/AuthFormStore';
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
  data() {
    return {
      authFormStore: useAuthFormStore()
    };
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

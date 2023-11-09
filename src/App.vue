<template>
  <div :class="$style.container">
    <Header :class="$style.header" />
    <section>
      <Aside :class="$style.aside" />
      <main ref="main" @scroll="handleScroll($event)">
        <div :class="$style['main-item']">
          <RouterView />
        </div>
      </main>
    </section>
    <AuthForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/layouts/Header.vue';
import Aside from '@/components/layouts/Aside.vue';
import { RouterView } from 'vue-router';
import AuthForm from '@/components/auth/AuthForm.vue';
import { useMainScrollStore } from '@/stores/MainScrollStore';

export default defineComponent({
  name: 'App',
  components: {
    AuthForm,
    Aside,
    Header,
    RouterView
  },
  methods: {
    handleScroll(event: Event) {
      const { scrollHeight, scrollTop, clientHeight } = event.target as HTMLElement;
      const store = useMainScrollStore();
      store.move(scrollHeight, scrollTop, clientHeight);
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

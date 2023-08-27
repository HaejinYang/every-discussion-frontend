<template>
  <div :class="$style.container">
    <Header :class="$style.header" />
    <section>
      <Aside :class="$style.aside" />
      <main @wheel="handleWheel($event)" ref="main">
        <div :class="$style['main-item']">
          <RouterView />
        </div>
      </main>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/layouts/Header.vue';
import Aside from '@/components/layouts/Aside.vue';
import { RouterView } from 'vue-router';
import { useMainWheelHandler } from '@/stores/MainWheel';

export default defineComponent({
  name: 'App',
  components: { Aside, Header, RouterView },
  computed: {
    isDisabledWheel() {
      const mainWheelHandler = useMainWheelHandler();
      return mainWheelHandler.isDisabled;
    }
  },
  methods: {
    handleWheel(event) {
      if (this.isDisabledWheel) {
        event.preventDefault();

        return;
      }

      this.adjustWheelTop();
    },
    onResize() {
      this.adjustWheelTop();
    },
    adjustWheelTop() {
      const mainItem = this.$refs['main'] as HTMLElement | undefined;
      if (mainItem) {
        setTimeout(() => {
          const mainWheelHandler = useMainWheelHandler();
          mainWheelHandler.changeTop(mainItem.scrollTop);
        }, 200);
      }
    }
  },
  created() {
    window.addEventListener('resize', this.onResize);
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

<template>
    <div :class="$style.container">
        <Header :class="$style.header"/>
        <section>
            <Aside :class="$style.aside"/>
            <main>
                <RouterView/>
            </main>
        </section>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Header from "@/components/layouts/Header.vue";
import Aside from "@/components/layouts/Aside.vue";
import {RouterView} from "vue-router";

export default defineComponent({
    name: 'App',
    components: {Aside, Header, RouterView},
})
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
    }

    .aside {
      flex: 0 75px;
    }

    @media screen and (min-width: $middle-size) {
      .aside {
        flex: 0 250px;
      }
    }
  }
}
</style>

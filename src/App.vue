<template>
    <div :class="$style.container">
        <Header :class="$style.header"/>
        <section>
            <Aside :class="$style.aside"/>
            <main>main</main>
        </section>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Header from "@/components/layouts/Header.vue";
import Aside from "@/components/layouts/Aside.vue";

export default defineComponent({
    name: 'App',
    components: {Aside, Header},
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

<template>
    <div :class="$style.container">
        <header>header</header>
        <section>
            <aside :class="$style['aside-left']">
                <nav>nav</nav>
                <p></p>
                <footer>footer</footer>
            </aside>
            <main>main</main>
        </section>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: 'App',
    components: {},
})
</script>

<style module lang="scss">
.container {
  min-height: 100vh;
  background: #ccc;
  display: flex;
  flex-direction: column;

  header {
    height: 3rem;
    background: #777;
    color: white;
  }

  section {
    display: flex;
    flex: 1;
    background: #999;
    color: #000;

    aside {
      flex: 0 100px;

      display: flex;
      flex-direction: column;

      > * {
        flex: 1;
      }
    }

    main {
      flex: 1;
    }

    @media screen and (min-width: $middle-size) {
      aside {
        flex: 0 250px;
      }
    }
  }
}
</style>

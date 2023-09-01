<template>
  <div :class="$style.container">
    <div v-for="index in 10">
      <p>
        Lorem ipsum dolor sit amet. Qui quis rerum ut quis dolorem et ullam esse ad quas illum aut
        consequatur consequuntur et aliquid voluptas id quia autem.
      </p>
      <p>참여자수 11</p>
      <p>의견수 12</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MyTopics'
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-flow: row wrap;

  > div {
    max-width: 250px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    margin: 1rem;
    box-shadow: $box-shadow-normal;

    > p {
      border-bottom: $border-weak-line;
      width: 100%;
      text-align: left;
      padding: 0.5rem;
    }

    &:hover {
      cursor: pointer;
      box-shadow: $box-shadow-strong;
    }
  }
}
</style>

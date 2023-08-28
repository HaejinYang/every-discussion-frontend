<template>
  <div :class="$style.container">
    <ul>
      <li
        :class="opinion.agreeingType === 'agree' ? $style.agree : $style.disagree"
        v-for="opinion in opinions"
        :key="opinion.id"
      >
        <p>{{ opinion.title }}</p>
        <p>추천{{ opinion.like }} 비추천{{ opinion.dislike }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { Opinion } from '@/services/opinions';

export default defineComponent({
  name: 'OpinionList',
  props: {
    opinions: {
      type: Array as PropType<Opinion[]>,
      required: true
    }
  }
});
</script>

<style module lang="scss">
.container {
  > ul {
    > li {
      list-style: none;

      > p {
        padding: 0.5rem;
        margin: 0.5rem;
        border-bottom: $border-weak-line;
      }
    }
  }
}

.agree {
  background-color: $agree-background-color;
}

.disagree {
  background-color: $disagree-background-color;
}
</style>

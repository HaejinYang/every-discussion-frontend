<template>
  <div :class="$style.container">
    <ul>
      <li
        :class="opinion.agreeType === 'agree' ? $style.agree : $style.disagree"
        v-for="(opinion, index) in opinions"
        :key="opinion.id"
        ref="opinions"
      >
        <p>{{ opinion.title }}</p>
        <p>추천{{ opinion.like }} 비추천{{ opinion.dislike }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { OpinionData } from '@/services/opinions';

export default defineComponent({
  name: 'OpinionList',
  props: {
    opinions: {
      type: Array as PropType<OpinionData[]>,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {}
});
</script>

<style module lang="scss">
.container {
  > ul {
    display: flex;
    flex-direction: column;
    align-items: center;

    > li {
      list-style: none;
      width: 50%;
      margin: 1rem;

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

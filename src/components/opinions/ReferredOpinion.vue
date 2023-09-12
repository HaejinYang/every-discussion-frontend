<template>
  <div :class="$style.container">
    <ul>
      <li
        :class="[opinion.agreeType === 'agree' ? $style.agree : $style.disagree]"
        v-for="opinion in referredOpinions"
        :key="opinion.id"
      >
        <p>{{ opinion.title.substring(0, 20).concat('...') }}</p>
        <p>추천{{ opinion.like }} 비추천{{ opinion.dislike }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { ReferredOpinion } from '@/services/opinions';

export default defineComponent({
  name: 'ReferredOpinion',
  props: {
    referredOpinions: {
      type: Array as PropType<ReferredOpinion[]>,
      required: true
    }
  }
});
</script>

<style module lang="scss">
.container {
  ul {
    li {
      list-style: none;
      padding: 0.5rem;

      p {
        padding: 0.5rem;
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

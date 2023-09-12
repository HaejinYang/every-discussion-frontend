<template>
  <div :class="[$style.container, opinion.agreeType === 'agree' ? $style.agree : $style.disagree]">
    <p>{{ opinion.title.substring(0, 20).concat('...') }}</p>
    <p>{{ opinion.summary }}</p>
    <p>추천{{ opinion.like }}, 비추천{{ opinion.dislike }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { ReferToOpinion } from '@/services/opinions';

export default defineComponent({
  name: 'ReferToOpinion',
  props: {
    opinion: {
      type: Object as PropType<ReferToOpinion>,
      required: true
    }
  }
});
</script>

<style module lang="scss">
.container {
  p {
    margin: 0.5rem;
    padding: 0.5rem;
    border-bottom: $border-weak-line;
  }
}

.agree {
  background-color: $agree-background-color;
}

.disagree {
  background-color: $disagree-background-color;
}
</style>

<template>
  <div :class="[$style.container, opinion.agreeType === 'agree' ? $style.agree : $style.disagree]">
    <div @mousedown.left="onClickOpinion">
      <p>참조한 의견</p>
      <fieldset>
        <legend>타이틀</legend>
        <p>{{ opinion.title.substring(0, 20).concat('...') }}</p>
      </fieldset>
      <fieldset>
        <legend>요약</legend>
        <p>{{ opinion.summary }}</p>
      </fieldset>
      <fieldset>
        <legend>추천</legend>
        <p>추천{{ opinion.like }}, 비추천{{ opinion.dislike }}</p>
      </fieldset>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type OpinionData } from '@/services/opinions';
import { useDiscussionStore } from '@/stores/DiscussionStore';

export default defineComponent({
  name: 'ReferToOpinion',
  props: {
    opinion: {
      type: Object as PropType<OpinionData>,
      required: true
    }
  },
  methods: {
    onClickOpinion() {
      this.moveToOpinion();
    },
    moveToOpinion() {
      const store = useDiscussionStore();
      store.showOpinionDetail(this.opinion.id);
    }
  }
});
</script>

<style module lang="scss">
.container {
  color: white;
  height: 100%;

  div {
    padding: 0.5rem;
    background-color: inherit;

    > p {
      text-align: center;
    }

    fieldset {
      margin-top: 0.5rem;
      border: $border-weak-line;

      p {
        padding: 0.5rem;
      }
    }

    &:hover {
      cursor: pointer;
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

<template>
  <div :class="$style.container">
    <ul>
      <li
        :class="[opinion.agreeType === 'agree' ? $style.agree : $style.disagree]"
        v-for="(opinion, index) in referredOpinions"
        :key="opinion.id"
        @mousedown.left="onClickOpinion(opinion.id)"
      >
        <p>참조된 의견</p>
        <fieldset>
          <legend>의견 {{ index + 1 }}</legend>
          <fieldset>
            <legend>타이틀</legend>
            <p>{{ opinion.title }}</p>
          </fieldset>
          <fieldset>
            <legend>추천</legend>
            <p>추천{{ opinion.like }} 비추천{{ opinion.dislike }}</p>
          </fieldset>
        </fieldset>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type OpinionData } from '@/services/opinions';
import { useDiscussionStore } from '@/stores/DiscussionStore';

export default defineComponent({
  name: 'ReferredOpinion',
  props: {
    referredOpinions: {
      type: Array as PropType<OpinionData[]>,
      required: true
    }
  },
  methods: {
    onClickOpinion(id: number) {
      this.moveToOpinion(id);
    },
    moveToOpinion(id: number) {
      const store = useDiscussionStore();
      store.showOpinionDetail(id);
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
      color: white;

      > p {
        text-align: center;
      }

      fieldset {
        border: $border-weak-line;
        padding: 0.5rem;

        fieldset {
          border: $border-weak-line;
          margin-top: 0.5rem;

          p {
            padding: 0.5rem;
          }
        }
      }

      &:hover {
        cursor: pointer;
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

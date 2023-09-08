<template>
  <div :class="$style.container">
    <ul>
      <li
        :class="opinion.agreeType === 'agree' ? $style.agree : $style.disagree"
        v-for="(opinion, index) in opinions"
        :key="opinion.id"
        @mousedown.left="displayOpinion(index)"
        ref="opinions"
      >
        <p>{{ opinion.title }}</p>
        <p>추천{{ opinion.like }} 비추천{{ opinion.dislike }}</p>
      </li>
    </ul>
  </div>
  <div>
    <Opinion
      @on-click-anywhere="onClickDetailOpinion"
      v-if="isDisplayOpinionDetail"
      :left="leftDetailOpinion"
      :top="topDetailOpinion"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { Opinion } from '@/services/opinions';
import Opinion from '@/components/opinions/Opinion.vue';
import { useMainWheelHandler } from '@/stores/MainWheel';

export default defineComponent({
  name: 'OpinionList',
  components: { Opinion },
  props: {
    opinions: {
      type: Array as PropType<Opinion[]>,
      required: true
    }
  },
  data() {
    return {
      isDisplayOpinionDetail: false,
      leftDetailOpinion: 0,
      topDetailOpinion: 0
    };
  },
  methods: {
    displayOpinion(index: number) {
      const opinions = this.$refs['opinions'] as HTMLElement[];
      const opinion = opinions[index];
      if (opinion) {
        const rect = opinion.getBoundingClientRect();
        const mainWheelHandler = useMainWheelHandler();
        this.topDetailOpinion = window.innerHeight / 2;
        this.isDisplayOpinionDetail = true;
        mainWheelHandler.disableWheel();
      }
    },
    onClickDetailOpinion() {
      const mainWheelHandler = useMainWheelHandler();
      mainWheelHandler.enableWheel();
      this.isDisplayOpinionDetail = false;
    }
  }
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

<template>
  <div :class="$style.container">
    <ul>
      <li
        :class="opinion.agreeType === 'agree' ? $style.agree : $style.disagree"
        v-for="(opinion, index) in opinions"
        :key="opinion.id"
        @mousedown.left="displayOpinion(index, opinion.id)"
        ref="opinions"
      >
        <p>{{ opinion.title }}</p>
        <p>추천{{ opinion.like }} 비추천{{ opinion.dislike }}</p>
      </li>
    </ul>
  </div>
  <div>
    <OpinionItem
      @on-click-anywhere="onClickDetailOpinion"
      v-if="isDisplayOpinionDetail"
      :left="leftDetailOpinion"
      :top="topDetailOpinion"
      :opinionId="selectedOpinionId"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import OpinionItem from '@/components/opinions/OpinionItem.vue';
import { useMainWheelHandler } from '@/stores/MainWheel';
import type { Opinion } from '@/services/opinions';

export default defineComponent({
  name: 'OpinionList',
  components: { OpinionItem },
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
      topDetailOpinion: 0,
      selectedOpinionId: -1
    };
  },
  methods: {
    displayOpinion(index: number, opinionId: number) {
      const opinions = this.$refs['opinions'] as HTMLElement[];
      const opinion = opinions[index];
      if (opinion) {
        const rect = opinion.getBoundingClientRect();
        const mainWheelHandler = useMainWheelHandler();
        this.topDetailOpinion = window.innerHeight / 2;
        this.selectedOpinionId = opinionId;
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

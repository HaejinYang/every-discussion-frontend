<template>
  <div :class="[$style.container, agreeingType === 'agree' ? $style.agree : $style.disagree]">
    <div :class="$style.title">
      <span>{{ agreeingType === 'agree' ? '찬성' : '반대' }}</span>
    </div>
    <div
      :class="$style.opinion"
      v-for="(opinion, index) in displayedOpinions"
      :key="opinion.id"
      @mousedown.left.stop="onClickOpinion(index, opinion.id)"
      ref="opinions"
    >
      <p>
        {{ opinion.title }}
      </p>
      <div>추천{{ opinion.like }} 비추천{{ opinion.dislike }}</div>
    </div>
    <div :class="$style.more" @mousedown.left="moreOpinions">
      <img src="@/assets/caret.svg" />
    </div>
  </div>
  <div>
    <OpinionItem
      @on-click-anywhere="onClickDetailOpinion"
      v-if="isDisplayOpinionDetail"
      :left="leftDetailOpinion"
      :top="topDetailOpinion"
      :opinionId="lastSelectedOpinionId"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Opinion, type OpinionData } from '@/services/opinions';
import OpinionItem from '@/components/opinions/OpinionItem.vue';
import { useMainWheelHandler } from '@/stores/MainWheel';
import { debounce } from '@/util/timing';
import { useSearchOpinionHandler } from '@/stores/SearchOpinion';

export default defineComponent({
  name: 'Discussion',
  components: { OpinionItem },
  props: {
    agreeingType: {
      type: String,
      required: true
    },
    topicId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      opinions: [] as OpinionData[],
      displayedOpinions: [] as OpinionData[],
      displayCursor: 0,
      leftDetailOpinion: 0,
      topDetailOpinion: 0,
      isDisplayOpinionDetail: false,
      lastSelectedOpinion: -1,
      lastSelectedOpinionId: -1,
      debouncedResizeHandler: (...args: any[]): any => {}
    };
  },
  methods: {
    async initializeOpinions() {
      const opinions = await Opinion.fetchFromTopic(this.topicId);
      this.opinions = opinions.filter((opinion: OpinionData) => {
        return opinion.agreeType === this.agreeingType;
      });
    },
    displayOpinions() {
      this.displayedOpinions.push(
        ...this.opinions.slice(this.displayCursor, this.displayCursor + 3)
      );
      this.displayCursor += 3;
    },
    moreOpinions() {
      this.displayOpinions();
    },
    onClickOpinion(index: number, opinionId: number) {
      this.displayOpinion(index);
      this.lastSelectedOpinion = index;
      this.lastSelectedOpinionId = opinionId;
    },
    onClickDetailOpinion() {
      const mainWheelHandler = useMainWheelHandler();
      mainWheelHandler.enableWheel();
      this.isDisplayOpinionDetail = false;
      this.lastSelectedOpinion = -1;
    },
    onResize() {
      if (this.lastSelectedOpinion === -1) {
        return;
      }

      this.debouncedResizeHandler();
    },
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
    }
  },
  async created() {
    const searchOpinionHandler = useSearchOpinionHandler();
    searchOpinionHandler.selectTopic(this.topicId);
    await this.initializeOpinions();
    this.displayOpinions();
    this.debouncedResizeHandler = debounce(() => {
      this.displayOpinion(this.lastSelectedOpinion);
    }, 300);

    window.addEventListener('resize', this.onResize);
  }
});
</script>

<style module lang="scss">
.container {
  background-color: #eee;
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;

  .title {
    padding: 1rem 1rem 0 1rem;
    text-align: center;
  }

  .opinion {
    margin: 0.5rem;
    border: $border-weak-line;

    > p,
    div {
      padding: 0.5rem;
      margin: 0.5rem;
      border-bottom: $border-weak-line;
    }

    div {
      text-align: right;
    }
  }

  .more {
    text-align: center;
    padding-bottom: 0.5rem;

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

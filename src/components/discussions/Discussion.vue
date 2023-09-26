<template>
  <div :class="[$style.container, agreeingType === 'agree' ? $style.agree : $style.disagree]">
    <div :class="$style.title">
      <span>{{ agreeingType === 'agree' ? '찬성' : '반대' }}</span>
    </div>
    <div
      v-if="displayedOpinions.length !== 0"
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
    <div v-else :class="$style.opinion">
      <p>의견이 없습니다.</p>
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
import { useDiscussionHandler } from '@/stores/DiscussionHandler';

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
      leftDetailOpinion: 0,
      topDetailOpinion: 0,
      isDisplayOpinionDetail: false,
      lastSelectedOpinion: -1,
      lastSelectedOpinionId: -1,
      debouncedResizeHandler: (...args: any[]): any => {}
    };
  },
  computed: {
    filterKeyword() {
      const handler = useSearchOpinionHandler();
      return handler.filterKeyword;
    }
  },
  watch: {
    filterKeyword() {
      this.displayOpinions();
    }
  },
  methods: {
    async initializeOpinions() {
      const opinions = await Opinion.fetchFromTopic(this.topicId);
      this.opinions = opinions.filter((opinion: OpinionData) => {
        return opinion.agreeType === this.agreeingType;
      });
    },
    displayOpinions() {
      const handler = useSearchOpinionHandler();
      const filtered = this.opinions.filter((opinion) =>
        opinion.title.includes(handler.filterKeyword)
      );
      this.displayedOpinions = [...filtered];
    },
    onClickOpinion(index: number, opinionId: number) {
      console.log('onClickOpinion');
      const handler = useDiscussionHandler();
      handler.foldList();
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
  min-width: 300px;
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
}

.agree {
  background-color: $agree-background-color;
}

.disagree {
  background-color: $disagree-background-color;
}
</style>

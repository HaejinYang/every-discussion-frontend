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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Opinion, type OpinionData } from '@/services/opinions';
import { useSearchOpinionHandler } from '@/stores/SearchOpinion';
import { useDiscussionHandler } from '@/stores/DiscussionHandler';
import { useNewOpinionHandler } from '@/stores/NewOpinion';

export default defineComponent({
  name: 'Discussion',
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
      checkNewOpiniontimerId: -1
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
    displayOpinions() {
      const handler = useSearchOpinionHandler();
      const filtered = this.opinions.filter((opinion) =>
        opinion.title.includes(handler.filterKeyword)
      );
      this.displayedOpinions = [...filtered];
    },
    onClickOpinion(index: number, opinionId: number) {
      const handler = useDiscussionHandler();
      handler.displayOpinionDetailly(opinionId);
    },
    addNewOpinion() {
      const handler = useNewOpinionHandler();
      if (handler.isAdded && handler.topicId === this.topicId && handler.item) {
        if (handler.item.agreeType === this.agreeingType) {
          handler.consume();
          this.opinions.unshift(handler.item);
          this.displayOpinions();
        }
      }
    }
  },
  async created() {
    const opinions = await Opinion.fetchFromTopic(this.topicId);
    this.opinions.push(
      ...opinions.filter((opinion: OpinionData) => {
        return opinion.agreeType === this.agreeingType;
      })
    );
    this.displayOpinions();
  },
  mounted() {
    this.checkNewOpiniontimerId = setInterval(this.addNewOpinion, 1000);
  },
  unmounted() {
    console.log('clear');
    clearInterval(this.checkNewOpiniontimerId);
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
  border-radius: 5px;

  &::-webkit-scrollbar {
    display: none;
  }

  color: white;

  .title {
    padding: 1rem 1rem 0 1rem;
    text-align: center;
  }

  .opinion {
    margin: 0.5rem;
    border: $border-weak-line;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      box-shadow: $box-shadow-full;
    }

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

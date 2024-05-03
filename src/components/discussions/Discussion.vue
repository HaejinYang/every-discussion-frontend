<template>
  <div
    v-show="isShow"
    :class="[$style.container, agreeingType === 'agree' ? $style.agree : $style.disagree]"
  >
    <div :class="$style['title']">
      <span>{{ agreeingType === 'agree' ? '찬성' : '반대' }}</span>
    </div>
    <div v-if="displayedOpinions.length !== 0">
      <div
          :class="$style['opinion']"
          v-for="(opinion, index) in displayedOpinions"
          :key="opinion.id"
          @mousedown.left="onClickOpinion(index, opinion.id)"
          ref="opinions"
      >
        <p>
          {{ opinion.title }}
        </p>
        <div>추천{{ opinion.like }} 비추천{{ opinion.dislike }}</div>
      </div>
    </div>
    <div v-else :class="$style['opinion']">
      <p>의견이 없습니다.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { type OpinionData } from '@/services/opinions';
import { useSearchOpinionStore } from '@/stores/SearchOpinionStore';
import { useDiscussionStore } from '@/stores/DiscussionStore';
import { useNewOpinionStore } from '@/stores/NewOpinionStore';
import { OpinionService } from '@/services/opinions/OpinionService';

export default defineComponent({
  name: 'Discussion',
  emits: ['on-load-completion'],
  props: {
    agreeingType: {
      type: String,
      required: true
    },
    topicId: {
      type: Number,
      required: true
    },
    isShow: {
      type: Boolean,
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
      const store = useSearchOpinionStore();
      return store.filterKeyword;
    }
  },
  watch: {
    filterKeyword() {
      this.displayOpinions();
    }
  },
  methods: {
    displayOpinions() {
      const store = useSearchOpinionStore();
      const filtered = this.opinions.filter((opinion) =>
        opinion.title.includes(store.filterKeyword)
      );
      this.displayedOpinions = [...filtered];
    },
    onClickOpinion(index: number, opinionId: number) {
      const store = useDiscussionStore();
      store.showOpinionDetail(opinionId);
    },
    addNewOpinion() {
      const store = useNewOpinionStore();
      if (store.isAdded && store.topicId === this.topicId && store.item) {
        if (store.item.agreeType === this.agreeingType) {
          store.consume();
          this.opinions.unshift(store.item);
          this.displayOpinions();
        }
      }
    }
  },
  async created() {
    const opinionService = new OpinionService();
    const opinions = await opinionService.fetchAllInTopic(this.topicId);
    this.opinions.push(
      ...opinions.filter((opinion: OpinionData) => {
        return opinion.agreeType === this.agreeingType;
      })
    );
    this.displayOpinions();

    this.$emit('on-load-completion');
  },
  mounted() {
    const store = useSearchOpinionStore();
    store.set("");
    this.checkNewOpiniontimerId = window.setInterval(this.addNewOpinion, 1000);
  },
  unmounted() {
    clearInterval(this.checkNewOpiniontimerId);
  }
});
</script>

<style module lang="scss">
.container {
  background-color: #eee;
  width: 300px;
  height: 400px;
  overflow-y: auto;
  border-radius: 5px;

  &::-webkit-scrollbar {
    display: none;
  }

  color: white;

  .title {
    padding: 1rem 1rem 0 1rem;
    text-align: center;

    > span {
      color: white;
    }
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

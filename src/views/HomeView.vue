<template>
  <div :class="$style.container">
    <header>
      <p>모든토론주제</p>
      <SearchBar
        :onInputSearch="onInputSearch"
        @on-search-complete="onSearchCompleted"
        placeholder="토론 주제를 입력하세요"
      />
    </header>
    <div :class="$style['topic-list']">
      <TopicPreview
        :topic="topic"
        :isShowTopicInfo="index === selectedTopicIndex"
        :index="index"
        v-for="(topic, index) in topics"
        :key="index"
        @on-click-more="onClickTopicDetail"
      />
    </div>
    <div :class="$style['more-wrapper']" ref="more-button">
      <button :class="$style.more" @mousedown.left="moreTopics">
        {{ isWaitingMoreTopics ? '' : '더보기' }}
      </button>
      <WaitButton v-show="isWaitingMoreTopics" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TopicPreview from '@/components/topics/TopicPreview.vue';
import SearchBar from '@/components/SearchBar.vue';
import { type TopicItem } from '@/services/topics';
import { searchTopics } from '@/services/searches';
import { type TopTopicsItem, TopTopicsService } from '@/services/topics/TopTopicsService';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';

export default defineComponent({
  name: 'HomeView',
  components: { WaitButton, SearchBar, TopicPreview },
  data() {
    return {
      topics: [] as TopicItem[],
      selectedTopicIndex: -1,
      isWaitingMoreTopics: false,
      nextTopicsUrl: '',
      searchKeyword: ''
    };
  },
  methods: {
    selectTopicIndex(index: number) {
      this.selectedTopicIndex = index;
    },
    async moreTopics() {
      if (!this.nextTopicsUrl) {
        this.isWaitingMoreTopics = true;
        setTimeout(() => {
          this.isWaitingMoreTopics = false;
        }, 500);
        return;
      }

      this.selectedTopicIndex = -1;
      this.isWaitingMoreTopics = true;
      const topTopicsService = new TopTopicsService();

      const topics = await topTopicsService.fetchNext(
        this.nextTopicsUrl + (this.searchKeyword.length > 0 ? `&keyword=${this.searchKeyword}` : '')
      );
      this.topics.push(...topics.data);
      this.isWaitingMoreTopics = false;
      this.nextTopicsUrl = topics.nextPageUrl;

      setTimeout(() => {
        this.moveMouseIntoMoreButton();
      }, 0);
    },
    moveMouseIntoMoreButton() {
      const buttonRef = this.$refs['more-button'] as HTMLElement | undefined;
      if (buttonRef) {
        buttonRef.scrollIntoView({ behavior: 'smooth' });
      }
    },
    onSearchCompleted(topTopics: TopTopicsItem | null) {
      if (topTopics === null) {
        return;
      }

      this.topics = topTopics.data;
      this.nextTopicsUrl = topTopics.nextPageUrl;
    },
    onInputSearch(keyword: string) {
      this.searchKeyword = keyword;
      return searchTopics(keyword);
    },
    onClickTopicDetail(topicIndex: number) {
      if (this.selectedTopicIndex === topicIndex) {
        this.selectedTopicIndex = -1;
      } else {
        this.selectedTopicIndex = topicIndex;
      }
    }
  },
  created() {
    this.isWaitingMoreTopics = true;
    const topTopicsService = new TopTopicsService();
    topTopicsService.fetch().then((topTopics: TopTopicsItem) => {
      this.topics = topTopics.data;
      this.isWaitingMoreTopics = false;
      this.nextTopicsUrl = topTopics.nextPageUrl;
    });
  },
  mounted() {}
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  header {
    text-align: center;
    font-size: 32px;
    font-weight: bold;

    > * {
      margin-top: 1rem;
    }
  }

  .topic-list {
    margin-top: 1rem;
  }

  .more-wrapper {
    position: relative;
    width: 300px;
    margin-bottom: 1rem;

    .more {
      min-height: 50px;
      width: 100%;
      padding: 1rem;
      color: white;
      font-weight: bold;
      text-align: center;
      background-color: $primary-color;
      border-radius: 5px;
      border: none;

      &:hover {
        cursor: pointer;
        filter: brightness(85%);
      }
    }
  }
}
</style>

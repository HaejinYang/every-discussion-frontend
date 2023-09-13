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
        @mouseover="selectTopicIndex(index)"
        v-for="(topic, index) in topics"
        :key="index"
      />
    </div>
    <div :class="$style['more-wrapper']" ref="more-button">
      <button :class="$style.more" @mousedown.left="moreTopics">
        {{ isWaitingMoreTopics ? '' : '더보기' }}
      </button>
      <img src="@/assets/spinner-white.svg" alt="spinner" v-show="isWaitingMoreTopics" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TopicPreview from '@/components/topics/TopicPreview.vue';
import SearchBar from '@/components/SearchBar.vue';
import { type Topic, type TopTopics, TopTopicsApi } from '@/services/topics';
import { searchTopics } from '@/services/searches';

export default defineComponent({
  name: 'HomeView',
  components: { SearchBar, TopicPreview },
  data() {
    return {
      topics: [] as Topic[],
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

      const topics = await TopTopicsApi.fetchNext(
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
    onSearchCompleted(topTopics: TopTopics | null) {
      if (topTopics === null) {
        return;
      }

      this.topics = topTopics.data;
      this.nextTopicsUrl = topTopics.nextPageUrl;
    },
    onInputSearch(keyword: string) {
      this.searchKeyword = keyword;
      return searchTopics(keyword);
    }
  },
  created() {
    this.isWaitingMoreTopics = true;
    TopTopicsApi.fetch().then((topTopics: TopTopics) => {
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
    background-color: $primary-color;
    margin-bottom: 1rem;

    .more {
      min-height: 50px;
      width: 100%;
      color: white;
      text-align: center;
      font-weight: bold;
      padding: 1rem;
      border-radius: 10px;
      background-color: transparent;
      border: none;

      &:hover {
        cursor: pointer;
        box-shadow: $box-shadow-normal;
      }
    }

    > img {
      position: absolute;
      object-fit: contain;
      height: 100%;
      width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>

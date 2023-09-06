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
import type { Topic } from '@/services/topics';
import { nextTopTopics, TopTopics, topTopics } from '@/services/topics';

export default defineComponent({
  name: 'HomeView',
  components: { SearchBar, TopicPreview },
  data() {
    return {
      topics: [] as Topic[],
      selectedTopicIndex: -1,
      isWaitingMoreTopics: false,
      nextTopicsUrl: ''
    };
  },
  methods: {
    selectTopicIndex(index: number) {
      this.selectedTopicIndex = index;
    },
    async moreTopics() {
      this.selectedTopicIndex = -1;
      this.isWaitingMoreTopics = true;

      const topics = await nextTopTopics(this.nextTopicsUrl);
      this.topics.push(...topics.data);
      this.isWaitingMoreTopics = false;
      this.nextTopicsUrl = topics.nextPageUrl;

      this.moveMouseIntoMoreButton();
    },
    moveMouseIntoMoreButton() {
      const buttonRef = this.$refs['more-button'] as HTMLElement | undefined;
      if (buttonRef) {
        buttonRef.scrollIntoView({ behavior: 'smooth' });
      }
    },
    onSearchCompleted(searchedTopics: Topic[]) {
      this.topics = searchedTopics;
    },
    onInputSearch(keyword: string) {
      return [
        {
          id: 4,
          title: '토픽N. 매우긴내용 하지만 내용은 없는. 내용을 채우기 위한',
          host: '생성자1',
          participantsCount: 102,
          opinionsCount: 123
        }
      ];
    }
  },
  created() {
    this.isWaitingMoreTopics = true;
    topTopics().then((topTopics: TopTopics) => {
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

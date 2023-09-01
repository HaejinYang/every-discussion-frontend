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
      <img src="@/assets/spinner-black.svg" alt="spinner" v-show="isWaitingMoreTopics" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TopicPreview from '@/components/topics/TopicPreview.vue';
import SearchBar from '@/components/SearchBar.vue';
import type { Topic } from '@/services/topics';

export default defineComponent({
  name: 'HomeView',
  components: { SearchBar, TopicPreview },
  data() {
    return {
      topics: [] as Topic[],
      selectedTopicIndex: -1,
      isWaitingMoreTopics: false
    };
  },
  methods: {
    selectTopicIndex(index: number) {
      this.selectedTopicIndex = index;
    },
    moreTopics() {
      this.selectedTopicIndex = -1;
      this.isWaitingMoreTopics = true;
      setTimeout(() => {
        this.addTopics();
        setTimeout(() => {
          const buttonRef = this.$refs['more-button'] as HTMLElement | undefined;
          if (buttonRef) {
            buttonRef.scrollIntoView({ behavior: 'smooth' });
          }
          this.isWaitingMoreTopics = false;
        }, 0);
      }, 500);
    },
    addTopics() {
      this.topics.push({
        id: 1,
        title: '토픽1. 매우긴내용 하지만 내용은 없는. 내용을 채우기 위한',
        host: '생성자1',
        participantsCount: 102,
        opinionsCount: 123
      });

      this.topics.push({
        id: 2,
        title: '토픽2. 매우긴내용 하지만 내용은 없는. 내용을 채우기 위한',
        host: '생성자1',
        participantsCount: 102,
        opinionsCount: 123
      });

      this.topics.push({
        id: 3,
        title: '토픽3. 매우긴내용 하지만 내용은 없는. 내용을 채우기 위한',
        host: '생성자1',
        participantsCount: 102,
        opinionsCount: 123
      });
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
  mounted() {
    this.addTopics();
  }
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
    box-shadow: $box-shadow-normal;

    .more {
      width: 100%;
      text-align: center;
      font-weight: bold;
      padding: 0.5rem;
      border-radius: 10px;
      background-color: transparent;
      border: none;

      &:hover {
        cursor: pointer;
      }
    }

    > img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>

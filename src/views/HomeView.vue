<template>
  <div :class="$style.container">
    <header>
      <p>모든토론주제</p>
      <SearchBar :onInputSearch="onInputSearch" @on-search-complete="onSearchCompleted" />
    </header>
    <div :class="$style['topic-list']">
      <TopicPreview
        :topic="topic"
        :isShowTopicInfo="index === selectedTopicIndex"
        @mouseover="selectTopicIndex(index)"
        v-for="(topic, index) in topics"
        :key="topic"
      />
    </div>
    <div>
      <button :class="$style.more" @mousedown.left="moreTopics">더보기</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TopicPreview from '@/components/topics/TopicPreview.vue';
import SearchBar from '@/components/SearchBar.vue';

export default defineComponent({
  name: 'HomeView',
  components: { SearchBar, TopicPreview },
  data() {
    return {
      topics: [],
      selectedTopicIndex: -1
    };
  },
  methods: {
    selectTopicIndex(index: number) {
      this.selectedTopicIndex = index;
    },
    moreTopics() {
      this.selectedTopicIndex = -1;
      this.addTopics();
    },
    addTopics() {
      this.topics.push({
        title: '토픽1. 매우긴내용 하지만 내용은 없는. 내용을 채우기 위한',
        host: '생성자1',
        participantsCount: 102,
        opinionsCount: 123
      });

      this.topics.push({
        title: '토픽2. 매우긴내용 하지만 내용은 없는. 내용을 채우기 위한',
        host: '생성자1',
        participantsCount: 102,
        opinionsCount: 123
      });

      this.topics.push({
        title: '토픽3. 매우긴내용 하지만 내용은 없는. 내용을 채우기 위한',
        host: '생성자1',
        participantsCount: 102,
        opinionsCount: 123
      });
    },
    onSearchCompleted(val: any) {
      console.log('onSearchCompleted', val);
    },
    onInputSearch(keyword: string) {
      return [
        {
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
  box-shadow: inset 0px 0px 5px red;

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

  .more {
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
}
</style>

<template>
  <div :class="$style.container">
    <header>
      <p>모든토론주제</p>
      <input type="text" placeholder="검색" />
    </header>
    <div :class="$style['topic-list']">
      <TopicPreview
        :topic="topic"
        :isShowTopicInfo="index === selectedTopicIndex"
        v-for="(topic, index) in topics"
        :key="topic"
      />
    </div>
    <div>
      <button :class="$style.more" @mousedown.left="MoreTopics">더보기</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TopicPreview from '@/components/topics/TopicPreview.vue'

export default defineComponent({
  name: 'HomeView',
  components: { TopicPreview },
  data() {
    return {
      topics: [],
      selectedTopicIndex: -1
    }
  },
  methods: {
    SelectTopicIndex(index: number) {
      this.selectedTopicIndex = index
    },

    MoreTopics() {
      this.selectedTopicIndex = -1
      this.AddTopics()
    },
    AddTopics() {
      this.topics.push({
        title: '토픽1. 매우긴내용 하지만 내용은 없는. 내용을 채우기 위한',
        host: '생성자1',
        participantsCount: 102,
        opinionsCount: 123
      })

      this.topics.push({
        title: '토픽2. 매우긴내용 하지만 내용은 없는. 내용을 채우기 위한',
        host: '생성자1',
        participantsCount: 102,
        opinionsCount: 123
      })

      this.topics.push({
        title: '토픽3. 매우긴내용 하지만 내용은 없는. 내용을 채우기 위한',
        host: '생성자1',
        participantsCount: 102,
        opinionsCount: 123
      })
    }
  },
  mounted() {
    this.AddTopics()
  }
})
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

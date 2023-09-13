<template>
  <div :class="$style.container">
    <div v-for="topic in topics" :key="topic.id" @mousedown.left="switchToDiscussion(topic.id)">
      <p>
        {{ topic.title }}
      </p>
      <p>참여자수 {{ topic.participantsCount }}</p>
      <p>의견수 {{ topic.opinionsCount }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { TopicItem } from '@/services/topics';
import { Topic } from '@/services/topics';

export default defineComponent({
  name: 'MyTopicsView',
  data() {
    return {
      topics: [] as TopicItem[]
    };
  },
  methods: {
    switchToDiscussion(id: number) {
      this.$router.push(`/discussion/${id}`);
    }
  },
  created() {
    const userId = 1;
    Topic.fetchByUser(userId).then((topics: TopicItem[]) => {
      this.topics = topics;
    });
  }
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-flow: row wrap;

  > div {
    max-width: 250px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    margin: 1rem;
    box-shadow: $box-shadow-normal;

    > p {
      border-bottom: $border-weak-line;
      width: 100%;
      text-align: left;
      padding: 0.5rem;
    }

    &:hover {
      cursor: pointer;
      box-shadow: $box-shadow-strong;
    }
  }
}
</style>

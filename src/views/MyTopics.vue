<template>
  <div :class="$style.container">
    <div v-for="topic in topics" @mousedown.left="switchToDiscussion(topic.id)">
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
import type { Topic } from '@/services/topics';

export default defineComponent({
  name: 'MyTopics',
  data() {
    return {
      topics: [] as Topic[]
    };
  },
  methods: {
    addTopics() {
      for (let index = 0; index < 5; index++) {
        this.topics.push({
          id: index,
          title:
            'Lorem ipsum dolor sit amet. Qui quis rerum ut quis dolorem et ullam esse ad quas illum aut consequatur consequuntur et aliquid voluptas id quia autem.',
          host: '홍길동',
          participantsCount: 10 * index,
          opinionsCount: 5 * index
        });
      }
    },
    switchToDiscussion(id: number) {
      this.$router.push(`/discussion/${id}`);
    }
  },
  created() {
    this.addTopics();
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

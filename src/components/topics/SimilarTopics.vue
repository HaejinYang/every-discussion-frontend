<template>
  <div :class="$style['container']">
    <div :class="$style['similar-topic-item']" v-for="topic in displayingTopics" :key="topic.id">
      <p>{{ topic.title.substring(0, 30) }}</p>
      <img src="@/assets/search.svg" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TopicItem } from '@/services/topics';

export default defineComponent({
  name: 'SimilarTopics',
  props: {
    topics: {
      type: Array as PropType<TopicItem[]>,
      required: true
    }
  },
  watch: {
    topics(newTopics: TopicItem[]) {
      this.displayingTopics = [...newTopics.slice(0, 5)];
    }
  },
  data() {
    return {
      displayingTopics: [] as TopicItem[]
    };
  }
});
</script>

<style module lang="scss">
.container {
  .similar-topic-item {
    margin-top: 0.5rem;
    position: relative;
    background-color: white;

    > p {
      padding-left: 2rem;

      &:hover {
        color: white;
      }
    }

    > img {
      position: absolute;
      object-fit: contain;
      height: 100%;
      width: 100%;
      padding: 0.1rem 0.1rem 0.1rem 2rem;
      top: 50%;
      left: 0;
      transform: translate(-50%, -50%);
    }

    &:hover {
      cursor: pointer;
      filter: brightness(95%);
    }
  }
}
</style>

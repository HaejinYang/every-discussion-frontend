<template>
  <div :class="$style.container">
    <div
      :class="$style.wrapper"
      v-for="topic in topics"
      :key="topic.id"
      @mousedown.left="switchToDiscussion(topic.id)"
    >
      <div :class="$style['item']">
        <span :class="$style['label']">주제</span>
        <span :class="$style['value']">{{ topic.title }}</span>
      </div>
      <div :class="$style['item']">
        <span :class="$style['label']">참여자수</span>
        <span :class="$style['value']">{{ topic.participantsCount }}</span>
      </div>
      <div :class="$style['item']">
        <span :class="$style['label']">의견수</span>
        <span :class="$style['value']">{{ topic.opinionsCount }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { TopicItem } from '@/services/topics';
import { Topic } from '@/services/topics';
import { useAuthHandler } from '@/stores/auth';
import SearchBar from '@/components/SearchBar.vue';

export default defineComponent({
  name: 'MyTopicsView',
  components: { SearchBar },
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
    const authHandler = useAuthHandler();

    if (!authHandler.isAuth) {
      this.$router.push('/error/인증이 필요합니다.');

      return;
    }

    const userId = authHandler.info.id;
    Topic.fetchByUser(userId).then((topics: TopicItem[]) => {
      this.topics = topics;
    });
  }
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .wrapper {
    width: 450px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    margin: 1rem;
    box-shadow: $box-shadow-default;
    border: $border-default-line;

    .item {
      position: relative;
      display: flex;
      padding: 0.5rem;
      width: 100%;

      .label {
        min-width: 120px;
        font-weight: bold;
      }

      .value {
        min-width: 200px;
      }
    }

    &:hover {
      cursor: pointer;
      box-shadow: $box-shadow-strong;
    }
  }
}
</style>

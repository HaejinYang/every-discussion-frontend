<template>
  <div :class="$style.container" @mousedown.left="moveToDiscussion">
    <p :class="$style.title">{{ topic.id }}.{{ topic.title }}</p>
    <div :class="[$style.info, isShowTopicInfo ? $style.show : null]">
      <p>생성자: {{ topic.host }}</p>
      <p>
        <span>참여: {{ topic.participantsCount }} 의견: {{ topic.opinionsCount }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Topic } from '@/services/topics';

export default defineComponent({
  name: 'TopicPreview',
  props: {
    topic: {
      type: Object as PropType<Topic>,
      required: true
    },
    isShowTopicInfo: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    moveToDiscussion() {
      this.$router.push({ path: `/discussion/${this.topic.id}` });
    }
  }
});
</script>

<style module lang="scss">
.container {
  max-width: 300px;
  box-shadow: $box-shadow-normal;

  .title {
    padding: 1rem;
  }

  .info {
    max-height: 0px;
    overflow: hidden;
    transition: all 1s ease-in-out 0s;
    margin: 0 0.5rem 0.5rem 0.5rem;

    > p {
      border-top: $border-weak-line;
      padding: 0.5rem;
    }
  }

  .show {
    max-height: 300px;
  }
}
</style>

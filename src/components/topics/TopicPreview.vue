<template>
  <div :class="$style.container">
    <p :class="$style.title">
      {{ topic.title }}
    </p>
    <div :class="[$style.info, isShowTopicInfo ? $style.show : null]">
      <p>생성자: {{ topic.host }}</p>
      <p>
        <span>참여: {{ topic.participantsCount }} 의견: {{ topic.opinionsCount }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
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
  }
});
</script>

<style module lang="scss">
.container {
  max-width: 300px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 16px 0px;

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

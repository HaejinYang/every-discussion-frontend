<template>
  <div :class="$style.container" @mousedown.left="moveToDiscussion">
    <div :class="$style['title-wrapper']">
      <p :class="$style.title">{{ topic.id }}.{{ topic.title }}</p>
      <img
        :class="[$style.more, isFold ? null : $style.rotate]"
        src="@/assets/caret.svg"
        @mousedown.left.stop="onClickMore"
      />
    </div>
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
import type { TopicItem } from '@/services/topics';

export default defineComponent({
  name: 'TopicPreview',
  props: {
    topic: {
      type: Object as PropType<TopicItem>,
      required: true
    },
    isShowTopicInfo: {
      type: Boolean,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isFold: true
    };
  },
  watch: {
    isShowTopicInfo(state: boolean) {
      if (state) {
        this.isFold = false;
      } else {
        this.isFold = true;
      }
    }
  },
  methods: {
    moveToDiscussion() {
      this.$router.push({ path: `/discussion/${this.topic.id}` });
    },
    onClickMore() {
      this.$emit('on-click-more', this.index);
    }
  }
});
</script>

<style module lang="scss">
.container {
  max-width: 300px;
  box-shadow: $box-shadow-normal;
  border: $border-weak-line;
  border-radius: 5px;
  margin-bottom: 1rem;

  &:hover {
    cursor: pointer;
  }

  .title-wrapper {
    position: relative;
    padding: 1rem;

    .title {
    }

    .more {
      position: absolute;
      right: 0;
      top: 100%;
      transform: translate(0, -80%);
      background-color: white;
      border-radius: 50px;
      transform-origin: center;

      &:hover {
        filter: brightness(95%);
      }
    }

    .rotate {
      transform: translate(0, -80%) rotateX(180deg);
    }
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

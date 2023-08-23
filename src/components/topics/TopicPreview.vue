<template>
    <div :class="$style.container">
        <p :class="$style.title">{{ topic.title }}</p>
        <div v-show="isShowTopicInfo">
            <p>토론정보</p>
            <p>주제: {{ topic.title }}</p>
            <p>생성자: {{ topic.host }}</p>
            <p>참여: {{ topic.participantsCount }}</p>
            <p>의견: {{ topic.opinionsCount }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import type {Topic} from "@/services/topics";

export default defineComponent({
    name: "TopicPreview",
    props: {
        topic: {
            type: Object as PropType<Topic>,
            required: true,
        },
        isShowTopicInfo: {
            type: Boolean,
            required: true,
        }
    },
})
</script>

<style module lang="scss">
.container {
  max-width: 300px;
  padding: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 16px 0px;

  .title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>

<template>
  <div>Discussion {{ topicId }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DiscussionView',
  props: {
    topicId: {
      type: Number,
      required: true
    }
  }
});
</script>

<style module lang="scss"></style>

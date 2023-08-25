<template>
  <div :class="[$style.container, agreeingType === 'agree' ? $style.agree : $style.disagree]">
    <div :class="$style.title">
      <span>{{ agreeingType === 'agree' ? '찬성' : '반대' }}</span>
    </div>
    <div :class="$style.opinion" v-for="opinion in displayedOpinions" :key="opinion.id">
      <p>
        {{ opinion.title }}
      </p>
      <div>추천{{ opinion.like }} 비추천{{ opinion.dislike }}</div>
    </div>
    <div :class="$style.more" @mousedown.left="moreOpinions">
      <img src="@/assets/caret.svg" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Opinion } from '@/services/opinions';

export default defineComponent({
  name: 'Discussion',
  props: {
    agreeingType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      opinions: [] as Opinion[],
      displayedOpinions: [] as Opinion[],
      displayCursor: 0
    };
  },
  methods: {
    addOpinions() {
      for (let i = 0; i < 10; i++) {
        this.opinions.push({
          id: i,
          title:
            'Lorem ipsum dolor sit amet. Sed illo molestiae quo pariatur sint sed officiis voluptatem At officia consectetur. Non necessitatibus dignissimos ab ',
          content:
            'Lorem ipsum dolor sit amet. Sed illo molestiae quo pariatur sint sed officiis voluptatem At officia consectetur. Non necessitatibus dignissimos ab ',
          like: 10,
          dislike: 5
        });
      }
    },
    displayOpinions() {
      this.displayedOpinions.push(
        ...this.opinions.slice(this.displayCursor, this.displayCursor + 3)
      );
      this.displayCursor += 3;
    },
    moreOpinions() {
      this.displayOpinions();
    }
  },
  created() {
    this.addOpinions();
    this.displayOpinions();
  }
});
</script>

<style module lang="scss">
.container {
  background-color: #eee;
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;

  .title {
    padding: 1rem 1rem 0 1rem;
    text-align: center;
  }

  .opinion {
    margin: 0.5rem;
    border: $border-weak-line;

    > p,
    div {
      padding: 0.5rem;
      margin: 0.5rem;
      border-bottom: $border-weak-line;
    }

    div {
      text-align: right;
    }
  }

  .more {
    text-align: center;
    padding-bottom: 0.5rem;

    &:hover {
      cursor: pointer;
    }
  }
}

.agree {
  background-color: deepskyblue;
}

.disagree {
  background-color: palevioletred;
}
</style>

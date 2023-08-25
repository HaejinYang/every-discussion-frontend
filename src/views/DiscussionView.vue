<template>
  <div :class="$style.container">
    <div :class="$style.title">
      <h1>토픽주제입니다</h1>
    </div>
    <div :class="$style.opinions">
      <div :class="$style.agree">
        <Discussion agreeingType="agree" />
        <div :class="$style['submit-agree']">
          <button>의견제시</button>
        </div>
      </div>

      <div :class="$style.disagree">
        <Discussion agreeingType="disagree" />
        <div :class="$style['submit-disagree']">
          <button>의견제시</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Discussion from '@/components/discussions/Discussion.vue';

export default defineComponent({
  name: 'DiscussionView',
  components: { Discussion },
  props: {
    topicId: {
      type: Number,
      required: true
    }
  },
  mounted() {
    // get topic id
  }
});
</script>

<style module lang="scss">
.container {
  background-color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    padding: 1rem;
  }

  .opinions {
    display: flex;
    flex-direction: column;

    .agree {
      padding: 1rem;
      border: $border-normal-line;
    }

    .disagree {
      padding: 1rem;
      border: $border-normal-line;
    }

    .submit-agree,
    .submit-disagree {
      padding: 1rem;
      margin: 1rem;
      text-align: center;
    }
  }
}

@media screen and (min-width: $middle-size) {
  .container {
    .opinions {
      flex-direction: row;
    }
  }
}
</style>

<template>
  <div :class="[$style.container, agreeingType === 'agree' ? $style.agree : $style.disagree]">
    <div :class="$style.title">
      <span>{{ agreeingType === 'agree' ? '찬성' : '반대' }}</span>
    </div>
    <div :class="$style.opinion">
      <p>
        Lorem ipsum dolor sit amet. Sed accusantium fugiat est dignissimos commodi in laborum natus
        qui quisquam sint aut quia provident eos quis optio.
      </p>
      <div>추천1 비추천2</div>
    </div>
    <div :class="$style.opinion">
      <p>
        Lorem ipsum dolor sit amet. Sed accusantium fugiat est dignissimos commodi in laborum natus
        qui quisquam sint aut quia provident eos quis optio.
      </p>
      <div>추천1 비추천2</div>
    </div>
    <div :class="$style.opinion">
      <p>
        Lorem ipsum dolor sit amet. Sed accusantium fugiat est dignissimos commodi in laborum natus
        qui quisquam sint aut quia provident eos quis optio.
      </p>
      <div>추천1 비추천2</div>
    </div>
    <div :class="$style.opinion">
      <p>
        Lorem ipsum dolor sit amet. Sed accusantium fugiat est dignissimos commodi in laborum natus
        qui quisquam sint aut quia provident eos quis optio.
      </p>
      <div>추천1 비추천2</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Discussion',
  props: {
    agreeingType: {
      type: String,
      required: true
    }
  }
});
</script>

<style module lang="scss">
.container {
  background-color: #eee;
  max-width: 300px;

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
}

.agree {
  background-color: deepskyblue;
}

.disagree {
  background-color: palevioletred;
}
</style>

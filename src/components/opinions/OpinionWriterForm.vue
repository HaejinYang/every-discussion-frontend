<template>
  <div :class="$style['opinion-writer-form']">
    <div :class="$style['header']">
      <h3>
        {{ headerTitle }}
      </h3>
    </div>
    <div :class="$style['content-title']">
      <textarea
        placeholder="의견 제목"
        :value="contentTitle"
        @input="(event) => (contentTitle = (event.target as HTMLTextAreaElement)?.value)"
        @mousedown.left="onClickForm($event)"
      />
    </div>
    <div :class="$style['content-body']">
      <textarea
        placeholder="본문"
        :value="contentBody"
        @input="(event) => (contentBody = (event.target as HTMLTextAreaElement).value)"
        @mousedown.left="onClickForm($event)"
      />
    </div>
    <div :class="$style['submit-wrapper']">
      <button
        :class="type === 'agree' ? $style['agree'] : $style['disagree']"
        @mousedown.left="onClickSubmit"
      >
        {{ submitBtnMsg }}
      </button>
      <WaitButton v-if="isShowWait" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';

export default defineComponent({
  name: 'OpinionWriterForm',
  components: { WaitButton },
  emits: ['on-submit-form', 'on-click-form'],
  props: {
    headerTitle: {
      type: String,
      required: true,
      default: '타이틀'
    },
    submitBtnMsg: {
      type: String,
      required: true,
      default: '제출'
    },
    isShowWait: {
      type: Boolean,
      required: true,
      default: false
    },
    type: {
      type: String as PropType<'agree' | 'disagree'>,
      required: true,
      default: 'agree'
    },
    defaultTitle: {
      type: String
    },
    defaultContent: {
      type: String
    }
  },
  data() {
    return {
      contentTitle: this.defaultTitle ?? '',
      contentBody: this.defaultContent ?? ''
    };
  },
  methods: {
    onClickForm(event: Event) {
      if (event.target !== event.currentTarget) {
        return;
      }

      this.$emit('on-click-form');
    },
    onClickSubmit() {
      this.$emit('on-submit-form', {
        title: this.contentTitle,
        body: this.contentBody
      });
    }
  }
});
</script>

<style module lang="scss">
.opinion-writer-form {
  padding: 1rem;
  width: 60%;
  background-color: white;
  border: $border-normal-line;
  border-radius: 5px;

  .header {
    text-align: center;
  }

  .submit-wrapper {
    position: relative;
    text-align: center;

    > button {
      width: 100%;
      padding: 1rem;
      border: none;
      color: white;
      font-size: 1rem;
      font-weight: bold;
      border-radius: 5px;
      min-height: 3.3rem;

      &:hover {
        cursor: pointer;
        filter: brightness(85%);
      }
    }
  }

  .content-title,
  .content-body {
    padding: 1rem;

    > textarea {
      width: 100%;
      height: 100px;
      border: 1px solid gray;
      border-radius: 5px;
    }

    > input {
      margin-left: 0.5rem;
    }
  }
}

.agree {
  background-color: $agree-background-color;
}

.disagree {
  background-color: $disagree-background-color;
}
</style>

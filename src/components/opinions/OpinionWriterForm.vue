<template>
  <div :class="$style['container']" @mousedown.left.stop="onClickClose">
    <div :class="$style['box']" @mousedown.left.stop="onClickForm">
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
        />
      </div>
      <div :class="$style['content-body']">
        <textarea
          placeholder="본문"
          :value="contentBody"
          @input="(event) => (contentBody = (event.target as HTMLTextAreaElement).value)"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
import { types } from 'sass';
import String = types.String;

export default defineComponent({
  name: 'OpinionWriterForm',
  components: { WaitButton },
  emits: ['on-click-close', 'on-click-form', 'submit-form'],
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
    prevTitle: {
      type: String
    },
    prevContent: {
      type: String
    }
  },
  data() {
    return {
      contentTitle: this.prevTitle ?? '',
      contentBody: this.prevContent ?? ''
    };
  },
  methods: {
    onClickClose() {
      this.$emit('on-click-close');
    },
    onClickForm() {
      this.$emit('on-click-form');
    },
    onClickSubmit() {
      this.$emit('submit-form', {
        title: this.contentTitle,
        body: this.contentBody
      });
    }
  }
});
</script>

<style module lang="scss">
.container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  .box {
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
}

.agree {
  background-color: $agree-background-color;
}

.disagree {
  background-color: $disagree-background-color;
}
</style>

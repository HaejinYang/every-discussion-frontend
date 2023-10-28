<template>
  <div :class="$style.container" @mousedown.left="disableForm">
    <div @mousedown.left.stop="onClickForm">
      <div :class="$style['header']">
        <h3>
          {{ agreeingType === 'agree' ? '찬성' : '반대' }}
        </h3>
      </div>
      <div>
        <textarea
          placeholder="제목"
          :value="title"
          @input="(event) => (title = (event.target as HTMLTextAreaElement)?.value)"
        />
      </div>
      <div>
        <textarea
          placeholder="본문"
          :value="content"
          @input="(event) => (content = (event.target as HTMLTextAreaElement).value)"
        />
      </div>
      <div :class="$style['submit-wrapper']">
        <button
          :class="agreeingType === 'agree' ? $style.agree : $style.disagree"
          @click="submitOpinion"
        >
          {{ submitMsg[submitStep] }}
        </button>
        <WaitButton v-if="isSubmitWaiting" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type AgreeingType } from '@/services/opinions';
import { UserOpinion } from '@/services/opinions/UserOpinion';
import { getErrorMessage } from '@/util/error';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
import { useAuthStore } from '@/stores/AuthStore';

enum eProcess {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'RegisterOpinion',
  components: { WaitButton },
  props: {
    agreeingType: {
      type: String as PropType<AgreeingType>,
      required: true
    },
    topicId: {
      type: Number,
      required: true
    },
    prevTitle: {
      type: String,
      default: ''
    },
    prevContent: {
      type: String,
      default: ''
    },
    opinionId: {
      type: Number,
      required: true,
      default: -1
    }
  },
  data() {
    return {
      title: this.prevTitle ?? '',
      content: this.prevContent ?? '',
      submitStep: eProcess.Init as eProcess,
      submitMsg: ['제출하기', '', '제출성공', '제출실패']
    };
  },
  computed: {
    isSubmitWaiting() {
      return eProcess.Wait === this.submitStep;
    }
  },
  methods: {
    disableForm() {
      this.$emit('remove-form');
    },
    onClickForm() {
      if (this.submitStep !== eProcess.Wait) {
        this.submitStep = eProcess.Init;
      }
    },
    async submitOpinion() {
      if (this.submitStep === eProcess.Wait) {
        return;
      }

      this.submitStep = eProcess.Wait;
      try {
        const authStore = useAuthStore();
        const userOpinion = new UserOpinion(authStore.user.id, authStore.user.token);

        if (this.opinionId === -1) {
          const created = await userOpinion.create({
            topicId: this.topicId,
            title: this.title,
            content: this.content,
            agreeingType: this.agreeingType
          });
          this.$emit('register-opinion', created);
        } else {
          const updated = await userOpinion.update(
            {
              topicId: this.topicId,
              title: this.title,
              content: this.content,
              agreeingType: this.agreeingType
            },
            this.opinionId
          );

          this.$emit('update-opinion', updated);
        }

        this.submitStep = eProcess.Success;
      } catch (e) {
        this.submitStep = eProcess.Fail;
        reportError(getErrorMessage(e));
      } finally {
        if (this.submitStep === eProcess.Success) {
          setTimeout(() => {
            this.disableForm();
          }, 500);
        }
      }
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

  > div {
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
    }

    > div {
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
  }
}

.agree {
  background-color: $agree-background-color;
}

.disagree {
  background-color: $disagree-background-color;
}
</style>

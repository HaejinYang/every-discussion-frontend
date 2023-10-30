<template>
  <div :class="$style['container']">
    <OpinionWriterForm
      @on-click-close="disableForm"
      @on-click-form="onClickForm"
      @on-submit-form="onSubmit"
      :type="agreeingType"
      :isShowWait="isSubmitWaiting"
      :submitBtnMsg="submitMsg[submitStep]"
      :headerTitle="headerTitle"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type AgreeingType } from '@/services/opinions';
import { UserOpinion } from '@/services/opinions/UserOpinion';
import { getErrorMessage } from '@/util/error';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
import { useAuthStore } from '@/stores/AuthStore';
import OpinionWriterForm from '@/components/opinions/OpinionWriterForm.vue';

enum eProcess {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'RegisterOpinion',
  components: { OpinionWriterForm, WaitButton },
  props: {
    agreeingType: {
      type: String as PropType<AgreeingType>,
      required: true
    },
    topicId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      submitStep: eProcess.Init as eProcess,
      submitMsg: ['제출하기', '', '제출성공', '제출실패']
    };
  },
  computed: {
    isSubmitWaiting() {
      return eProcess.Wait === this.submitStep;
    },
    headerTitle() {
      if (this.agreeingType === 'agree') {
        return '찬성';
      }
      if (this.agreeingType === 'disagree') {
        return '반대';
      }
    }
  },
  methods: {
    disableForm() {
      this.$emit('remove-form');
    },
    onClickForm() {
      if (this.submitStep === eProcess.Fail) {
        this.submitStep = eProcess.Init;
      }
    },
    async onSubmit(opinion: { title: string; body: string }) {
      if (this.submitStep === eProcess.Wait || this.submitStep === eProcess.Success) {
        return;
      }

      try {
        this.submitStep = eProcess.Wait;
        const authStore = useAuthStore();
        const userOpinion = new UserOpinion(authStore.user.id, authStore.user.token);
        const created = await userOpinion.create({
          topicId: this.topicId,
          title: opinion.title,
          content: opinion.body,
          agreeingType: this.agreeingType
        });
        this.$emit('register-opinion', created);
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
}
</style>

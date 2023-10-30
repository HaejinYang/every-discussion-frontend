<template>
  <div :class="$style['container']">
    <OpinionWriterForm
      @submit-form="onClickSubmit"
      @on-click-form="onClickForm"
      :type="agreeingType"
      :isShowWait="isShowWait"
      :submitBtnMsg="processingMsg[processingStep]"
      headerTitle="수정"
      :prevContent="prevContent"
      :prevTitle="prevTitle"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import OpinionWriterForm from '@/components/opinions/OpinionWriterForm.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { UserOpinion } from '@/services/opinions/UserOpinion';
import { getErrorMessage } from '@/util/error';

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'ModifyOpinion',
  components: { OpinionWriterForm },
  props: {
    opinionId: {
      type: Number,
      required: true
    },
    prevTitle: {
      type: String,
      required: true
    },
    prevContent: {
      type: String,
      required: true
    },
    agreeingType: {
      type: String as PropType<'agree' | 'disagree'>,
      required: true
    }
  },
  data() {
    return {
      processingStep: eProcessStep.Init as eProcessStep,
      processingMsg: ['제출', '', '성공', '실패']
    };
  },
  computed: {
    isShowWait() {
      return this.processingStep === eProcessStep.Wait;
    }
  },
  methods: {
    onClickForm() {
      if (this.processingStep === eProcessStep.Fail) {
        this.processingStep = eProcessStep.Init;
      }
    },
    async onClickSubmit(opinion: { title: string; body: string }) {
      if (
        this.processingStep === eProcessStep.Wait ||
        this.processingStep === eProcessStep.Success
      ) {
        return;
      }

      const authStore = useAuthStore();
      const userOpinion = new UserOpinion(authStore.user.id, authStore.user.token);
      try {
        this.processingStep = eProcessStep.Wait;
        const updated = await userOpinion.update(this.opinionId, opinion.title, opinion.body);

        this.processingStep = eProcessStep.Success;
        this.$emit('update-opinion', updated);
      } catch (e) {
        this.processingStep = eProcessStep.Fail;
        reportError(getErrorMessage(e));
      }
    }
  }
});
</script>

<style module lang="scss">
.container {
}
</style>

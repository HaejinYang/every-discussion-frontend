<template>
  <ModalContainer @on-click-white-space="onClickPage">
    <OpinionWriterForm
      @on-submit-form="onClickSubmit"
      @on-click-form="onClickForm"
      :type="agreeingType"
      :isShowWait="isShowWait"
      :submitBtnMsg="processingMsg[processingStep]"
      headerTitle="수정"
      :defaultContent="prevContent"
      :defaultTitle="prevTitle"
    />
  </ModalContainer>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import OpinionWriterForm from '@/components/opinions/OpinionWriterForm.vue';
import { getErrorMessage } from '@/util/error';
import { UserOpinionService } from '@/services/opinions/UserOpinionService';
import ModalContainer from '@/components/common/modals/ModalContainer.vue';

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'ModifyOpinion',
  emits: ['on-click-white-space', 'update-opinion'],
  components: { ModalContainer, OpinionWriterForm },
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
    onClickPage(event: Event) {
      this.$emit('on-click-white-space');
    },
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

      const userOpinionService = new UserOpinionService();
      try {
        this.processingStep = eProcessStep.Wait;
        const updated = await userOpinionService.update({
          id: this.opinionId,
          title: opinion.title,
          content: opinion.body
        });

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

<style module lang="scss"></style>

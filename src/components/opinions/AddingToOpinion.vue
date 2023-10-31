<template>
  <div :class="$style['container']">
    <OpinionWriter
      @on-submit-form="onSubmit"
      :type="type"
      :isShowWait="isShowWait"
      :submitBtnMsg="processingStepMsg[processingStep]"
      :headerTitle="headerTitle"
      @on-click-close="onClickClose"
      @on-click-form="onClickForm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import OpinionWriter from '@/components/opinions/OpinionWriterForm.vue';
import { getErrorMessage } from '@/util/error';
import { UserOpinionService } from '@/services/opinions/UserOpinionService';

enum eProcess {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'AddingToOpinion',
  components: { OpinionWriter },
  props: {
    targetOpinionId: {
      type: Number,
      required: true
    },
    type: {
      type: String as PropType<'agree' | 'disagree'>,
      required: true
    },
    topicId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      processingStep: eProcess.Init as eProcess,
      processingStepMsg: ['제출', '', '성공', '실패']
    };
  },
  computed: {
    isShowWait() {
      return this.processingStep === eProcess.Wait;
    },
    headerTitle() {
      if (this.type === 'agree') {
        return '보강';
      }

      return '반박';
    }
  },
  methods: {
    onClickClose() {
      this.$emit('on-click-close');
    },
    onClickForm() {
      if (this.processingStep === eProcess.Fail) {
        this.processingStep = eProcess.Init;
      }
    },
    async onSubmit(opinion: { title: string; body: string }) {
      if (this.processingStep === eProcess.Wait || this.processingStep === eProcess.Success) {
        return;
      }

      const title = opinion.title;
      const body = opinion.body;

      const userOpinionService = new UserOpinionService();
      try {
        this.processingStep = eProcess.Wait;
        await userOpinionService.create({
          topicId: this.topicId,
          title: title,
          content: body,
          agreeingType: this.type,
          addTo: this.targetOpinionId
        });
        this.processingStep = eProcess.Success;
        this.$emit('result', 'success');
      } catch (e) {
        reportError(getErrorMessage(e));
        this.processingStep = eProcess.Fail;
        this.$emit('result', 'fail');
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
}
</style>

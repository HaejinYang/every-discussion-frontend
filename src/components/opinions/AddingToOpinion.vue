<template>
  <ModalContainer @on-click-white-space="onClickPage">
    <OpinionWriterForm
      @on-submit-form="onSubmit"
      :type="type"
      :isShowWait="isShowWait"
      :submitBtnMsg="processingStepMsg[processingStep]"
      :headerTitle="title"
      @on-click-form="onClickForm"
    />
  </ModalContainer>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {UserOpinionService} from "@/services/opinions/UserOpinionService";
import {getErrorMessage} from "@/util/error";
import OpinionWriterForm from "@/components/opinions/OpinionWriterForm.vue";
import ModalContainer from "@/components/common/modals/ModalContainer.vue";

defineOptions({
  name: 'AddingToOpinion',
})

interface Props {
  targetOpinionId: number;
  type: 'agree' | 'disagree';
  topicId: number;
  title: string;
}
  enum eProcess {
    Init = 0,
    Wait = 1,
    Success = 2,
    Fail = 3
  };

  const props = defineProps<Props>();

  const emit = defineEmits(['result', 'on-click-close']);

  const processingStep = ref(eProcess.Init as eProcess);
  const processingStepMsg = ref(['제출', '', '성공', '실패']);
  const isShowWait = computed(() => {
    return processingStep.value === eProcess.Wait;
  });

  function onClickPage() {
    emit('on-click-close');
  }

  function onClickForm() {
    if (processingStep.value === eProcess.Fail) {
      processingStep.value = eProcess.Init;
    }
  }

  async function onSubmit(opinion: { title: string; body: string }) {
    if (processingStep.value === eProcess.Wait || processingStep.value === eProcess.Success) {
      return;
    }

    const title = opinion.title;
    const body = opinion.body;

    const userOpinionService = new UserOpinionService();
    try {
      processingStep.value = eProcess.Wait;
      await userOpinionService.create({
        topicId: props.topicId,
        title: title,
        content: body,
        agreeingType: props.type,
        addTo: props.targetOpinionId
      });
      processingStep.value = eProcess.Success;
      emit('result', 'success');
    } catch (e) {
      reportError(getErrorMessage(e));
      processingStep.value = eProcess.Fail;
      emit('result', 'fail');
    }
  }
</script>

<style module lang="scss"></style>

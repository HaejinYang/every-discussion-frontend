<template>
  <SubmitForm
    :isSubmitWaiting="isSubmitWaiting"
    submitResultMsg=""
    :btnMsg="submitBtnMsg[submitStep]"
    @on-submit="onClickFind"
    @mousedown.left="onClickForm"
  >
    <template v-slot:header>
      <p :class="$style['title']">아이디 찾기</p>
    </template>

    <template v-slot:content>
      <LabeledInputText @input-text="inputName" label-text="이름" input-type="text" />
      <div :class="$style['result-box']" v-if="isSubmitSuccess">
        <small>이메일은 다음과 같습니다.</small><br />
        <small>{{ email }}</small>
      </div>
    </template>

    <template v-slot:footer>
      <div :class="$style['footer']">
        <LoginAndRegisterSwitch select="both" />
        <FindAccountAndPasswordSwitch select="password" />
      </div>
    </template>
  </SubmitForm>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UserService } from '@/services/users';
import { getErrorMessage } from '@/util/error';
import FindAccountAndPasswordSwitch from '@/components/auth/FindAccountAndPasswordSwitch.vue';
import LoginAndRegisterSwitch from '@/components/auth/LoginAndRegisterSwitch.vue';
import LabeledInputText from '@/components/common/inputs/LabeledInputText.vue';
import SubmitForm from '@/components/common/submits/SubmitForm.vue';

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'FindAccountForm',
  components: {
    SubmitForm,
    LabeledInputText,
    LoginAndRegisterSwitch,
    FindAccountAndPasswordSwitch
  },
  data() {
    return {
      name: '',
      email: '',
      submitBtnMsg: ['아이디 찾기', '', '찾기 성공', '찾기 실패'],
      submitStep: eProcessStep.Init as eProcessStep
    };
  },
  computed: {
    isSubmitWaiting() {
      return this.submitStep === eProcessStep.Wait;
    },
    isSubmitSuccess() {
      return this.submitStep === eProcessStep.Success;
    }
  },
  watch: {
    name() {
      if (this.submitStep !== eProcessStep.Wait) {
        this.submitStep = eProcessStep.Init;
      }
    }
  },
  methods: {
    clear() {
      this.submitStep = eProcessStep.Init;
      this.name = '';
    },
    onClickForm() {
      if (this.submitStep !== eProcessStep.Wait && this.submitStep !== eProcessStep.Success) {
        this.submitStep = eProcessStep.Init;
      }
    },
    async onClickFind() {
      if (this.submitStep === eProcessStep.Wait || this.submitStep === eProcessStep.Success) {
        return;
      }

      this.submitStep = eProcessStep.Wait;

      try {
        const userService = new UserService();
        const email = await userService.find(this.name);
        this.email = email;
        this.submitStep = eProcessStep.Success;
      } catch (e) {
        reportError(getErrorMessage(e));
        this.submitStep = eProcessStep.Fail;
      }
    },
    inputName(name: string) {
      this.name = name;
    }
  }
});
</script>

<style module lang="scss">
.title {
  text-align: center;
  font-weight: bold;
  border-bottom: none;
}

.footer {
  border-bottom: none;

  span:first-child {
    float: left;
  }

  span:last-child {
    float: right;
  }
}

.result-box {
  margin-top: 0.5rem;

  > small {
    color: black;
    font-weight: bold;
  }

  > small:first-of-type {
    color: gray;
    font-weight: normal;
  }
}
</style>

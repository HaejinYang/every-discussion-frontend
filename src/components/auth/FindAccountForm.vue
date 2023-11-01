<template>
  <div :class="$style['container']">
    <div :class="$style['form']" @mousedown.left.stop="onClickForm">
      <div :class="$style['header']">
        <p>아이디 찾기</p>
      </div>
      <div :class="$style['body']">
        <LabeledInputText @input-text="inputName" label-text="이름" input-type="text" />
      </div>
      <div :class="$style['footer']">
        <LoginAndRegisterSwitch select="both" />
        <FindAccountAndPasswordSwitch select="password" />
      </div>

      <div :class="$style['submit']">
        <button @mousedown.left.stop="onClickFind">{{ submitBtnMsg[submitStep] }}</button>
        <WaitButton v-show="isSubmitWaiting" />
        <div :class="$style['result-box']" v-if="isSubmitSuccess">
          <small>이메일은 다음과 같습니다.</small><br />
          <small>{{ email }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
import { UserService } from '@/services/users';
import { getErrorMessage } from '@/util/error';
import FindAccountAndPasswordSwitch from '@/components/auth/FindAccountAndPasswordSwitch.vue';
import LoginAndRegisterSwitch from '@/components/auth/LoginAndRegisterSwitch.vue';
import LabeledInputText from '@/components/common/inputs/LabeledInputText.vue';

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'FindAccountForm',
  components: {
    LabeledInputText,
    LoginAndRegisterSwitch,
    FindAccountAndPasswordSwitch,
    WaitButton
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
.container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  .form {
    padding: 1rem;
    width: 360px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 5px;

    > * {
      width: 90%;
      margin: 0.5rem;
    }

    .header {
      > p {
        text-align: center;
        font-weight: bold;
        border-bottom: none;
      }
    }

    .body {
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

    .submit {
      border-bottom: none;
      position: relative;
      padding-bottom: 0;

      .result-box {
        > small {
          color: black;
          font-weight: bold;
        }

        > small:first-of-type {
          color: gray;
          font-weight: normal;
        }
      }

      > button {
        width: 100%;
        padding: 0.5rem;
        border: none;
        color: white;
        font-weight: bold;
        background-color: $primary-color;
        filter: brightness(100%);
        min-height: 2.2rem;
        border-radius: 5px;

        &:hover {
          cursor: pointer;
          filter: brightness(85%);
        }
      }
    }
  }
}
</style>

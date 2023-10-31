<template>
  <div :class="$style['container']">
    <div :class="$style['form']" @mousedown.left.stop="onClickForm">
      <div :class="$style['header']">
        <p>비밀번호 변경</p>
      </div>
      <div :class="$style['body']">
        <LabeledInputText label-text="이메일" input-type="text" @input-text="inputEmail" />
        <LabeledInputText
          v-if="isSentEmail"
          label-text="인증번호"
          input-type="text"
          @input-text="inputVerifyToken"
        />
        <LabeledInputText
          v-if="isVerified"
          @input-text="inputPassword"
          label-text="새로운 비밀번호"
          input-type="password"
          :isShowWarnText="isPasswordShort"
          warn-text="비밀번호 길이 8보다 짧음"
        />
        <LabeledInputText
          v-if="isVerified"
          @input-text="inputPasswordConfirm"
          label-text="새로운 비밀번호 확인"
          input-type="password"
          :isShowWarnText="isPasswordDifferent"
          warn-text="비밀번호 불일치"
        />
      </div>
      <div :class="$style['option']">
        <LoginAndRegisterSwitch
          @switch-register-form="switchRegisterForm"
          @switch-login-form="switchLoginForm"
        />
        <FindAccountAndPasswordSwitch
          @switch-find-account-form="switchFindAccountForm"
          select="account"
        />
      </div>
      <div :class="$style['submit']">
        <button @mousedown.left.stop="onClickFind">{{ submitBtnMsg[submitStep] }}</button>
        <WaitButton v-show="isSubmitWaiting" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
import { getErrorMessage } from '@/util/error';
import FindAccountAndPasswordSwitch from '@/components/auth/FindAccountAndPasswordSwitch.vue';
import LoginAndRegisterSwitch from '@/components/auth/LoginAndRegisterSwitch.vue';
import LabeledInputText from '@/components/common/inputs/LabeledInputText.vue';
import { AuthService } from '@/services/auth';

enum eProcessStep {
  Init = 0,
  EmailSentWait,
  EmailSent,
  EmailSentFail,
  VerfiedWait,
  Verified,
  VerifiedFail,
  ChangeWait,
  Success,
  Fail
}

export default defineComponent({
  name: 'FindPasswordForm',
  components: {
    LabeledInputText,
    LoginAndRegisterSwitch,
    FindAccountAndPasswordSwitch,
    WaitButton
  },
  data() {
    return {
      mail: '',
      verifyToken: '',
      password: '',
      passwordConfirm: '',
      submitBtnMsg: [
        '인증 메일 전송',
        '',
        '인증번호 제출',
        '메일 전송 실패',
        '',
        '비밀번호 변경',
        '인증 실패',
        '',
        '변경 성공',
        '변경 실패'
      ],
      submitStep: eProcessStep.Init as eProcessStep
    };
  },
  computed: {
    isSubmitWaiting() {
      return (
        this.submitStep === eProcessStep.EmailSentWait ||
        this.submitStep === eProcessStep.VerfiedWait ||
        this.submitStep === eProcessStep.ChangeWait
      );
    },
    isSentEmail() {
      return (
        this.submitStep === eProcessStep.EmailSent ||
        this.submitStep === eProcessStep.VerfiedWait ||
        this.submitStep === eProcessStep.VerifiedFail
      );
    },
    isVerified() {
      return (
        this.submitStep === eProcessStep.Verified ||
        this.submitStep === eProcessStep.ChangeWait ||
        this.submitStep === eProcessStep.Fail
      );
    },
    isPasswordShort() {
      return this.password.length > 0 && this.password.length < 8;
    },
    isPasswordDifferent() {
      return (
        this.password.length > 0 &&
        this.passwordConfirm.length > 0 &&
        this.password !== this.passwordConfirm
      );
    }
  },
  watch: {
    mail() {
      if (this.submitStep === eProcessStep.EmailSentFail) {
        this.submitStep = eProcessStep.Init;
      }
    },
    verifyToken() {
      if (this.submitStep === eProcessStep.VerifiedFail) {
        this.submitStep = eProcessStep.EmailSent;
      }
    }
  },
  methods: {
    clear() {
      this.submitStep = eProcessStep.Init;
      this.mail = '';
      this.verifyToken = '';
      this.password = '';
      this.passwordConfirm = '';
    },
    onClickForm() {},
    async onClickFind() {
      if (this.isPasswordDifferent) {
        return;
      }

      if (
        this.submitStep === eProcessStep.EmailSentWait ||
        this.submitStep === eProcessStep.VerfiedWait ||
        this.submitStep === eProcessStep.ChangeWait
      ) {
        return;
      }

      if (this.submitStep === eProcessStep.Init) {
        // 이메일로 인증 토큰 보냄
        this.submitStep = eProcessStep.EmailSentWait;
        try {
          const auth = new AuthService();
          await auth.sendEmailForTransferingToken(this.mail);
          this.submitStep = eProcessStep.EmailSent;
        } catch (e) {
          reportError(getErrorMessage(e));
          this.submitStep = eProcessStep.EmailSentFail;
        }

        return;
      }

      if (this.submitStep === eProcessStep.EmailSent) {
        // 유저가 인증 토큰을 서버에 전송
        this.submitStep = eProcessStep.VerfiedWait;
        try {
          const auth = new AuthService();
          await auth.sendTokenForChangePassword(this.mail, this.verifyToken);
          this.submitStep = eProcessStep.Verified;
        } catch (e) {
          reportError(getErrorMessage(e));
          this.submitStep = eProcessStep.VerifiedFail;
        }

        return;
      }

      if (this.submitStep === eProcessStep.Verified) {
        // 유저가 비밀번호를 변경
        this.submitStep = eProcessStep.ChangeWait;
        try {
          const auth = new AuthService();
          await auth.changePassword({
            email: this.mail,
            token: this.verifyToken,
            password: this.password,
            password_confirmation: this.passwordConfirm
          });

          this.submitStep = eProcessStep.Success;

          setTimeout(() => {
            this.switchLoginForm();
          }, 1500);
        } catch (e) {
          reportError(getErrorMessage(e));
          this.submitStep = eProcessStep.Fail;
        }
        return;
      }
    },
    switchRegisterForm() {
      this.clear();
      this.$emit('switch-register-form');
    },
    switchLoginForm() {
      this.clear();
      this.$emit('switch-login-form');
    },
    switchFindAccountForm() {
      this.clear();
      this.$emit('switch-find-account-form');
    },
    inputEmail(mail: string) {
      this.mail = mail;
    },
    inputVerifyToken(token: string) {
      this.verifyToken = token;
    },
    inputPassword(password: string) {
      this.password = password;
    },
    inputPasswordConfirm(passwordConfirm: string) {
      this.passwordConfirm = passwordConfirm;
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

    .option {
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

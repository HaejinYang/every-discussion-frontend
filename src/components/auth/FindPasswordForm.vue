<template>
  <SubmitForm
    :isSubmitWaiting="isSubmitWaiting"
    submitResultMsg=""
    :btnMsg="submitBtnMsg[submitStep]"
    @on-submit="onClickFind"
  >
    <template v-slot:header>
      <p :class="$style['title']">비밀번호 변경</p>
    </template>

    <template v-slot:content>
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
    </template>

    <template v-slot:footer>
      <div :class="$style['footer']">
        <LoginAndRegisterSwitch select="both" />
        <FindAccountAndPasswordSwitch select="account" />
      </div>
    </template>
  </SubmitForm>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getErrorMessage } from '@/util/error';
import FindAccountAndPasswordSwitch from '@/components/auth/FindAccountAndPasswordSwitch.vue';
import LoginAndRegisterSwitch from '@/components/auth/LoginAndRegisterSwitch.vue';
import LabeledInputText from '@/components/common/inputs/LabeledInputText.vue';
import { AuthService } from '@/services/auth';
import { eAuthForm, useAuthFormStore } from '@/stores/AuthFormStore';
import SubmitForm from '@/components/common/submits/SubmitForm.vue';

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
    SubmitForm,
    LabeledInputText,
    LoginAndRegisterSwitch,
    FindAccountAndPasswordSwitch
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
    },
    password() {
      if (this.submitStep === eProcessStep.Fail) {
        this.submitStep = eProcessStep.Verified;
      }
    },
    passwordConfirm() {
      if (this.submitStep === eProcessStep.Fail) {
        this.submitStep = eProcessStep.Verified;
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
            this.clear();
            const authFormStore = useAuthFormStore();
            authFormStore.show(eAuthForm.Login);
          }, 1500);
        } catch (e) {
          reportError(getErrorMessage(e));
          this.submitStep = eProcessStep.Fail;
        }
        return;
      }
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
</style>

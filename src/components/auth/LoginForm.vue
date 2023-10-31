<template>
  <div :class="$style['container']">
    <div :class="$style['login-form']" @mousedown.left.stop="onClickLoginForm">
      <div>
        <p :class="$style.title">로그인</p>
      </div>
      <LabeledInputText
        @input-text="inputEmail"
        label-text="이메일 계정"
        input-type="text"
        :is-show-warn-text="!isValidEmailForm"
        warn-text="잘못된 메일 형식"
      />
      <LabeledInputText
        @input-text="inputPassword"
        label-text="비밀번호"
        input-type="password"
        :is-show-warn-text="!isValidPasswordForm"
        warn-text="비밀번호 길이가 8보다 짧음"
      />
      <div :class="$style['login-from-footer']">
        <LoginAndRegisterSwitch @switch-register-form="switchRegisterForm" select="register" />
        <FindAccountAndPasswordSwitch
          @switch-find-account-form="switchFindAccountForm"
          @switch-find-password-form="switchFindPasswordForm"
        />
      </div>
      <div :class="$style['login-btn-wrapper']">
        <button :class="$style['login-form-btn']" @mousedown.left.stop="onClickLogin">
          {{ submitBtnMsg[submitStep] }}
        </button>
        <WaitButton v-show="isSubmitWaiting" />
        <small>{{ isFailLogin ? '정보를 다시확인해주세요' : '' }}</small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from '@/util/timing';
import { isEmailValid } from '@/util/validation';
import { getErrorMessage } from '@/util/error';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
import type TinyError from '@/util/error/TinyError';
import FindAccountAndPasswordSwitch from '@/components/auth/FindAccountAndPasswordSwitch.vue';
import LoginAndRegisterSwitch from '@/components/auth/LoginAndRegisterSwitch.vue';
import LabeledInputText from '@/components/common/inputs/LabeledInputText.vue';
import { AuthService } from '@/services/auth';

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Unauthenticated = 3,
  Fail = 4
}

export default defineComponent({
  name: 'LoginForm',
  components: {
    LabeledInputText,
    LoginAndRegisterSwitch,
    FindAccountAndPasswordSwitch,
    WaitButton
  },
  data() {
    return {
      email: '',
      password: '',
      isValidEmailForm: true,
      isValidPasswordForm: true,
      submitBtnMsg: ['로그인', '', '로그인 성공', '이메일 인증이 필요합니다', '로그인 실패'],
      submitStep: eProcessStep.Init as eProcessStep,
      debouncedEmailCheck: (...args: any[]): void => {},
      debouncedPasswordCheck: (...args: any[]): void => {}
    };
  },
  computed: {
    isSubmitWaiting() {
      return this.submitStep === eProcessStep.Wait;
    },
    isFailLogin() {
      return this.submitStep === eProcessStep.Fail;
    }
  },
  watch: {
    email() {
      this.isValidEmailForm = true;
      this.debouncedEmailCheck();
    },
    password() {
      this.isValidPasswordForm = true;
      this.debouncedPasswordCheck();
    }
  },
  methods: {
    switchRegisterForm() {
      this.$emit('switch-register-form');
    },
    switchFindAccountForm() {
      this.$emit('switch-find-account-form');
    },
    switchFindPasswordForm() {
      this.$emit('switch-find-password-form');
    },
    async onClickLogin() {
      if (this.submitStep === eProcessStep.Wait) {
        return;
      }

      this.submitStep = eProcessStep.Wait;
      try {
        const auth = new AuthService();
        const user = await auth.login({ email: this.email, password: this.password });
        this.submitStep = eProcessStep.Success;
        setTimeout(() => {
          this.$emit('close-form');
        }, 1000);
      } catch (e) {
        reportError(getErrorMessage(e));

        if ((e as TinyError).code === 403) {
          this.submitStep = eProcessStep.Unauthenticated;
        } else {
          this.submitStep = eProcessStep.Fail;
        }
      }
    },
    onClickLoginForm() {
      if (this.submitStep !== eProcessStep.Wait) {
        this.submitStep = eProcessStep.Init;
      }
    },
    inputPassword(password: string) {
      this.password = password;
    },
    inputEmail(mail: string) {
      this.email = mail;
    }
  },
  created() {
    this.debouncedEmailCheck = debounce(() => {
      if (!isEmailValid(this.email)) {
        this.isValidEmailForm = false;
        return;
      }

      this.isValidEmailForm = true;
    }, 1000);
    this.debouncedPasswordCheck = debounce(() => {
      if (this.password.length > 0 && this.password.length < 8) {
        this.isValidPasswordForm = false;
        return;
      }

      this.isValidPasswordForm = true;
    }, 1000);
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

  .login-form {
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
      padding-bottom: 0.5rem;
      border-bottom: $border-weak-line;
    }

    > *:first-child {
      border-bottom: none;
    }

    .login-btn-wrapper {
      border-bottom: none;
      position: relative;
      padding-bottom: 0;

      .login-form-btn {
        width: 100%;
        min-height: 2.2rem;
        padding: 0.5rem;
        border: none;
        color: white;
        font-weight: bold;
        background-color: $primary-color;
        filter: brightness(100%);
        border-radius: 5px;

        &:hover {
          cursor: pointer;
          filter: brightness(85%);
        }
      }

      > small {
        color: red;
      }
    }

    .login-from-footer {
      border-bottom: none;

      span:first-child {
        float: left;
      }

      span:last-child {
        float: right;
      }
    }

    .title {
      text-align: center;
      font-weight: bold;
      border-bottom: none;
    }
  }
}
</style>

<template>
  <div :class="$style.container">
    <div :class="$style['register-form']" @mousedown.left.stop="onClickRegisterForm">
      <div>
        <p :class="$style.title">회원가입</p>
      </div>
      <LabeledInputText
        @input-text="inputEmail"
        label-text="이메일 계정"
        input-type="text"
        :is-show-warn-text="isDuplicatedEmail || !isEmailForm"
        :warn-text="invalidEmailWarnText"
      />
      <LabeledInputText
        @input-text="inputName"
        label-text="이름"
        input-type="text"
        :is-show-warn-text="isDuplicatedName"
        warn-text="이름 중복"
      />
      <LabeledInputText
        @input-text="inputPassword"
        label-text="비밀번호"
        input-type="password"
        :is-show-warn-text="isPasswordShort"
        warn-text="비밀번호 길이 8보다 짧음"
      />
      <LabeledInputText
        @input-text="inputPasswordConfirm"
        label-text="비밀번호 확인"
        input-type="password"
        :is-show-warn-text="!isPasswordSame"
        warn-text="비밀번호 불일치"
      />
      <div :class="$style['register-from-footer']">
        <LoginAndRegisterSwitch @switch-login-form="switchToLoginForm" select="login" />
        <FindAccountAndPasswordSwitch
          @switch-find-account-form="switchFindAccountForm"
          @switch-find-password-form="switchFindPasswordForm"
        />
      </div>
      <div :class="$style['register-btn-wrapper']">
        <button :class="$style['register-form-btn']" @mousedown.left="submitRegister">
          {{ submitBtnMsg[submitStep] }}
        </button>
        <WaitButton v-show="isSubmitWaiting" />
        <small>{{ isFailRegister ? '정보를 다시확인해주세요' : '' }}</small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from '@/util/timing';
import { User } from '@/services/users';
import { getErrorMessage } from '@/util/error';
import { isEmailValid } from '@/util/validation';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
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
  name: 'RegisterForm',
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
      password: '',
      passwordConfirm: '',
      isPasswordSame: true,
      isFailRegister: false,
      isDuplicatedEmail: false,
      isEmailForm: true,
      isDuplicatedName: false,
      isPasswordShort: false,
      submitBtnMsg: ['회원가입', '', '인증 메일 확인', '회원가입'],
      submitStep: eProcessStep.Init as eProcessStep,
      debouncedCheckPassword: (...args: any[]): void => {},
      debouncedCheckEmail: (...args: any[]): void => {},
      debouncedCheckName: (...args: any[]): void => {}
    };
  },
  watch: {
    password() {
      this.isPasswordShort = false;
      this.debouncedCheckPassword();
    },
    passwordConfirm() {
      this.isPasswordSame = true;
      this.debouncedCheckPassword();
    },
    name() {
      this.isDuplicatedName = false;
      this.debouncedCheckName();
    },
    email() {
      this.isDuplicatedEmail = false;
      this.isEmailForm = true;
      this.debouncedCheckEmail();
    }
  },
  computed: {
    isSubmitWaiting() {
      return this.submitStep === eProcessStep.Wait;
    },
    invalidEmailWarnText() {
      if (this.isDuplicatedEmail) {
        return '이메일 중복';
      }

      if (!this.isEmailForm) {
        return '잘못된 이메일 형식';
      }
    }
  },
  created() {
    this.debouncedCheckPassword = debounce(() => {
      if (this.password.length < 8 && this.password.length > 0) {
        this.isPasswordShort = true;
        return;
      }

      if (
        this.password === this.passwordConfirm ||
        this.password.length === 0 ||
        this.passwordConfirm.length === 0
      ) {
        this.isPasswordSame = true;
        return;
      }

      this.isPasswordSame = false;
    }, 500);

    this.debouncedCheckEmail = debounce(async () => {
      if (!isEmailValid(this.email)) {
        this.isEmailForm = false;
        return;
      }

      try {
        const result = await User.isDuplicated({ email: this.email });
      } catch (e) {
        this.isDuplicatedEmail = true;
      }
    }, 500);
    this.debouncedCheckName = debounce(async () => {
      try {
        const result = await User.isDuplicated({ name: this.name });
      } catch (e) {
        this.isDuplicatedName = true;
      }
    }, 500);
  },
  methods: {
    switchFindAccountForm() {
      this.$emit('switch-find-account-form');
    },
    switchFindPasswordForm() {
      this.$emit('switch-find-password-form');
    },
    onClickRegisterForm() {
      this.isFailRegister = false;
    },
    switchToLoginForm() {
      this.$emit('switch-login-form');
    },
    async submitRegister() {
      if (this.submitStep === eProcessStep.Wait) {
        return;
      }

      this.submitStep = eProcessStep.Wait;
      try {
        const user = await User.create({
          email: this.email,
          name: this.name,
          password: this.password,
          password_confirmation: this.passwordConfirm
        });
        this.submitStep = eProcessStep.Success;
        setTimeout(() => {
          this.$emit('register-success');
        }, 2000);
      } catch (e) {
        this.isFailRegister = true;
        this.submitStep = eProcessStep.Fail;
        reportError(getErrorMessage(e));
      }
    },
    inputEmail(mail: string) {
      this.email = mail;
    },
    inputName(name: string) {
      this.name = name;
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

  .register-form {
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

    .register-btn-wrapper {
      border-bottom: none;
      position: relative;
      padding-bottom: 0;

      > small {
        color: red;
      }

      .register-form-btn {
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

    .register-from-footer {
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

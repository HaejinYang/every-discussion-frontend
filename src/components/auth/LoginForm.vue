<template>
  <div :class="$style['container']">
    <div :class="$style['login-form']" @mousedown.left.stop="onClickLoginForm">
      <div>
        <p :class="$style.title">모두의토론</p>
      </div>
      <div :class="$style['email-wrapper']">
        <input
          :class="$style.email"
          type="text"
          id="login-email"
          placeholder=" "
          :value="email"
          @input="(event) => (email = (event.target as HTMLInputElement).value)"
        />
        <label ref="email-label" for="login-email"><small>계정</small></label>
        <small v-if="!isValidEmailForm">잘못된 email 형식</small>
      </div>
      <div :class="$style['password-wrapper']">
        <input
          :class="$style.password"
          type="password"
          id="login-password"
          placeholder=" "
          :value="password"
          @input="(event) => (password = (event.target as HTMLInputElement).value)"
        />
        <label for="login-password"><small>비밀번호</small></label>
        <small v-if="!isValidPasswordForm">비밀번호 길이 8보다 짧음</small>
      </div>
      <div :class="$style['login-from-footer']">
        <span @mousedown.left="switchRegisterForm"><small>회원가입</small></span>
        <span><small>아이디 / 비밀번호 찾기</small></span>
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
import { User } from '@/services/users';
import WaitButton from '@/components/buttons/WaitButton.vue';

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'LoginForm',
  components: { WaitButton },
  data() {
    return {
      email: '',
      password: '',
      isValidEmailForm: true,
      isValidPasswordForm: true,
      submitBtnMsg: ['로그인', '', '로그인 성공', '로그인 실패'],
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
    async onClickLogin() {
      if (this.submitStep === eProcessStep.Wait) {
        return;
      }

      this.submitStep = eProcessStep.Wait;
      try {
        const user = await User.login(this.email, this.password);
        this.submitStep = eProcessStep.Success;
        setTimeout(() => {
          this.$emit('close-form');
        }, 1000);
      } catch (e) {
        reportError(getErrorMessage(e));
        this.submitStep = eProcessStep.Fail;
      }
    },
    onClickLoginForm() {
      if (this.submitStep !== eProcessStep.Wait) {
        this.submitStep = eProcessStep.Init;
      }
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
      if (this.password.length < 8) {
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
        transition: all 300ms ease-in-out;

        &:hover {
          cursor: pointer;
          filter: brightness(90%);
        }
      }

      > small {
        color: red;
      }
    }

    .login-from-footer {
      border-bottom: none;

      span {
        color: gray;
        font-weight: lighter;

        &:hover {
          cursor: pointer;
          color: blue;
        }
      }

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

    .email-wrapper,
    .password-wrapper {
      position: relative;

      input {
        border: none;
      }

      input:focus {
        outline: none;
      }

      label {
        position: absolute;
        left: 0;
        color: gray;
        transition: all 300ms ease-in-out;
      }

      > small {
        position: absolute;
        color: red;
        right: 0;
      }

      &:focus-within label,
      input:not(:placeholder-shown) + label {
        transform: translateY(-20px);
      }

      &:focus-within label {
        color: blue;
      }

      &:focus-within {
        border-bottom: 1px solid blue;
      }
    }
  }
}
</style>

<template>
  <div :class="$style.container">
    <div :class="$style['register-form']" @mousedown.left.stop="onClickRegisterForm">
      <div>
        <p :class="$style.title">모두의토론</p>
      </div>
      <div :class="$style['email-wrapper']">
        <input
          :class="$style.email"
          type="text"
          id="email"
          placeholder=" "
          :value="email"
          @input="(event) => (email = (event.target as HTMLInputElement).value)"
        />
        <label ref="email-label" for="email"><small>계정</small></label>
        <small v-if="isDuplicatedEmail">email 중복</small>
        <small v-if="!isEmailForm">잘못된 email 형식</small>
      </div>
      <div :class="$style['name-wrapper']">
        <input
          type="text"
          id="name"
          placeholder=" "
          :value="name"
          @input="(event) => (name = (event.target as HTMLInputElement).value)"
        />
        <label for="name"><small>이름</small></label>
        <small v-if="isDuplicatedName">이름 중복</small>
      </div>
      <div :class="$style['password-wrapper']">
        <input
          :class="$style.password"
          type="password"
          id="password"
          placeholder=" "
          :value="password"
          @input="(event) => (password = (event.target as HTMLInputElement).value)"
        />
        <label for="password"><small>비밀번호</small></label>
        <small v-if="isPasswordShort">비밀번호 길이 8보다 짧음</small>
      </div>
      <div :class="$style['password-wrapper']">
        <input
          :class="$style.password"
          type="password"
          id="password-confirm"
          placeholder=" "
          :value="passwordConfirm"
          @input="(event) => (passwordConfirm = (event.target as HTMLInputElement).value)"
        />
        <label for="password-confirm"><small>비밀번호 확인</small></label>
        <small v-if="!isPasswordSame">비밀번호 불일치</small>
      </div>
      <div :class="$style['register-from-footer']">
        <span @mousedown.left="switchToLoginForm"><small>로그인</small></span>
        <span><small>아이디 / 비밀번호 찾기</small></span>
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
import WaitButton from '@/components/buttons/WaitButton.vue';

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'RegisterForm',
  components: { WaitButton },
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
      submitBtnMsg: ['회원가입', '', '회원가입 완료!', '회원가입'],
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
      } catch (e) {
        this.isFailRegister = true;
        this.submitStep = eProcessStep.Fail;
        reportError(getErrorMessage(e));
      }
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
        transition: all 300ms ease-in-out;
        min-height: 2.2rem;

        &:hover {
          cursor: pointer;
          filter: brightness(90%);
        }
      }
    }

    .register-from-footer {
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
    .password-wrapper,
    .name-wrapper {
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
        transition: all 300ms ease-in-out;
        color: gray;
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

<template>
  <SubmitForm
    :btnMsg="submitBtnMsg[submitStep]"
    :submitResultMsg="loginResultMsg"
    :isSubmitWaiting="submitStep === eProcessStep.Wait"
    @on-submit="onClickLogin"
    @mousedown.left="onClickLoginForm"
  >
    <template v-slot:header>
      <p :class="$style['title']">로그인</p>
    </template>

    <template v-slot:content>
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
    </template>

    <template v-slot:footer>
      <div :class="$style['footer']">
        <div :class="$style['switch-auth']">
          <LoginAndRegisterSwitch select="register" />
          <FindAccountAndPasswordSwitch select="both" />
        </div>
        <div :class="$style['keep-auth']">
          <label><small>로그인 유지 </small></label>
          <input type="checkbox" v-model="isCheckedKeepLoggedIn" />
        </div>
      </div>
    </template>
  </SubmitForm>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from '@/util/timing';
import { isEmailValid } from '@/util/validation';
import { getErrorMessage } from '@/util/error';
import type TinyError from '@/util/error/TinyError';
import FindAccountAndPasswordSwitch from '@/components/auth/FindAccountAndPasswordSwitch.vue';
import LoginAndRegisterSwitch from '@/components/auth/LoginAndRegisterSwitch.vue';
import LabeledInputText from '@/components/common/inputs/LabeledInputText.vue';
import { AuthService } from '@/services/auth';
import { useAuthFormStore } from '@/stores/AuthFormStore';
import SubmitForm from '@/components/common/submits/SubmitForm.vue';

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
    SubmitForm,
    LabeledInputText,
    LoginAndRegisterSwitch,
    FindAccountAndPasswordSwitch
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
      debouncedPasswordCheck: (...args: any[]): void => {},
      isCheckedKeepLoggedIn: false
    };
  },
  computed: {
    eProcessStep() {
      return eProcessStep;
    },
    loginResultMsg() {
      if (this.submitStep === eProcessStep.Fail) {
        return '정보를 다시확인해주세요';
      }

      return '';
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
          const authFormStore = useAuthFormStore();
          authFormStore.hide();
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
.title {
  text-align: center;
  font-weight: bold;
  border-bottom: none;
}

.footer {
  border-bottom: none;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .switch-auth {
    display: flex;
    justify-content: space-between;
  }

  .keep-auth {
    color: gray;
    font-weight: lighter;

    > input {
      vertical-align: -2px;
    }
  }
}
</style>

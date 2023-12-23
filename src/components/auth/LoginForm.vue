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
      <small>테스트용 아이디와 비밀번호가 적용되어있습니다.</small>
    </template>

    <template v-slot:content>
      <LabeledInputText
        @input-text="inputEmail"
        label-text="이메일 계정"
        input-type="text"
        :is-show-warn-text="!isValidEmailForm"
        warn-text="잘못된 메일 형식"
        default-text="hprice@example.com"
      />
      <LabeledInputText
        @input-text="inputPassword"
        label-text="비밀번호"
        input-type="password"
        :is-show-warn-text="!isValidPasswordForm"
        warn-text="비밀번호 길이가 8보다 짧음"
        default-text="123412345"
      />
    </template>

    <template v-slot:footer>
      <div :class="$style['footer']">
        <div :class="$style['switch-auth']">
          <LoginAndRegisterSwitch select="register" />
          <FindAccountAndPasswordSwitch select="both" />
        </div>
        <div :class="$style['keep-auth']">
          <label for="check-keep-logged-in"><small>로그인 유지 </small></label>
          <input type="checkbox" v-model="isCheckedKeepLoggedIn" id="check-keep-logged-in" />
        </div>
      </div>
    </template>

    <template v-slot:extra>
      <div v-if="submitStep === eProcessStep.Unauthenticated" :class="$style['extra-send-auth']">
        <button :class="$style['resend-btn']" @mousedown.left.stop="onClickSendAuthEmail">{{ authMailSendBtnMsg[authMailSendStep] }}</button>
        <WaitAnimation v-show="isWaitAuthSendEmail" />
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
import WaitAnimation from "@/components/common/animations/WaitAnimation.vue";

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Unauthenticated = 3,
  Fail = 4
}

enum eSendAuthMailStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'LoginForm',
  components: {
    WaitAnimation,
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
      isCheckedKeepLoggedIn: false,
      authMailSendBtnMsg: ['인증 메일 보내기', '', '전송 성공', '전송 실패'],
      authMailSendStep: eSendAuthMailStep.Init as eSendAuthMailStep,
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
    },
    isWaitAuthSendEmail() {
      return eSendAuthMailStep.Wait === this.authMailSendStep;
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
        await auth.login({
          email: this.email,
          password: this.password,
          isKeepLoggedIn: this.isCheckedKeepLoggedIn
        });
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

      if(this.authMailSendStep !== eSendAuthMailStep.Wait) {
        this.authMailSendStep = eSendAuthMailStep.Init;
      }
    },
    inputPassword(password: string) {
      this.password = password;
    },
    inputEmail(mail: string) {
      this.email = mail;
    },
    async onClickSendAuthEmail() {
      if(this.authMailSendStep === eSendAuthMailStep.Success ||
          this.authMailSendStep === eSendAuthMailStep.Wait) {
        return;
      }

      this.authMailSendStep = eSendAuthMailStep.Wait;

      try {
        const auth = new AuthService();
        await auth.sendAuthEmail(this.email);
        this.authMailSendStep = eSendAuthMailStep.Success;
      } catch (e) {
        reportError(getErrorMessage(e));
        this.authMailSendStep = eSendAuthMailStep.Fail;
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

.extra-send-auth {
  position: relative;
  width: 150px;
}

.resend-btn {
  background-color: $wait-color;
  color: lightgray;
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  width: 100%;
  min-height: 2.1rem;

  &:hover {
    cursor: pointer;
    color: white;
  }
}


</style>

<template>
  <AgreeTerms v-if="!termsAgreed" @on-submit-terms-agree="onSubmitTermsAgree"/>
  <SubmitForm v-if="termsAgreed"
    :isSubmitWaiting="isSubmitWaiting"
    :submitResultMsg="registerResultMsg"
    :btnMsg="submitBtnMsg[submitStep]"
    @mousedown.left="onClickRegisterForm"
    @on-submit="onSubmitRegister"
  >
    <template v-slot:header>
      <p :class="$style['title']">회원가입</p>
    </template>

    <template v-slot:content>
      <LabeledInputText
        @input-text="inputEmail"
        label-text="이메일 계정"
        input-type="text"
        :is-show-warn-text="isDuplicatedEmail || !isEmailForm"
        :warn-text="invalidEmailWarnText"
      />
      <LabeledInputText
        @input-text="inputName"
        label-text="닉네임"
        input-type="text"
        :is-show-warn-text="isDuplicatedName"
        warn-text="닉네임 중복"
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
    </template>

    <template v-slot:footer>
      <div :class="$style['footer']">
        <LoginAndRegisterSwitch select="login" />
        <FindAccountAndPasswordSwitch select="both" />
      </div>
    </template>
  </SubmitForm>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from '@/util/timing';
import { UserService } from '@/services/users';
import { getErrorMessage } from '@/util/error';
import { isEmailValid } from '@/util/validation';
import FindAccountAndPasswordSwitch from '@/components/auth/FindAccountAndPasswordSwitch.vue';
import LoginAndRegisterSwitch from '@/components/auth/LoginAndRegisterSwitch.vue';
import LabeledInputText from '@/components/common/inputs/LabeledInputText.vue';
import { eAuthForm, useAuthFormStore } from '@/stores/AuthFormStore';
import SubmitForm from '@/components/common/submits/SubmitForm.vue';
import AgreeTerms from "@/components/auth/AgreeTerms.vue";

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'RegisterForm',
  components: {
    AgreeTerms,
    SubmitForm,
    LabeledInputText,
    LoginAndRegisterSwitch,
    FindAccountAndPasswordSwitch
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      isPasswordSame: true,
      isDuplicatedEmail: false,
      isEmailForm: true,
      isDuplicatedName: false,
      isPasswordShort: false,
      submitBtnMsg: ['회원가입', '', '인증 메일 확인', '회원가입'],
      submitStep: eProcessStep.Init as eProcessStep,
      termsAgreed: false,
      debouncedCheckPassword: debounce(() => {}),
      debouncedCheckEmail: debounce(() => {}),
      debouncedCheckName: debounce(() => {})
    };
  },
  computed: {
    registerResultMsg() {
      if (this.submitStep === eProcessStep.Fail) {
        return '정보를 다시확인해주세요';
      }

      return '';
    },
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

      return '이메일 확인';
    }
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
  created() {
    this.debouncedCheckPassword = debounce(() => {
      if (this.password.length < 8 && this.password.length > 0) {
        this.isPasswordShort = true;
        return;
      }

      if (
          this.password.length === 0 ||
          this.passwordConfirm.length === 0 ||
          this.password === this.passwordConfirm
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
        const userService = new UserService();
        await userService.isDuplicated({ email: this.email });
      } catch (e) {
        this.isDuplicatedEmail = true;
      }
    }, 500);
    this.debouncedCheckName = debounce(async () => {
      try {
        const userService = new UserService();
        await userService.isDuplicated({ name: this.name });
      } catch (e) {
        this.isDuplicatedName = true;
      }
    }, 500);
  },
  methods: {
    onClickRegisterForm() {
      if (this.submitStep === eProcessStep.Fail) {
        this.submitStep = eProcessStep.Init;
      }
    },
    async onSubmitRegister() {
      if (this.submitStep === eProcessStep.Wait) {
        return;
      }

      this.submitStep = eProcessStep.Wait;
      try {
        const userService = new UserService();
        await userService.create({
          email: this.email,
          name: this.name,
          password: this.password,
          password_confirmation: this.passwordConfirm
        });
        this.submitStep = eProcessStep.Success;
        setTimeout(() => {
          const authFormStore = useAuthFormStore();
          authFormStore.show(eAuthForm.Login);
        }, 2000);
      } catch (e) {
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
    },
    onSubmitTermsAgree() {
      this.termsAgreed = true;
    }
  }
});
</script>

<style module lang="scss">
.footer {
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
</style>

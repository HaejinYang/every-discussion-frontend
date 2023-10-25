<template>
  <div :class="$style['container']">
    <div :class="$style['form']" @mousedown.left.stop="onClickForm">
      <div :class="$style['header']">
        <p>비밀번호 찾기</p>
      </div>
      <div :class="$style['body']">
        <div :class="$style['input-box']">
          <input
            type="text"
            id="find-account-email"
            placeholder=" "
            :value="mail"
            @input="(event) => (mail = (event.target as HTMLInputElement).value)"
          />
          <label for="find-account-email"><small>이메일</small></label>
        </div>
        <div v-if="isSentEmail">
          <div :class="$style['input-box']">
            <input
              type="text"
              id="verify-email"
              placeholder=" "
              :value="verifyToken"
              @input="(event) => (verifyToken = (event.target as HTMLInputElement).value)"
            />
            <label for="verify-email"><small>인증번호</small></label>
          </div>
        </div>
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
import WaitButton from '@/components/buttons/WaitButton.vue';
import { getErrorMessage } from '@/util/error';
import FindAccountAndPasswordSwitch from '@/components/auth/FindAccountAndPasswordSwitch.vue';
import LoginAndRegisterSwitch from '@/components/auth/LoginAndRegisterSwitch.vue';
import { User } from '@/services/users';

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
  components: { LoginAndRegisterSwitch, FindAccountAndPasswordSwitch, WaitButton },
  data() {
    return {
      mail: '',
      verifyToken: '',
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
      return this.submitStep === eProcessStep.EmailSent;
    }
  },
  watch: {
    mail() {}
  },
  methods: {
    clear() {
      this.submitStep = eProcessStep.Init;
      this.mail = '';
    },
    onClickForm() {},
    async onClickFind() {
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
          await User.sendEmailForTransferingToken(this.mail);
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
          await User.sendTokenForChangePassword(this.mail, this.verifyToken);
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
        setTimeout(() => {
          this.submitStep = eProcessStep.Fail;
        }, 1000);

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
      .input-box {
        position: relative;
        padding-top: 0.5rem;
        margin-top: 1.5rem;

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

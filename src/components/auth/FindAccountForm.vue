<template>
  <div :class="$style['container']">
    <div :class="$style['form']" @mousedown.left.stop="onClickForm">
      <div :class="$style['header']">
        <p>아이디 찾기</p>
      </div>
      <div :class="$style['body']">
        <div :class="$style['input-box']">
          <input
            type="text"
            id="find-account-name"
            placeholder=" "
            :value="name"
            @input="(event) => (name = (event.target as HTMLInputElement).value)"
          />
          <label for="find-account-name"><small>이름</small></label>
          <!--          <small v-if="!isValidEmailForm">잘못된 email 형식</small>-->
        </div>
      </div>
      <div :class="$style['footer']">
        <LoginAndRegisterSwitch
          @switch-register-form="switchRegisterForm"
          @switch-login-form="switchLoginForm"
        />
        <FindAccountAndPasswordSwitch
          @switch-find-password-form="switchFindPasswordForm"
          select="password"
        />
      </div>

      <div :class="$style['submit']">
        <button @mousedown.left.stop="onClickFind">{{ submitBtnMsg[submitStep] }}</button>
        <WaitButton v-show="isSubmitWaiting" />
        <div :class="$style['result-box']" v-if="isSubmitSuccess">
          <small>이메일은 다음과 같습니다.</small><br />
          <small>{{ email }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
import { User } from '@/services/users';
import { getErrorMessage } from '@/util/error';
import FindAccountAndPasswordSwitch from '@/components/auth/FindAccountAndPasswordSwitch.vue';
import LoginAndRegisterSwitch from '@/components/auth/LoginAndRegisterSwitch.vue';

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'FindAccountForm',
  components: { LoginAndRegisterSwitch, FindAccountAndPasswordSwitch, WaitButton },
  data() {
    return {
      name: '',
      email: '',
      submitBtnMsg: ['아이디 찾기', '', '찾기 성공', '찾기 실패'],
      submitStep: eProcessStep.Init as eProcessStep
    };
  },
  computed: {
    isSubmitWaiting() {
      return this.submitStep === eProcessStep.Wait;
    },
    isSubmitSuccess() {
      return this.submitStep === eProcessStep.Success;
    }
  },
  watch: {
    name() {
      if (this.submitStep !== eProcessStep.Wait) {
        this.submitStep = eProcessStep.Init;
      }
    }
  },
  methods: {
    clear() {
      this.submitStep = eProcessStep.Init;
      this.name = '';
    },
    onClickForm() {
      if (this.submitStep !== eProcessStep.Wait && this.submitStep !== eProcessStep.Success) {
        this.submitStep = eProcessStep.Init;
      }
    },
    async onClickFind() {
      if (this.submitStep === eProcessStep.Wait || this.submitStep === eProcessStep.Success) {
        return;
      }

      this.submitStep = eProcessStep.Wait;

      try {
        const email = await User.find(this.name);
        this.email = email;
        this.submitStep = eProcessStep.Success;
      } catch (e) {
        reportError(getErrorMessage(e));
        this.submitStep = eProcessStep.Fail;
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
    switchFindPasswordForm() {
      this.clear();
      this.$emit('switch-find-password-form');
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

    .footer {
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

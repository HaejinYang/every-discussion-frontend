<template>
  <div :class="$style['container']">
    <div :class="$style['wrapper']">
      <div :class="$style['menu']">
        <ul @mousedown.left="onClickMenu($event)">
          <li :class="[isSelectedProfile ? $style['selected'] : null]" data-select="profile">
            프로필
          </li>
          <li :class="[isSelectedPassword ? $style['selected'] : null]" data-select="password">
            비밀번호 변경
          </li>
          <li :class="[isSelectedQuit ? $style['selected'] : null]" data-select="quit">
            회원 탈퇴
          </li>
        </ul>
      </div>
      <div :class="$style['content']" v-show="isSelectedProfile">
        <h2>프로필</h2>
        <div :class="$style['item']">
          <span :class="$style['label']">계정</span>
          <span :class="$style['value']">{{ userEmail }}</span>
        </div>
        <div :class="$style['item']">
          <span :class="$style['label']">이름</span>
          <span :class="$style['value']" v-if="!isModifyMode">{{ userName }}</span>
          <input
            type="text"
            v-if="isModifyMode"
            :value="userName"
            @input="(event) => (userName = (event.target as HTMLInputElement).value)"
          />
        </div>
        <div :class="$style['item']">
          <button
            :class="$style['submit-modify']"
            v-if="!isModifyMode"
            @mousedown.left="onClickModify"
          >
            수정하기
          </button>
          <button
            :class="[$style['submit-modify'], $style['submit-cancel']]"
            v-if="isModifyMode"
            @mousedown.left="onClickModifyCancel"
          >
            취소
          </button>
          <div :style="{ position: 'relative', width: '100%' }" v-if="isModifyMode">
            <button :class="$style['submit-modify']" @mousedown.left="onClickModifySubmit">
              {{ userInfoModifyMsg[userInfoModifyStep] }}
            </button>
            <WaitButton v-show="isUserInfoChanging" />
          </div>
        </div>
      </div>
      <div :class="$style['content']" v-show="isSelectedPassword">
        <h2>비밀번호 변경</h2>
        <div :class="$style['item']">
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
        </div>
        <div :class="$style['item']">
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
        </div>
        <div :class="$style['item']">
          <button
            :class="[$style['submit-warning'], canModifyPassword ? null : $style['can-modify']]"
            @mousedown.left="onClickChangePassword"
          >
            {{ passwordModifyMsg[passwordModifyStep] }}
          </button>
          <WaitButton v-show="isPasswordChanging" />
        </div>
        <div :class="$style['item']">
          <small>{{ isFailChangePassword ? '비밀번호를 다시확인해주세요' : '' }}</small>
        </div>
      </div>
      <div :class="$style['content']" v-show="isSelectedQuit">
        <h2>회원 탈퇴</h2>
        <div :class="$style['item']" :style="{ marginBottom: '1rem' }">
          <small>
            작성한 게시물, 댓글은 자동으로 삭제되지 않습니다. 탈퇴하면 계정을 복구할 수 없습니다
          </small>
        </div>
        <div :class="$style['item']">
          <div :class="$style['password-wrapper']">
            <input
              :class="$style.password"
              type="password"
              id="password-check"
              placeholder=" "
              :value="passwordCheck"
              @input="(event) => (passwordCheck = (event.target as HTMLInputElement).value)"
              @mousedown.left="onClickQuitInput"
            />
            <label for="password-check"><small>비밀번호 확인</small></label>
          </div>
        </div>
        <div :class="$style['item']">
          <button :class="[$style['submit-warning']]" @mousedown.left="onClickQuit">
            {{ userQuitMsg[userQuitStep] }}
          </button>
          <WaitButton v-show="isUserQuitProcessing" />
        </div>
        <div :class="$style['item']">
          <small>{{ isFailQuit ? '비밀번호를 다시확인해주세요' : '' }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from '@/util/timing';
import { User } from '@/services/users';
import { getErrorMessage } from '@/util/error';
import { useAuthStore } from '@/stores/AuthStore';
import * as events from 'events';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';

enum eSelectMenu {
  Profile = 0,
  Password = 1,
  Quit = 2
}

enum eProcess {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'MyInfoView',
  components: { WaitButton },
  data() {
    return {
      selectedMenu: eSelectMenu.Profile as eSelectMenu,
      isPasswordSame: true,
      isPasswordShort: false,
      password: '',
      passwordConfirm: '',
      canModifyPassword: false,
      passwordCheck: '',
      isModifyMode: false,
      userName: '',
      userEmail: '',
      passwordModifyStep: eProcess.Init as eProcess,
      passwordModifyMsg: ['변경하기', '', '변경 성공', '변경 실패'],
      userInfoModifyStep: eProcess.Init as eProcess,
      userInfoModifyMsg: ['수정하기', '', '수정하기', '수정 실패'],
      userQuitStep: eProcess.Init as eProcess,
      userQuitMsg: ['탈퇴하기', '', '탈퇴 성공', '탈퇴 실패'],
      debouncedCheckPassword: (...args: any[]): void => {}
    };
  },
  computed: {
    events() {
      return events;
    },
    isSelectedProfile() {
      return this.selectedMenu === eSelectMenu.Profile;
    },
    isSelectedPassword() {
      return this.selectedMenu === eSelectMenu.Password;
    },
    isSelectedQuit() {
      return this.selectedMenu === eSelectMenu.Quit;
    },
    isPasswordChanging() {
      return this.passwordModifyStep === eProcess.Wait;
    },
    isUserInfoChanging() {
      return this.userInfoModifyStep === eProcess.Wait;
    },
    isUserQuitProcessing() {
      return this.userQuitStep === eProcess.Wait;
    },
    isFailQuit() {
      return this.userQuitStep === eProcess.Fail;
    },
    isFailChangePassword() {
      return this.passwordModifyStep === eProcess.Fail;
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
    }
  },
  methods: {
    onClickMenu(event: Event) {
      const select: string | null = (event.target as HTMLElement).getAttribute('data-select');
      if (!select) {
        return;
      }

      this.userQuitStep = eProcess.Init;
      this.userInfoModifyStep = eProcess.Init;
      this.passwordModifyStep = eProcess.Init;
      this.onClickModifyCancel();

      switch (select) {
        case 'profile':
          this.selectedMenu = eSelectMenu.Profile;
          break;
        case 'password':
          this.selectedMenu = eSelectMenu.Password;
          break;
        case 'quit':
          this.selectedMenu = eSelectMenu.Quit;
          break;
        default:
          console.assert(false, 'can not match this select');
          break;
      }
    },
    async onClickChangePassword() {
      if (this.passwordModifyStep === eProcess.Wait) {
        return;
      }

      this.passwordModifyStep = eProcess.Wait;
      try {
        console.log('change password');
        await User.update({ password: this.password, password_confirmation: this.passwordConfirm });
        this.passwordModifyStep = eProcess.Success;
        setTimeout(() => {
          this.$router.push('/');
        }, 1000);
      } catch (e) {
        reportError(getErrorMessage(e));
        this.passwordModifyStep = eProcess.Fail;
      }
    },
    async onClickQuit() {
      if (this.userQuitStep === eProcess.Wait) {
        return;
      }

      this.userQuitStep = eProcess.Wait;

      try {
        await User.delete(this.passwordCheck);

        const authStore = useAuthStore();
        authStore.delete();
        this.userQuitStep = eProcess.Success;

        this.$router.push('/');
      } catch (e) {
        reportError(getErrorMessage(e));
        this.userQuitStep = eProcess.Fail;
      }
    },
    onClickModify() {
      this.isModifyMode = true;
      this.userInfoModifyStep = eProcess.Init;
    },
    async onClickModifySubmit() {
      if (this.userInfoModifyStep === eProcess.Wait) {
        return;
      }

      this.userInfoModifyStep = eProcess.Wait;
      const authStore = useAuthStore();

      try {
        await User.update({ name: this.userName });
        this.userInfoModifyStep = eProcess.Success;
      } catch (e) {
        reportError(getErrorMessage(e));
        this.userName = authStore.user.name;
        this.userInfoModifyStep = eProcess.Fail;
      } finally {
        this.isModifyMode = false;
        console.log(authStore.user.name);
      }
    },
    onClickModifyCancel() {
      const authStore = useAuthStore();
      this.userName = authStore.user.name;
      this.isModifyMode = false;
    },
    onClickQuitInput() {
      if (this.userQuitStep > eProcess.Wait) {
        this.userQuitStep = eProcess.Init;
      }
    }
  },
  created() {
    const authStore = useAuthStore();
    this.userName = authStore.user.name;
    this.userEmail = authStore.user.email;

    this.debouncedCheckPassword = debounce(() => {
      this.canModifyPassword = false;
      this.passwordModifyStep = eProcess.Init;

      if (this.password.length < 8 && this.password.length > 0) {
        this.isPasswordShort = true;
        return;
      }

      if (this.password.length === 0 || this.passwordConfirm.length === 0) {
        this.isPasswordSame = true;
        return;
      }

      if (this.password === this.passwordConfirm) {
        this.isPasswordSame = true;
        this.canModifyPassword = true;
        return;
      }

      this.isPasswordSame = false;
    }, 500);
  }
});
</script>

<style module lang="scss">
.container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .wrapper {
    width: 450px;

    .menu {
      border: $border-normal-line;
      border-radius: 5px;
      box-shadow: $box-shadow-normal;
      background-color: $menu-color;
      color: white;
      margin-bottom: 1rem;

      ul {
        display: flex;

        li {
          padding: 1rem;
          list-style: none;
          color: gray;

          &:hover {
            font-weight: bold;
            cursor: pointer;
          }
        }
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      border: $border-normal-line;
      border-radius: 5px;
      box-shadow: $box-shadow-normal;
      padding: 1rem;

      h2 {
        text-align: center;
        padding: 1rem;
      }

      .item {
        position: relative;
        display: flex;
        padding: 0.5rem;
        width: 100%;

        > * {
        }

        .label {
          min-width: 120px;
          font-weight: bold;
        }

        .value {
        }

        button {
          width: 100%;
          min-height: 2.2rem;
          border: none;
          border-radius: 5px;
          color: white;
          font-weight: bold;
          padding: 0.5rem;
        }

        > small {
          color: red;
        }

        .submit-modify {
          background-color: $primary-color;
          cursor: pointer;

          &:hover {
            filter: brightness(85%);
          }
        }

        .submit-cancel {
          background-color: white;
          margin-right: 1rem;
          color: $primary-color;
          border: $border-normal-line;
          border-color: $primary-color;
        }

        .submit-warning {
          background-color: $weak-caution-color;
          cursor: pointer;

          &:hover {
            filter: brightness(85%);
          }
        }

        .password-wrapper {
          position: relative;
          padding-top: 0.5rem;
          width: 90%;
          padding-bottom: 0.5rem;
          border-bottom: $border-weak-line;

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
  }
}

.selected {
  color: white !important;
  font-weight: bold;
}

.can-modify {
  filter: opacity(50%);
  pointer-events: none;
}
</style>

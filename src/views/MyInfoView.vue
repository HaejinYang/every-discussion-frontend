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
          <span :class="$style['value']">crmerry@gmail.com</span>
        </div>
        <div :class="$style['item']">
          <span :class="$style['label']">이름</span>
          <span :class="$style['value']">씨알메리</span>
        </div>
        <div :class="$style['item']">
          <button :class="$style['submit-modify']">수정하기</button>
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
          <button :class="$style['submit-warning']">변경하기</button>
        </div>
      </div>
      <div :class="$style['content']" v-show="isSelectedQuit">
        <h2>회원 탈퇴</h2>
        <div :class="$style['item']">
          <span :class="$style['label']">계정</span>
          <span :class="$style['value']">crmerry@gmail.com</span>
        </div>
        <div :class="$style['item']">
          <span :class="$style['label']">이름</span>
          <span :class="$style['value']">씨알메리</span>
        </div>
        <div :class="$style['item']">
          <button>수정하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from '@/util/timing';

enum eSelectMenu {
  Profile = 0,
  Password = 1,
  Quit = 2
}

export default defineComponent({
  name: 'MyInfoView',
  data() {
    return {
      selectedMenu: eSelectMenu.Profile as eSelectMenu,
      isPasswordSame: true,
      isPasswordShort: false,
      password: '',
      passwordConfirm: '',
      debouncedCheckPassword: (...args: any[]): void => {}
    };
  },
  computed: {
    isSelectedProfile() {
      return this.selectedMenu === eSelectMenu.Profile;
    },
    isSelectedPassword() {
      return this.selectedMenu === eSelectMenu.Password;
    },
    isSelectedQuit() {
      return this.selectedMenu === eSelectMenu.Quit;
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
      const select: string = (event.target as HTMLElement).getAttribute('data-select');

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
    min-width: 400px;
    max-width: 50%;

    .menu {
      border: $border-default-line;
      border-radius: 5px;
      box-shadow: $box-shadow-default;
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
      border: $border-default-line;
      border-radius: 5px;
      box-shadow: $box-shadow-default;
      padding: 1rem;

      h2 {
        text-align: center;
        padding: 1rem;
      }

      .item {
        display: flex;
        padding: 0.5rem;
        width: 100%;

        .label {
          min-width: 120px;
          font-weight: bold;
        }

        .value {
        }

        button {
          width: 100%;
          border: none;
          border-radius: 5px;
          color: white;
          font-weight: bold;
          padding: 0.5rem;
        }

        .submit-modify {
          background-color: $primary-color;
        }

        .submit-warning {
          background-color: $weak-caution-color;
        }

        .password-wrapper {
          position: relative;
          width: 100%;
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
</style>

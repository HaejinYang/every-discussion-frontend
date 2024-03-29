<template>
  <header :class="$style.container">
    <div :class="$style['title']" @mousedown.left="onClickTitle">
      <img src="@/assets/image/logo.webp" :class="$style['logo']" alt="logo">
      <span>모두의토론</span>
    </div>
    <div v-if="isDisplaySearchBar">
      <SearchBar
        placeholder="의견을 검색하세요"
        :onInputSearch="onInputSearch"
        :ignoreEmptyKeyword="ignoreEmptyKeyword"
      />
    </div>
    <div>
      <div :class="$style['login-wrapper']">
        <button
          v-if="!isLogin"
          :class="$style['login-btn']"
          @mousedown.left="authFormStore.show(eAuthForm.Login)"
        >
          로그인
        </button>
        <button
          v-if="isLogin"
          :class="$style['login-btn']"
          @mousedown.left="onClickMyInfo"
          @mouseover="userMenuHoveredChanged(true)"
          @mouseleave="userMenuHoveredChanged(false)"
        >
          내정보
        </button>

        <div
          :class="$style['login-menu']"
          v-show="isShowUserMenu"
          @mouseover="userMenuHoveredChanged(true)"
          @mouseleave="userMenuHoveredChanged(false)"
        >
          <ul>
            <li @mousedown.left="moveToMyInfo">프로필</li>
            <li @mousedown.left="onClickLogout">로그아웃</li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import { useSearchOpinionStore } from '@/stores/SearchOpinionStore';
import { useAuthStore } from '@/stores/AuthStore';
import { eAuthForm, useAuthFormStore } from '@/stores/AuthFormStore';
import { useCookies } from '@vueuse/integrations/useCookies'
import {AuthService} from "@/services/auth";

export default defineComponent({
  name: 'Header',
  components: { SearchBar },
  data() {
    return {
      isUserMenuHovered: false,
      userMenuHoveredTimer: -1,
      ignoreEmptyKeyword: false,
      authFormStore: useAuthFormStore(),
      cookies: useCookies(['login_token', 'abc'])
    };
  },
  computed: {
    eAuthForm() {
      return eAuthForm;
    },
    isDisplaySearchBar() {
      return this.$route.name === 'discussion';
    },
    isLogin() {
      const authStore = useAuthStore();
      return authStore.authInfo.isAuth;
    },
    isShowUserMenu() {
      return this.isLogin && this.isUserMenuHovered;
    }
  },
  methods: {
    async onInputSearch(keyword: string) {
      const searchOpinionStore = useSearchOpinionStore();
      searchOpinionStore.set(keyword);

      return true;
    },
    onClickTitle() {
      this.$router.push('/');
    },
    onClickLogin() {
      this.$emit('show-login');
    },
    onClickMyInfo() {
      //this.$router.push('/');
    },
    onClickLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push('/');
    },
    userMenuHoveredChanged(hover: boolean) {
      if (!hover) {
        if (this.userMenuHoveredTimer) {
          clearTimeout(this.userMenuHoveredTimer);
        }
        this.userMenuHoveredTimer = window.setTimeout(() => {
          this.isUserMenuHovered = false;
        }, 500);

        return;
      }

      clearTimeout(this.userMenuHoveredTimer);
      this.isUserMenuHovered = true;
    },
    moveToMyInfo() {
      this.$router.push('/user/profile');
    }
  },
  mounted() {
    const store = useAuthStore();
    if (!store.authInfo.isKeepLoggedIn) {
      store.invalidate();
    }

    const login_token: string = this.cookies.get('login_token');
    if(login_token) {
      const authService = new AuthService();
      authService.loginByToken(login_token).then(_ => {
        this.cookies.remove('login_token');
      });
    }
  }
});
</script>

<style module lang="scss">
.container {
  .logo {
    position: absolute;
    left: 0;
    top: -3px;
    width: 50px;
    height: auto;
  }

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem;

  border-bottom: $border-weak-line;

  .title {
    &:hover {
      cursor: pointer;
      font-weight: bold;
    }

    > span {
      margin-left: 35px;
    }
  }

  .login-wrapper {
    position: relative;
    z-index: 999;

    .login-menu {
      position: absolute;
      top: 2.2rem;
      right: 0;
      min-width: 100px;
      border: $border-weak-line;
      background-color: white;
      box-shadow: rgba(0, 0, 0, 0.06) 0 2px 8px;
      padding: 0.5rem;
      border-radius: 5px;

      ul {
        li {
          padding: 0.5rem;
          list-style: none;
          background-color: white;

          &:hover {
            cursor: pointer;
            font-weight: bold;
          }
        }
      }
    }
  }

  .login-btn {
    border: none;
    border-radius: 5px;
    background-color: $primary-color;
    padding: 0.5rem 1rem 0.5rem 1rem;
    font-weight: bold;
    color: white;

    &:hover {
      cursor: pointer;
      filter: brightness(85%);
    }
  }
}
</style>

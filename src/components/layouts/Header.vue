<template>
  <header :class="$style.container">
    <div :class="$style.title" @mousedown.left="onClickTitle">
      <span>모두의토론</span>
    </div>
    <div v-if="isDisplaySearchBar">
      <SearchBar
        placeholder="의견을 검색하세요"
        @on-search-complete="onSearchCompleted"
        :onInputSearch="onInputSearch"
      />
    </div>
    <div>
      <div :class="$style['login-wrapper']">
        <button v-if="!isLogin" :class="$style['login-btn']" @mousedown.left="onClickLogin">
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
            <li @mousedown.lef="moveToMyInfo">프로필</li>
            <li>변경</li>
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
import { useSearchOpinionHandler } from '@/stores/SearchOpinion';
import type { OpinionData } from '@/services/opinions';
import { Opinion } from '@/services/opinions';
import { useAuthHandler } from '@/stores/auth';

export default defineComponent({
  name: 'Header',
  components: { SearchBar },
  data() {
    return {
      isUserMenuHovered: false,
      userMenuHoveredTimer: null as ReturnType<typeof setTimeout>
    };
  },
  computed: {
    isDisplaySearchBar() {
      return this.$route.name === 'discussion';
    },
    isLogin() {
      const authHandler = useAuthHandler();
      return authHandler.isAuth;
    },
    isShowUserMenu() {
      return this.isLogin && this.isUserMenuHovered;
    }
  },
  methods: {
    async onInputSearch(keyword: string) {
      const searchOpinionHandler = useSearchOpinionHandler();
      const opinions = await Opinion.fetchFromTopic(searchOpinionHandler.topicId, keyword);

      return opinions;
    },
    onSearchCompleted(opinions: OpinionData[]) {
      const searchOpinionHandler = useSearchOpinionHandler();
      searchOpinionHandler.showSearchedOpinions();
      searchOpinionHandler.replaceOpinions(opinions);
      console.log(opinions);
    },
    onClickTitle() {
      this.$router.push('/');
    },
    onClickLogin() {
      this.$emit('show-login');
    },
    onClickMyInfo() {
      // TODO: 내 정보를 보여주는 창으로 이동해야함.
      this.$router.push('/');
    },
    onClickLogout() {
      const authHandler = useAuthHandler();
      authHandler.logout();
    },
    userMenuHoveredChanged(hover: boolean) {
      if (!hover) {
        if (this.userMenuHoveredTimer) {
          clearTimeout(this.userMenuHoveredTimer);
        }
        this.userMenuHoveredTimer = setTimeout(() => {
          this.isUserMenuHovered = false;
        }, 500);

        return;
      }

      clearTimeout(this.userMenuHoveredTimer);
      this.isUserMenuHovered = true;
    },
    moveToMyInfo() {
      this.$router.push('/my-info');
    }
  }
});
</script>

<style module lang="scss">
.container {
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
      box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 8px;
      padding: 0.5rem;

      ul {
        li {
          padding: 0.5rem;
          list-style: none;

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
    }
  }
}
</style>

<template>
  <aside :class="$style.container">
    <nav>
      <ul>
        <li @mousedown.left="onClickHomePage">
          <img src="@/assets/image/home.svg" />
          <span>처음 화면</span>
        </li>
        <li @mousedown.left="onClickMyTopics">
          <img src="@/assets/image/bookshelf.svg" />
          <span>참여한 토론</span>
        </li>
        <li @mousedown.left="onClickMyOpinions">
          <img src="@/assets/image/book.svg" />
          <span>작성한 의견</span>
        </li>
        <li @mousedown.left="onClickRegisterTopic">
          <img src="@/assets/image/pencil.svg" />
          <span>토론 생성</span>
        </li>
      </ul>
    </nav>
    <div :class="$style['register-topic']">
      <p>{{ isLogin ? '환영합니다!' : '안녕하세요?' }}</p>
      <span v-show="!isLogin"> 로그인이 필요합니다.</span>

      <div v-show="isLogin" :class="$style['user-info']" @mousedown.left="onClickUserInfo">
        <h3>{{ name }}</h3>
        <p>
          <small>참여 토론: {{ topicsCount }}</small> <small>작성 의견: {{ opinionsCount }}</small>
        </p>
      </div>
    </div>
    <footer :class="$style['footer']">
      <div><span>@2023 모두의토론</span></div>

      <div>
        <img src="@/assets/image/github.svg" @mousedown.left="onClickGoGithub" />
        <img src="@/assets/image/blog.svg" @mousedown.left="onClickGoBlog" />
      </div>
    </footer>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/AuthStore';

export default defineComponent({
  name: 'Aside',
  data() {
    return {
      isDisplayRegisterTopicForm: false
    };
  },
  computed: {
    isLogin() {
      const authStore = useAuthStore();
      return authStore.authInfo.isAuth;
    },
    name() {
      const authStore = useAuthStore();
      return authStore.authInfo.user.name;
    },
    topicsCount() {
      const authStore = useAuthStore();
      return authStore.authInfo.user.topicsCount;
    },
    opinionsCount() {
      const authStore = useAuthStore();
      return authStore.authInfo.user.opinionsCount;
    }
  },
  methods: {
    onClickGoGithub() {
      window.open('https://github.com/HaejinYang', '_blank');
    },
    onClickGoBlog() {
      window.open('https://crmerry.tistory.com/', '_blank');
    },
    onClickHomePage() {
      this.$router.push('/');
    },
    onClickMyTopics() {
      this.$router.push('/user/topics');
    },
    onClickMyOpinions() {
      this.$router.push('/user/opinions');
    },
    onClickRegisterTopic() {
      this.$router.push('/topic/register');
    },
    onClickUserInfo() {
      this.$router.push('/user/profile');
    }
  }
});
</script>

<style module lang="scss">
.container {
  width: 50px;
  display: flex;
  flex-direction: column;
  border-right: $border-weak-line;

  > * {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  nav {
    min-height: 200px;

    ul {
      li {
        list-style-type: none;

        span {
          vertical-align: middle;
          display: none;
        }

        &:hover {
          cursor: pointer;
          font-weight: bold;
        }
      }
    }
  }

  .footer {
    visibility: hidden;
  }

  .register-topic {
    visibility: hidden;
  }

  @media screen and (min-width: $middle-size) {
    border-right: none;

    > * {
      align-items: stretch;
      margin: 1rem;
    }
    nav {
      border-bottom: $border-weak-line;
    }

    .register-topic {
      visibility: visible;
      border-bottom: $border-weak-line;

      .user-info {
        margin: 0.5rem;
        padding: 1rem;
        box-shadow: $box-shadow-normal;
        border: $border-normal-line;
        border-radius: 5px;

        > p {
        }

        &:hover {
          cursor: pointer;
          filter: brightness(85%);
        }
      }
    }

    .footer {
      visibility: visible;
      display: flex;
      flex-direction: column;
      justify-content: center;

      > div {
        > * {
          margin: 0.5rem;
        }

        > img {
          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    nav {
      ul {
        li {
          span {
            display: inline-block;
            margin-left: 5px;
          }
        }

        .register-topic-icon {
          display: none;
        }
      }
    }
  }
}

img {
  width: 32px;
  vertical-align: middle;
}
</style>

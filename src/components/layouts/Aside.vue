<template>
  <aside :class="$style.container">
    <nav>
      <ul>
        <li @mousedown.left="onClickHomePage">
          <img src="@/assets/home.svg" />
          <span>처음 화면</span>
        </li>
        <li @mousedown.left="onClickMyTopics">
          <img src="@/assets/bookshelf.svg" />
          <span>참여한 토론</span>
        </li>
        <li @mousedown.left="onClickMyOpinions">
          <img src="@/assets/book.svg" />
          <span>작성한 의견</span>
        </li>
        <li @mousedown.left="onClickRegisterTopic">
          <img src="@/assets/pencil.svg" />
          <span>토론 생성</span>
        </li>
      </ul>
    </nav>
    <div :class="$style['register-topic']">
      <p>{{ isLogin ? '환영합니다!' : '안녕하세요?' }}</p>
      <span v-show="!isLogin"> 로그아웃 상태입니다.</span>

      <div v-show="isLogin" :class="$style['user-info']">
        <h3>{{ name }}</h3>
        <p>
          <small>참여 토론: {{ topicsCount }}</small> <small>작성 의견: {{ opinionsCount }}</small>
        </p>
      </div>
    </div>
    <footer>
      Lorem ipsum dolor sit amet. Et pariatur dolorem qui incidunt corporis ut exercitationem facere
      quo adipisci sunt. Rem atque fugiat ea voluptas possimus est quos excepturi vel dolor earum et
      sequi
    </footer>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthHandler } from '@/stores/auth';

export default defineComponent({
  name: 'Aside',
  data() {
    return {
      isDisplayRegisterTopicForm: false
    };
  },
  computed: {
    isLogin() {
      const authHandler = useAuthHandler();
      return authHandler.isAuth;
    },
    name() {
      const authHandler = useAuthHandler();
      return authHandler.user.name;
    },
    topicsCount() {
      const authHandler = useAuthHandler();
      return authHandler.user.topicsCount;
    },
    opinionsCount() {
      const authHandler = useAuthHandler();
      return authHandler.user.opinionsCount;
    }
  },
  methods: {
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

  footer {
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

        > p {
        }
      }
    }

    footer {
      visibility: visible;
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

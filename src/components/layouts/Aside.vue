<template>
    <aside :class="$style.container">
        <nav>
            <ul>
                <li>
                    <img src="@/assets/home.svg">
                    <span>처음 화면</span>
                </li>
                <li>
                    <img src="@/assets/bookshelf.svg">
                    <span>참여한 토론</span>
                </li>
                <li>
                    <img src="@/assets/book.svg">
                    <span>작성한 의견</span>
                </li>
                <li>
                    <img src="@/assets/pencil.svg">
                    <span>토론 생성</span>
                </li>
            </ul>
        </nav>
        <div :class="$style['register-topic']">
            <p>안녕하세요?</p>
            <span>
                <button>로그인로그아웃혹은다른것</button>
            </span>
        </div>
        <footer>
            Lorem ipsum dolor sit amet. Et pariatur dolorem qui incidunt corporis ut exercitationem facere quo adipisci
            sunt. Rem atque fugiat ea voluptas possimus est quos excepturi vel dolor earum et sequi
        </footer>
    </aside>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: 'Aside'
})
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

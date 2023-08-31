<template>
  <div :class="$style.container">
    <Header :class="$style.header" />
    <section>
      <Aside :class="$style.aside" />
      <main @wheel="handleWheel($event)" ref="main">
        <div :class="$style['main-item']">
          <RouterView />
        </div>
      </main>
    </section>

    <div :class="$style['register-wrapper']">
      <div :class="$style['register-form']">
        <div>
          <p :class="$style.title">모두의토론</p>
        </div>
        <div :class="$style['account-wrapper']">
          <input :class="$style.account" type="text" id="account" placeholder=" " />
          <label ref="account-label" for="account"><small>계정</small></label>
        </div>
        <div :class="$style['password-wrapper']">
          <input :class="$style.password" type="password" id="password" placeholder=" " />
          <label for="password"><small>비밀번호</small></label>
        </div>
        <div :class="$style['register-from-footer']">
          <span><small>회원가입</small></span>
          <span><small>아이디 / 비밀번호 찾기</small></span>
        </div>
        <div :class="$style['register-btn-wrapper']">
          <button :class="$style['register-form-btn']">회원가입</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/layouts/Header.vue';
import Aside from '@/components/layouts/Aside.vue';
import { RouterView } from 'vue-router';
import { useMainWheelHandler } from '@/stores/MainWheel';

export default defineComponent({
  name: 'App',
  components: { Aside, Header, RouterView },
  computed: {
    isDisabledWheel() {
      const mainWheelHandler = useMainWheelHandler();
      return mainWheelHandler.isDisabled;
    }
  },
  methods: {
    handleWheel(event) {
      if (this.isDisabledWheel) {
        event.preventDefault();

        return;
      }
    }
  }
});
</script>

<style module lang="scss">
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    height: 3rem;
  }

  .register-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);

    display: flex;
    justify-content: center;
    align-items: center;

    .register-form {
      padding: 1rem;
      width: 360px;
      background-color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      > * {
        width: 90%;
        margin: 0.5rem;
        padding-bottom: 0.5rem;
        border-bottom: $border-weak-line;
      }

      > *:first-child {
        border-bottom: none;
      }

      .register-btn-wrapper {
        border-bottom: none;

        .register-form-btn {
          width: 100%;
          padding: 0.5rem;
          border: none;
          color: white;
          font-weight: bold;
          background-color: $primary-color;
          filter: brightness(100%);
          transition: all 300ms ease-in-out;

          &:hover {
            cursor: pointer;
            filter: brightness(90%);
          }
        }
      }

      .register-from-footer {
        border-bottom: none;

        span {
          color: gray;
          font-weight: lighter;

          &:hover {
            cursor: pointer;
            color: blue;
          }
        }

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

      .account-wrapper,
      .password-wrapper {
        position: relative;

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

  section {
    display: flex;
    flex: 1;

    main {
      flex: 1;
      position: relative;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }

      .main-item {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        border-top: 0;
      }
    }

    .aside {
      flex: 0 75px;
      overflow-y: unset;
    }

    @media screen and (min-width: $middle-size) {
      .aside {
        flex: 0 250px;
      }
    }
  }
}
</style>

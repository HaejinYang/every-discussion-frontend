<template>
  <div :class="$style['container']">
    <div :class="$style['login-form']">
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
      <div :class="$style['login-from-footer']">
        <span><small>회원가입</small></span>
        <span><small>아이디 / 비밀번호 찾기</small></span>
      </div>
      <div :class="$style['login-btn-wrapper']">
        <button :class="$style['login-form-btn']">로그인</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginForm'
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

  .login-form {
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

    .login-btn-wrapper {
      border-bottom: none;

      .login-form-btn {
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

    .login-from-footer {
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
</style>

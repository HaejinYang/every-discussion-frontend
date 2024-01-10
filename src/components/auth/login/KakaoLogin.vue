<script setup lang="ts">

import {onMounted, ref} from "vue";

let isKakaoLoginEnabled = ref(true);

onMounted(() => {
  if('Kakao' in window) {
    // 카카오 로그인 초기화
    if (window.Kakao.isInitialized()) {
      isKakaoLoginEnabled.value = true;
    } else {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
      isKakaoLoginEnabled.value = window.Kakao.isInitialized();
    }
  }
});
function onClickLogin() {
  if('Kakao' in window) {
    window.Kakao.Auth.authorize({
      redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
    });
  }
}
</script>

<template>
  <div :class="$style['container']">
    <button :class="$style['kakao-login-btn']" @mousedown.left="onClickLogin" :disabled="!isKakaoLoginEnabled"></button>
  </div>
</template>

<style module lang="scss">
.container {
  > .kakao-login-btn {
    width: 100%;
    min-height: 2.2rem;
    border: none;
    border-radius: 12px; // 카카오 디자인 가이드에 radius 12px 고정
    background: url("@/assets/image/kakao_login_large_wide.png") 0 -5px no-repeat;
    background-size: cover;
    filter: brightness(100%);

    &:hover {
      cursor: pointer;
      filter: brightness(95%);
    }
  }
}
</style>
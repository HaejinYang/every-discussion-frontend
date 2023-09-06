<template>
  <div :class="$style.container">
    <div :class="$style['register-form']">
      <div :class="$style.title">
        <span>토론 생성</span>
      </div>
      <div :class="$style['topic-name-wrapper']">
        <input :class="$style['topic-name']" type="text" placeholder="토론 주제" />
      </div>
      <div :class="$style['topic-description-wrapper']">
        <input :class="$style['topic-description']" type="text" placeholder="토론 설명" />
      </div>

      <div :class="$style['btn-create-wrapper']">
        <button :class="$style['btn-create']">생성</button>
      </div>

      <div :class="$style['btn-search-wrapper']">
        <button :class="$style['btn-search']">비슷한 토론 검색</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RegisterTopicView'
});
</script>

<style module lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;

  .register-form {
    margin-top: 100px;
    border: $border-weak-line;
    padding: 1rem;
    width: 400px;

    > * {
      padding: 0.5rem;
    }

    > *:first-child {
      padding-top: 0;
    }

    > *:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .title {
      text-align: center;
    }

    .topic-name {
      width: 100%;
      border: $border-normal-line;
      padding: 0.5rem;
    }

    .topic-description {
      width: 100%;
      border: $border-normal-line;
      padding: 0.5rem;
    }

    .btn-create {
      width: 100%;
      background-color: $primary-color;
      border: none;
      padding: 0.5rem;
      color: white;
      font-weight: bold;
    }

    .btn-search {
      width: 100%;
      background-color: $primary-color;
      border: none;
      padding: 0.5rem;
      color: white;
      font-weight: bold;
    }
  }
}
</style>

<template>
    <header :class="$style.container">
        <div>
            <span>모두의토론</span>
        </div>
        <div>
            검색창이들어감.
        </div>
        <div>
            <button>로그인</button>
        </div>
    </header>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: "Header"
})
</script>

<style module lang="scss">
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem;

  border-bottom: $border-weak-line;
}

</style>

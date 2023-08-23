<template>
  <div :class="$style.container">
    <input
      :value="searchText"
      @input="searchText = $event.target.value"
      type="text"
      placeholder="토론 주제를 입력하세요"
    />
    <img :class="$style['search-icon']" src="@/assets/search.svg" />
    <img
      :class="$style['spinner-icon']"
      v-show="isShowSearchWaiting"
      src="@/assets/spinner-black.svg"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from '@/util/timing';

export default defineComponent({
  name: 'SearchBar',
  props: {
    onInputSearch: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      searchText: '',
      debouncedSearch: (...args: any[]): void => {},
      searchDelay: 1000,
      isShowSearchWaiting: false
    };
  },
  watch: {
    searchText(keyword) {
      this.isShowSearchWaiting = true;
      this.debouncedSearch(keyword);
    }
  },
  created() {
    this.debouncedSearch = debounce((keyword: string) => {
      const result = this.onInputSearch(keyword);
      this.$emit('on-search-complete', result);
      this.isShowSearchWaiting = false;
    }, this.searchDelay);
  }
});
</script>

<style module lang="scss">
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  > input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2rem;
    border-radius: 50px;
    border: $border-normal-line;
  }

  .search-icon {
    position: absolute;
    height: 1.2rem;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  .spinner-icon {
    position: absolute;
    height: 1.9rem;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>

<template>
  <div :class="$style.container">
    <input :value="searchText" @input="updateSearchText" type="text" :placeholder="placeholder" />
    <img :class="$style['search-icon']" src="@/assets/image/search.svg" />
    <img
      :class="$style['spinner-icon']"
      v-show="isShowSearchWaiting"
      src="../assets/image/spinner-black.svg"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from '@/util/timing';
import { getErrorMessage } from '@/util/error';

export default defineComponent({
  name: 'SearchBar',
  props: {
    onInputSearch: {
      type: Function,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    ignoreEmptyKeyword: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchText: '',
      debouncedSearch: (...args: any[]): void => {},
      searchDelay: 250,
      isShowSearchWaiting: false
    };
  },
  methods: {
    updateSearchText(e: Event) {
      this.searchText = (e.target as HTMLInputElement).value;
    }
  },
  watch: {
    searchText(keyword) {
      this.debouncedSearch(keyword);
    }
  },
  created() {
    this.debouncedSearch = debounce(async (keyword: string) => {
      if (keyword.length < 1 && this.ignoreEmptyKeyword) {
        return;
      }

      this.isShowSearchWaiting = true;

      try {
        const result = await this.onInputSearch(keyword);
        this.$emit('on-search-complete', result);
      } catch (e) {
        reportError(getErrorMessage(e));
        this.$emit('on-search-complete', null);
      } finally {
        this.isShowSearchWaiting = false;
      }
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

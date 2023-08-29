<template>
  <header :class="$style.container">
    <div :class="$style.title" @mousedown.left="onClickTitle">
      <span>모두의토론</span>
    </div>
    <div v-if="isDisplaySearchBar">
      <SearchBar
        placeholder="의견을 검색하세요"
        @on-search-complete="onSearchCompleted"
        :onInputSearch="onInputSearch"
      />
    </div>
    <div>
      <button>로그인</button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import { useSearchOpinionHandler } from '@/stores/SearchOpinion';
import type { Opinion } from '@/services/opinions';

export default defineComponent({
  name: 'Header',
  components: { SearchBar },
  computed: {
    isDisplaySearchBar() {
      console.log(this.$router.path);
      return this.$route.name === 'discussion';
    }
  },
  methods: {
    onInputSearch() {
      return [
        {
          id: 1,
          title: 'abc',
          summary: 'abc',
          content: 'abc',
          like: 10,
          dislike: 20,
          agreeingType: 'agree'
        },
        {
          id: 2,
          title: 'abc',
          summary: 'abc',
          content: 'abc',
          like: 10,
          dislike: 20,
          agreeingType: 'disagree'
        },
        {
          id: 3,
          title: 'abc',
          summary: 'abc',
          content: 'abc',
          like: 10,
          dislike: 20,
          agreeingType: 'agree'
        }
      ];
    },
    onSearchCompleted(opinions: Opinion[]) {
      const SearchOpinionHandler = useSearchOpinionHandler();
      SearchOpinionHandler.showSearchedOpinions();
      SearchOpinionHandler.replaceOpinions(opinions);
    },
    onClickTitle() {
      this.$router.push('/');
    }
  }
});
</script>

<style module lang="scss">
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem;

  border-bottom: $border-weak-line;

  .title {
    &:hover {
      box-shadow: rgba(0, 0, 0, 0.04) 0px 4px 16px 0px;
    }
  }
}
</style>

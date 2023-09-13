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
      <button :class="$style['login-btn']" @mousedown.left="onClickLogin">로그인</button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import { useSearchOpinionHandler } from '@/stores/SearchOpinion';
import type { OpinionData } from '@/services/opinions';
import { Opinion } from '@/services/opinions';

export default defineComponent({
  name: 'Header',
  components: { SearchBar },
  computed: {
    isDisplaySearchBar() {
      return this.$route.name === 'discussion';
    }
  },
  methods: {
    async onInputSearch(keyword: string) {
      const searchOpinionHandler = useSearchOpinionHandler();
      const opinions = await Opinion.fetchFromTopic(searchOpinionHandler.topicId, keyword);

      return opinions;
    },
    onSearchCompleted(opinions: OpinionData[]) {
      const searchOpinionHandler = useSearchOpinionHandler();
      searchOpinionHandler.showSearchedOpinions();
      searchOpinionHandler.replaceOpinions(opinions);
      console.log(opinions);
    },
    onClickTitle() {
      this.$router.push('/');
    },
    onClickLogin() {
      this.$emit('show-login');
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
      box-shadow: $box-shadow-normal;
    }
  }

  .login-btn {
    border: none;
    background-color: $primary-color;
    padding: 0.5rem;
    border-radius: 5px;
    color: white;
  }
}
</style>

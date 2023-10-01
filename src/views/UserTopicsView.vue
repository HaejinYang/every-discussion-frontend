<template>
  <div :class="$style.container">
    <div :class="$style.search">
      <SearchBar
        placeholder="참여한 토론 주제 검색"
        @on-search-complete="onSearchCompleted"
        :onInputSearch="onInputSearch"
        :ignoreEmptyKeyword="ignoreEmptyKeyword"
      />
    </div>
    <div
      :class="$style.wrapper"
      v-for="topic in displayTopics"
      :key="topic.id"
      @mousedown.left="switchToDiscussion(topic.id)"
    >
      <div :class="$style['item']">
        <span :class="$style['label']">주제</span>
        <span :class="$style['value']">{{ topic.title }}</span>
      </div>
      <div :class="$style['item']">
        <span :class="$style['label']">참여자수</span>
        <span :class="$style['value']">{{ topic.participantsCount }}</span>
      </div>
      <div :class="$style['item']">
        <span :class="$style['label']">의견수</span>
        <span :class="$style['value']">{{ topic.opinionsCount }}</span>
      </div>
    </div>
    <div :class="$style['step']" v-show="isNotSuccesLoading">
      {{ msg[step] }}
      <WaitButton v-show="isWaitLoading" position="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { TopicItem } from '@/services/topics';
import { Topic } from '@/services/topics';
import { useAuthHandler } from '@/stores/auth';
import SearchBar from '@/components/SearchBar.vue';
import WaitButton from '@/components/buttons/WaitButton.vue';
import { getErrorMessage } from '@/util/error';

enum eProcess {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3,
  NoResult = 4
}

export default defineComponent({
  name: 'MyTopicsView',
  components: { WaitButton, SearchBar },
  data() {
    return {
      topics: [] as TopicItem[],
      displayTopics: [] as TopicItem[],
      ignoreEmptyKeyword: false,
      step: eProcess.Init as eProcess,
      msg: [
        '토론을 불러오고 있습니다.',
        '토론을 불러오고 있습니다.',
        '',
        '토론 불러오기 실패.',
        '참여한 토론이 없습니다.'
      ]
    };
  },
  computed: {
    isWaitLoading() {
      return this.step === eProcess.Wait;
    },
    isNotSuccesLoading() {
      return this.step !== eProcess.Success;
    }
  },
  methods: {
    switchToDiscussion(id: number) {
      this.$router.push(`/discussion/${id}`);
    },
    onInputSearch(keyword: string) {
      return this.topics.filter((topic) => {
        return topic.title.includes(keyword);
      });
    },
    onSearchCompleted(topics: TopicItem[]) {
      this.displayTopics = topics;
    }
  },
  created() {
    const authHandler = useAuthHandler();

    if (!authHandler.isAuth) {
      this.$router.push('/error/인증이 필요합니다.');

      return;
    }

    const userId = authHandler.user.id;

    this.step = eProcess.Wait;
    Topic.fetchByUser(userId)
      .then((topics: TopicItem[]) => {
        if (topics.length < 1) {
          this.step = eProcess.NoResult;

          return;
        }

        this.topics = topics;
        this.displayTopics = this.topics;
        this.step = eProcess.Success;
      })
      .catch((e) => {
        this.step = eProcess.Fail;
        reportError(getErrorMessage(e));
      });
  }
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .step {
    position: relative;
    margin-top: 1rem;
    padding: 1rem;
    background-color: $wait-color;
    border-radius: 5px;
    color: white;
    min-width: 350px;
    text-align: center;
  }

  .search {
    margin-top: 2rem;
    min-width: 300px;
  }

  .wrapper {
    width: 450px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    margin: 1rem;
    box-shadow: $box-shadow-normal;
    border: $border-normal-line;
    border-radius: 5px;

    .item {
      position: relative;
      display: flex;
      padding: 0.5rem;
      width: 100%;

      .label {
        min-width: 120px;
        font-weight: bold;
      }

      .value {
        min-width: 200px;
      }
    }

    &:hover {
      cursor: pointer;
      box-shadow: $box-shadow-strong;
    }
  }
}
</style>

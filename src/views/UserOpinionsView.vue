<template>
  <div :class="$style['container']">
    <div :class="$style['search']">
      <SearchBar
          placeholder="참여한 토론 주제 검색"
          @on-search-complete="onSearchCompleted"
          :onInputSearch="onInputSearch"
          :ignoreEmptyKeyword="false"
      />
    </div>
    <div :class="$style['info']" v-for="item in displayTopicWithOpinions" :key="item.topic.id">
      <div :class="$style['topic-info']" @mousedown.left="switchToDiscussion(item.topic.id)">
        <span>참여토론</span>
        <p>{{ item.topic.title }}</p>
        <p>참여자수{{ item.topic.participantsCount }}</p>
        <p>의견정보{{ item.topic.opinionsCount }}</p>
      </div>
      <div :class="$style['opinions-wrapper']">
        <div :class="$style['opinions']" v-for="opinion in item.opinions" :key="opinion.id">
          <p>의견 내용</p>
          <p
            :class="$style['opinion-content']"
            @mousedown.left="onClickOpinion(item.topic.id, opinion.id)"
          >
            {{ opinion.title }}
          </p>
          <p>
            추천 {{ opinion.like }}, 비추천 {{ opinion.dislike }}
            <span
              ><button @mousedown.left="onClickModify(opinion, item.topic.id)">수정</button></span
            >
            <span><button @mousedown.left="onClickRemove(opinion.id)">삭제</button></span>
          </p>
        </div>
      </div>
    </div>
    <div ref="fetchMoreTarget">
    </div>
    <div :class="$style['wait']" v-show="isNotSuccesLoading">
      {{ msg[step] }}
      <WaitButton v-show="isWaitLoading" position="right" />
    </div>
    <ModifyOpinion
      v-if="isShowModifyOpinion"
      :prevTitle="modifyOpinionParam.prevTitle"
      :prevContent="modifyOpinionParam.prevContent"
      :opinionId="modifyOpinionParam.opinionId"
      :agreeingType="modifyOpinionParam.agreeingType"
      @update-opinion="onUpdateOpinion"
      @on-click-white-space="onClickPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TopicItem, type TopicWithOpinions } from '@/services/topics';
import { LinkedOpinion, OpinionData } from '@/services/opinions';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { getErrorMessage } from '@/util/error';
import { useDiscussionStore } from '@/stores/DiscussionStore';
import { debounce } from '@/util/timing';
import ModifyOpinion from '@/components/opinions/ModifyOpinion.vue';
import { UserOpinionService } from '@/services/opinions/UserOpinionService';
import {UserTopicsService} from "@/services/topics/UserTopicsService";
import {useIntersectionObserver} from "@vueuse/core";
import SearchBar from "@/components/SearchBar.vue";

enum eProcess {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3,
  NoResult = 4
}

export default defineComponent({
  name: 'MyOpinionsView',
  components: {SearchBar, ModifyOpinion, WaitButton },
  data() {
    return {
      topicWithOpinions: [] as TopicWithOpinions[],
      displayTopicWithOpinions: [] as TopicWithOpinions[],
      step: eProcess.Init as eProcess,
      msg: [
        '의견을 가져오고 있습니다.',
        '의견을 가져오고 있습니다.',
        '',
        '의견 가져오기 실패',
        '작성한 의견이 없습니다.'
      ],
      isShowModifyOpinion: false,
      modifyOpinionParam: {
        topicId: -1,
        agreeingType: 'agree',
        prevTitle: '',
        prevContent: '',
        opinionId: -1
      } as {
        topicId: number;
        agreeingType: 'agree' | 'disagree';
        prevTitle: string;
        prevContent: string;
        opinionId: number;
      },
      debouncedCheckTopicWithOpinionsEmpty: (...args: any): void => {},
      isIntersecting: false,
      nextPageUrl: "",
      userId: -1,
      isRightAfterSearch: false
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
  watch: {
    isIntersecting(newVal) {
      if(!(newVal && this.nextPageUrl && !this.isRightAfterSearch)) {
        return;
      }

      try {
        const topicService = new UserTopicsService();
        topicService.fetchNext(this.nextPageUrl).then((topics) => {
          if (topics.data.length < 1) {
            this.step = eProcess.NoResult;

            return;
          }

          const userOpinionService = new UserOpinionService();
          this.nextPageUrl = topics.nextPageUrl;
          topics.data.map((topic: TopicItem) => {
            userOpinionService.fetchAllInTopic(topic.id).then((opinions: LinkedOpinion[]) => {
              if (opinions.length === 0) {
                return;
              }

              const topicWithOpinions: TopicWithOpinions = {
                topic: topic,
                opinions: opinions
              };

              this.step = eProcess.Success;
              this.topicWithOpinions.push(topicWithOpinions);
              this.displayTopicWithOpinions = this.topicWithOpinions;
              this.debouncedCheckTopicWithOpinionsEmpty();
            });
          });
        });

        this.debouncedCheckTopicWithOpinionsEmpty();
      } catch (e) {
        reportError(getErrorMessage(e));
        this.step = eProcess.Fail;
      }
    }
  },
  methods: {
    onClickPage() {
      this.isShowModifyOpinion = false;
    },
    switchToDiscussion(id: number) {
      this.$router.push(`/discussion/${id}`);
    },
    onClickOpinion(topicId: number, opinionId: number) {
      this.$router.push(`/discussion/${topicId}`);

      const store = useDiscussionStore();
      store.setOpinionIdWhenRedirect(opinionId);
    },
    async onClickRemove(opinionId: number) {
      const userOpinionService = new UserOpinionService();

      try {
        await userOpinionService.delete(opinionId);
        const temp = this.topicWithOpinions.map((item) => {
          const converts = item.opinions.filter((opinion) => opinion.id !== opinionId);
          return { topic: item.topic, opinions: converts };
        });

        this.topicWithOpinions = temp.filter((item) => {
          return item.opinions.length !== 0;
        });
        this.debouncedCheckTopicWithOpinionsEmpty();
      } catch (e) {
        reportError(getErrorMessage(e));
      }
    },
    onClickModify(opinion: OpinionData, topicId: number) {
      this.modifyOpinionParam = {
        topicId: topicId,
        agreeingType: opinion.agreeType,
        prevTitle: opinion.title,
        prevContent: opinion.content,
        opinionId: opinion.id
      };

      this.isShowModifyOpinion = true;
    },
    onUpdateOpinion(updated: OpinionData) {
      this.topicWithOpinions = this.topicWithOpinions.map((item) => {
        const newOpinions = item.opinions.map((opinion) => {
          if (opinion.id === updated.id) {
            return updated;
          }

          return opinion;
        });

        const newItem: TopicWithOpinions = {
          topic: item.topic,
          opinions: newOpinions
        };

        return newItem;
      });

      setTimeout(() => {
        this.isShowModifyOpinion = false;
      }, 500);
    },
    onInputSearch(keyword: string) {
      return this.topicWithOpinions.filter((topicWithOpinions: TopicWithOpinions) => {
        const targets = topicWithOpinions.opinions.filter((opinion: OpinionData) => {
          return opinion.title.includes(keyword);
        });

        return topicWithOpinions.topic.title.includes(keyword) || targets.length !== 0;
      });
    },
    onSearchCompleted(topicWithOpinions: TopicWithOpinions[]) {
      this.isRightAfterSearch = true;
      this.displayTopicWithOpinions = topicWithOpinions;
      if(this.displayTopicWithOpinions.length === this.topicWithOpinions.length) {
        this.isRightAfterSearch = false;
      }
    }
  },
  async mounted() {
    this.debouncedCheckTopicWithOpinionsEmpty = debounce(() => {
      if (this.topicWithOpinions.length === 0) {
        this.step = eProcess.NoResult;
      }
    }, 3000);

    const authStore = useAuthStore();
    if (!authStore.authInfo.isAuth) {
      this.$router.push('/error/인증이 필요합니다.');

      return;
    }

    this.step = eProcess.Wait;
    this.userId = authStore.authInfo.user.id;
    try {
      const topicService = new UserTopicsService();
      const topics = await topicService.fetch(this.userId);
      if (topics.data.length < 1) {
        this.step = eProcess.NoResult;

        return;
      }

      const userOpinionService = new UserOpinionService();
      this.nextPageUrl = topics.nextPageUrl;
      topics.data.map((topic: TopicItem) => {
        userOpinionService.fetchAllInTopic(topic.id).then((opinions: LinkedOpinion[]) => {
          if (opinions.length === 0) {
            return;
          }

          const topicWithOpinions: TopicWithOpinions = {
            topic: topic,
            opinions: opinions
          };

          this.step = eProcess.Success;
          this.topicWithOpinions.push(topicWithOpinions);
          this.displayTopicWithOpinions = this.topicWithOpinions;
          this.debouncedCheckTopicWithOpinionsEmpty();
        });
      });

      this.debouncedCheckTopicWithOpinionsEmpty();
    } catch (e) {
      reportError(getErrorMessage(e));
      this.step = eProcess.Fail;
    }

    useIntersectionObserver(
        this.$refs.fetchMoreTarget as HTMLElement,
        ([{isIntersecting}]) => {
          this.isIntersecting = isIntersecting;
        },
    );
  }
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .search {
    margin-top: 2rem;
    min-width: 300px;
  }

  .wait {
    position: relative;
    margin-top: 1rem;
    padding: 1rem;
    background-color: $wait-color;
    border-radius: 5px;
    color: white;
    min-width: 350px;
    text-align: center;
  }

  .info {
    display: flex;
    justify-content: space-around;
    padding: 1rem;
    border: $border-normal-line;
    box-shadow: $box-shadow-normal;
    margin: 1rem;
    border-radius: 5px;

    > * {
      border: $border-weak-line;
      border-radius: 5px;
    }

    .topic-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 250px;

      padding: 1rem;
      margin-right: 1rem;

      > span {
        text-align: center;
        font-weight: bold;
      }

      > * {
        margin-bottom: 0.5rem;
      }

      &:hover {
        cursor: pointer;
        box-shadow: $box-shadow-strong;
      }
    }

    .opinions-wrapper {
      overflow-y: scroll;
      height: 250px;

      .opinions {
        width: 300px;
        padding: 1rem;
        border-radius: 5px;
        border: $border-weak-line;

        .opinion-content {
          &:hover {
            cursor: pointer;
            box-shadow: $box-shadow-strong;
          }
        }

        > p:first-of-type {
          font-weight: bold;
          text-align: center;
        }

        > p {
          padding: 1rem;
          border-bottom: $border-weak-line;

          &:last-child {
            display: flex;
            justify-content: space-between;
            align-items: center;

            > span {
              > button {
                border: none;
                background-color: $primary-color;
                color: white;
                padding: 0.5rem;
                border-radius: 5px;
                font-weight: bold;

                &:hover {
                  cursor: pointer;
                  filter: brightness(85%);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

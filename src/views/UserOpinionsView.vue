<template>
  <div :class="$style.container">
    <div :class="$style['info']" v-for="item in topicWithOpinions" :key="item.topic.id">
      <div :class="$style['topic-info']" @mousedown.left="switchToDiscussion(item.topic.id)">
        <span>참여토론</span>
        <p>{{ item.topic.title }}</p>
        <p>참여자수{{ item.topic.participantsCount }}</p>
        <p>의견정보{{ item.topic.opinionsCount }}</p>
      </div>
      <div :class="$style['opinions-wrapper']">
        <div :class="$style.opinions" v-for="opinion in item.opinions" :key="opinion.id">
          <p>의견 내용</p>
          <p
            :class="$style['opinion-content']"
            @mousedown.left="onClickOpinion(item.topic.id, opinion.id)"
          >
            {{ opinion.title }}
          </p>
          <p>
            추천 {{ opinion.like }}, 비추천 {{ opinion.dislike }}
            <span><button>수정</button></span>
            <span><button @mousedown.left="onClickRemove(opinion.id)">삭제</button></span>
          </p>
        </div>
      </div>
    </div>
    <div :class="$style.wait" v-show="isNotSuccesLoading">
      {{ msg[step] }}
      <WaitButton v-show="isWaitLoading" position="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Topic, TopicItem, type TopicWithOpinions } from '@/services/topics';
import { OpinionWithReferenceItem } from '@/services/opinions';
import Discussion from '@/components/discussions/Discussion.vue';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { getErrorMessage } from '@/util/error';
import { UserOpinion } from '@/services/opinions/UserOpinion';
import { useDiscussionStore } from '@/stores/DiscussionStore';
import Header from '@/App.vue';

enum eProcess {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3,
  NoResult = 4
}

export default defineComponent({
  name: 'MyOpinionsView',
  components: { Header, WaitButton, Discussion },
  data() {
    return {
      topicWithOpinions: [] as TopicWithOpinions[],
      step: eProcess.Init as eProcess,
      msg: [
        '의견을 가져오고 있습니다.',
        '의견을 가져오고 있습니다.',
        '',
        '의견 가져오기 실패',
        '작성한 의견이 없습니다.'
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
    onClickOpinion(topicId: number, opinionId: number) {
      this.$router.push(`/discussion/${topicId}`);

      const store = useDiscussionStore();
      store.setOpinionIdWhenRedirect(opinionId);
    },
    async onClickRemove(opinionId: number) {
      const authStore = useAuthStore();
      const userOpinion = new UserOpinion(authStore.user.id, authStore.user.token);
      try {
        await userOpinion.delete(opinionId);
        const temp = this.topicWithOpinions.map((item) => {
          const converts = item.opinions.filter((opinion) => opinion.id !== opinionId);
          return { topic: item.topic, opinions: converts };
        });

        this.topicWithOpinions = temp.filter((item) => {
          return item.opinions.length !== 0;
        });
      } catch (e) {
        reportError(getErrorMessage(e));
      }
    }
  },
  async created() {
    const authStore = useAuthStore();
    if (!authStore.isAuth) {
      this.$router.push('/error/인증이 필요합니다.');

      return;
    }

    this.step = eProcess.Wait;
    const userId = authStore.user.id;
    try {
      const topics = await Topic.fetchByUser(userId);
      if (topics.length < 1) {
        this.step = eProcess.NoResult;

        return;
      }

      const userOpinion = new UserOpinion(authStore.user.id, authStore.user.token);
      topics.map((topic: TopicItem) => {
        userOpinion.fetch(topic.id).then((opinions: OpinionWithReferenceItem[]) => {
          if (opinions.length === 0) {
            return;
          }

          this.step = eProcess.Success;

          const topicWithOpinions: TopicWithOpinions = {
            topic: topic,
            opinions: opinions
          };

          this.topicWithOpinions.push(topicWithOpinions);
        });
      });
    } catch (e) {
      reportError(getErrorMessage(e));
      this.step = eProcess.Fail;
    }
  }
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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

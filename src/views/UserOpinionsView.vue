<template>
  <div :class="$style.container">
    <div :class="$style['info']" v-for="item in topicWithOpinions" :key="item.topic.id">
      <div :class="$style['topic-info']" @mousedown.left="switchToDiscussion(item.topic.id)">
        <p>{{ item.topic.title }}</p>
        <p>참여자수{{ item.topic.participantsCount }}</p>
        <p>의견정보{{ item.topic.opinionsCount }}</p>
      </div>
      <div :class="$style['opinions-wrapper']">
        <div :class="$style.opinions" v-for="opinion in item.opinions" :key="opinion.id">
          <p>의견 내용 : {{ opinion.title }}</p>
          <p>
            추천 {{ opinion.like }}, 비추천 {{ opinion.dislike }}
            <span><button>수정</button></span> <span><button>삭제</button></span>
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
import { Opinion, OpinionWithReferenceItem } from '@/services/opinions';
import Discussion from '@/components/discussions/Discussion.vue';
import WaitButton from '@/components/buttons/WaitButton.vue';
import { useAuthHandler } from '@/stores/auth';
import { getErrorMessage } from '@/util/error';

enum eProcess {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3,
  NoResult = 4
}

export default defineComponent({
  name: 'MyOpinionsView',
  components: { WaitButton, Discussion },
  data() {
    return {
      topicWithOpinions: [] as TopicWithOpinions[],
      step: eProcess.Init as eProcess,
      msg: [
        '의견을 가져오고 있습니다.',
        '의견을 가져오고 있습니다.',
        '',
        '의견 가져오기 실패',
        '작성된 의견이 없습니다.'
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
    }
  },
  async created() {
    const authHandler = useAuthHandler();
    if (!authHandler.isAuth) {
      this.$router.push('/error/인증이 필요합니다.');

      return;
    }

    this.step = eProcess.Wait;
    const userId = authHandler.user.id;
    try {
      const topics = await Topic.fetchByUser(userId);
      this.step = eProcess.Success;
      if (topics.length < 1) {
        this.step = eProcess.NoResult;

        return;
      }

      topics.map((topic: TopicItem) => {
        Opinion.fetchFromTopicByUser(topic.id, userId).then(
          (opinions: OpinionWithReferenceItem[]) => {
            const topicWithOpinions: TopicWithOpinions = {
              topic: topic,
              opinions: opinions
            };

            this.topicWithOpinions.push(topicWithOpinions);
          }
        );
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
    box-shadow: $box-shadow-normal;

    .topic-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 250px;
      padding: 1rem;

      &:hover {
        cursor: pointer;
        box-shadow: $box-shadow-strong;
      }
    }

    .opinions-wrapper {
      overflow-y: scroll;
      max-height: 200px;
      box-shadow: $box-shadow-normal;

      .opinions {
        max-width: 300px;
        padding: 1rem;
        box-shadow: $box-shadow-normal;

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

                &:hover {
                  cursor: pointer;
                  box-shadow: $box-shadow-strong;
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

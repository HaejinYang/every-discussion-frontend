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
    <span>MyOpinions</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { type TopicWithOpinions } from '@/services/topics';

export default defineComponent({
  name: 'MyOpinionsView',
  data() {
    return {
      topicWithOpinions: [] as TopicWithOpinions[]
    };
  },
  methods: {
    switchToDiscussion(id: number) {
      this.$router.push(`/discussion/${id}`);
    }
  },
  async created() {
    const userId = 47;
  }
});
</script>

<style module lang="scss">
.container {
  .info {
    display: flex;
    justify-content: space-around;
    padding: 1rem;
    box-shadow: $box-shadow-normal;

    .topic-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 200px;
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

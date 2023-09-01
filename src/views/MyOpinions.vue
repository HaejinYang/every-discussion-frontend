<template>
  <div :class="$style.container">
    <div :class="$style['info']" v-for="item in opinionsInTopic" :key="item.topic.id">
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
import type { OpinionsInTopic, Topic } from '@/services/topics';
import type { AgreeingType, Opinion } from '@/services/opinions';

export default defineComponent({
  name: 'MyOpinions',
  data() {
    return {
      opinionsInTopic: [] as OpinionsInTopic[]
    };
  },
  methods: {
    addItem() {
      for (let index = 0; index < 5; index++) {
        const topic: Topic = {
          id: index,
          title: 'pellendus possimus et neque nesciunt sed delectus maiores non culpa mollitia.',
          host: `홍길동${index}`,
          participantsCount: index * 2,
          opinionsCount: index * 4
        };

        const opinions: Opinion[] = [
          {
            id: index * 3 + 0,
            title: 'pellendus possimus et neque nesciunt sed delectus maiores non culpa mollitia.',
            content:
              'pellendus possimus et neque nesciunt sed delectus maiores non culpa mollitia.',
            summary: 'asdasdasdad',
            like: 10,
            dislike: 20,
            agreeingType: index % 2 === 0 ? 'agree' : ('disagree' as AgreeingType)
          },
          {
            id: index * 3 + 1,
            title: 'pellendus possimus et neque nesciunt sed delectus maiores non culpa mollitia.',
            content:
              'pellendus possimus et neque nesciunt sed delectus maiores non culpa mollitia.',
            summary: 'asdasdasdad',
            like: 10,
            dislike: 20,
            agreeingType: index % 2 === 0 ? 'agree' : 'disagree'
          },
          {
            id: index * 3 + 2,
            title: 'pellendus possimus et neque nesciunt sed delectus maiores non culpa mollitia.',
            content:
              'pellendus possimus et neque nesciunt sed delectus maiores non culpa mollitia.',
            summary: 'asdasdasdad',
            like: 10,
            dislike: 20,
            agreeingType: index % 2 === 0 ? 'agree' : 'disagree'
          }
        ];

        this.opinionsInTopic.push({
          topic: topic,
          opinions: opinions
        });
      }
    },
    switchToDiscussion(id: number) {
      this.$router.push(`/discussion/${id}`);
    }
  },
  created() {
    this.addItem();
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

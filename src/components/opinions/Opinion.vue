<template>
  <div :class="$style.container" @mousedown.left="onClickPage">
    <main ref="main">
      <div :class="$style['refer-opinion']" @wheel="handleWheel($event)">
        <ReferToOpinionComponent v-if="referToOpinion !== null" :opinion="referToOpinion" />
      </div>
      <div
        :class="[
          $style['opinion-info'],
          opinion.agreeingType === 'agree' ? $style.agree : $style.disagree
        ]"
        v-if="opinion !== null"
        @wheel="handleWheel($event)"
      >
        <p>{{ opinion.title }}</p>
        <p>{{ opinion.summary }}</p>
        <p>{{ opinion.content }}</p>
        <p>추천{{ opinion.like }}, 비추천{{ opinion.dislike }}</p>
      </div>
      <div :class="$style['related-opinions']" @wheel="handleWheel($event)">
        <ReferredOpinionComponent :referredOpinions="referredOpinions" />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReferredOpinionComponent from '@/components/opinions/ReferredOpinion.vue';
import ReferToOpinionComponent from '@/components/opinions/ReferToOpinion.vue';
import {
  type AgreeingType,
  type Opinion,
  type ReferredOpinion,
  type ReferToOpinion
} from '@/services/opinions';

export default defineComponent({
  name: 'Opinion',
  components: { ReferToOpinionComponent, ReferredOpinionComponent },
  props: {
    left: {
      type: Number,
      required: true
    },
    top: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      referredOpinions: [] as ReferredOpinion[],
      referToOpinion: null as ReferToOpinion | null,
      opinion: null as Opinion | null
    };
  },
  methods: {
    onClickPage() {
      this.$emit('on-click-anywhere');
    },
    handleWheel(event) {
      event.stopPropagation();
    },
    addReferredOpinions() {
      for (let i = 0; i < 4; i++) {
        let agreeingType: AgreeingType = 'disagree';
        if (i % 2 === 0) {
          agreeingType = 'agree';
        }

        this.referredOpinions.push({
          id: i,
          title:
            'Lorem ipsum dolor sit amet. Ea nihil amet vel Quis voluptate est repellat tempora in labore assumenda et magnam dolor. Et vero autem est unde quia qui molestias quod. Sit dolorem quidem et perferendis facere non consectetur labore eos atque omnis ut porro quae. Nam facere quis aut velit tempore quo accusantium veritatis est repudiandae dolor eos animi facere cum consectetur fuga sit facere eligendi.',
          like: 10,
          dislike: 20,
          agreeingType: agreeingType
        });
      }
    },
    addReferToOpinion() {
      this.referToOpinion = {
        id: 10,
        title:
          'Lorem ipsum dolor sit amet. Ea nihil amet vel Quis voluptate est repellat tempora in labore assumenda et magnam dolor. Et vero autem est unde quia qui molestias quod. Sit dolorem quidem et perferendis facere non consectetur labore eos atque omnis ut porro quae. Nam facere quis aut velit tempore quo accusantium veritatis est repudiandae dolor eos animi facere cum consectetur fuga sit facere eligendi.',
        summary: '서머리입니다.',
        like: 10,
        dislike: 20,
        agreeingType: 'agree'
      };
    },
    addOpinion() {
      this.opinion = {
        id: 11,
        title: '타이틀입니다.',
        content:
          'Lorem ipsum dolor sit amet. Ea nihil amet vel Quis voluptate est repellat tempora in labore assumenda et magnam dolor. Et vero autem est unde quia qui molestias quod. Sit dolorem quidem et perferendis facere non consectetur labore eos atque omnis ut porro quae. Nam facere quis aut velit tempore quo accusantium veritatis est repudiandae dolor eos animi facere cum consectetur fuga sit facere eligendi.',
        summary: '서머리입니다',
        like: 11,
        dislike: 21,
        agreeingType: 'disagree'
      };
    }
  },
  mounted() {
    const main = this.$refs['main'] as HTMLElement | undefined;
    if (main) {
      main.style.top = `${this.top}px`;
    }

    this.addReferredOpinions();
    this.addReferToOpinion();
    this.addOpinion();
  }
});
</script>

<style module lang="scss">
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(5px);

  main {
    position: absolute;
    transform: translateY(-50%);
    height: 600px;
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > * {
      width: 300px;
    }

    .refer-opinion {
      min-height: 150px;
      overflow-y: auto;
    }

    .opinion-info {
      min-height: 150px;
      margin-top: 3rem;
      overflow-y: auto;

      > p {
        padding: 0.5rem;
        margin: 0.5rem;
        border-bottom: $border-weak-line;
      }
    }

    .related-opinions {
      min-height: 150px;
      margin-top: 3rem;
      overflow-y: auto;

      ul {
        li {
        }
      }
    }
  }

  @media screen and (min-width: $large-size) {
    main {
      flex-direction: row;

      > * {
        height: 200px;
      }

      .opinion-info {
        margin: 1rem 3rem;
      }

      .refer-opinion {
        margin: 1rem 3rem;
      }

      .related-opinions {
        margin: 1rem 3rem;
      }
    }
  }
}

.agree {
  background-color: $agree-background-color;
}

.disagree {
  background-color: $disagree-background-color;
}
</style>

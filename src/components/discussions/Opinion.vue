<template>
  <div :class="$style.container" @mousedown.left="onClickPage">
    <main ref="main">
      <div :class="$style['refer-opinion']" @wheel="handleWheel($event)">
        <ReferToOpinionComponent v-if="referToOpinion !== null" :opinion="referToOpinion" />
      </div>
      <div :class="$style['opinion-info']" @wheel="handleWheel($event)">
        <p>
          타이틀: Lorem ipsum dolor sit amet. Aut tempora quas ut rerum delectus ea rerum quisquam
          qui dolorem quibusdam. In Quis sunt ut ipsum sint qui voluptates voluptatum et dolor neque
          ut odio esse eum fugiat officiis.
        </p>
        <p>
          요약: Lorem ipsum dolor sit amet. Aut tempora quas ut rerum delectus ea rerum quisquam qui
          dolorem quibusdam. In Quis sunt ut ipsum sint qui voluptates voluptatum et dolor neque ut
          odio esse eum fugiat officiis.
        </p>
        <p>
          콘텐츠: Lorem ipsum dolor sit amet. Aut tempora quas ut rerum delectus ea rerum quisquam
          qui dolorem quibusdam. In Quis sunt ut ipsum sint qui voluptates voluptatum et dolor neque
          ut odio esse eum fugiat officiis. Lorem ipsum dolor sit amet. Aut tempora quas ut rerum
          delectus ea rerum quisquam qui dolorem quibusdam. In Quis sunt ut ipsum sint qui
          voluptates voluptatum et dolor neque ut odio esse eum fugiat officiis.
        </p>
        <p>추천10, 비추천20</p>
      </div>
      <div :class="$style['related-opinions']" @wheel="handleWheel($event)">
        <ReferredOpinionComponent :referredOpinions="referredOpinions" />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReferredOpinionComponent from '@/components/discussions/ReferredOpinion.vue';
import ReferToOpinionComponent from '@/components/discussions/ReferToOpinion.vue';
import { type AgreeingType, type ReferredOpinion, type ReferToOpinion } from '@/services/opinions';

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
      referToOpinion: null as ReferToOpinion | null
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
    }
  },
  mounted() {
    const main = this.$refs['main'] as HTMLElement | undefined;
    if (main) {
      main.style.top = `${this.top}px`;
    }

    this.addReferredOpinions();
    this.addReferToOpinion();
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
  transition: all 1s ease-in-out;

  main {
    position: absolute;
    transform: translateY(-50%);
    height: 600px;
    width: 100%;
    padding: 2rem;
    background-color: orange;
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
</style>

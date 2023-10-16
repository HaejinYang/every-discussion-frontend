<template>
  <div :class="$style.container" @mousedown.left="onClickPage">
    <div :class="$style.wrapper">
      <div :class="$style.box">
        <div :class="$style['refer-opinion']" v-if="referTo !== null">
          <ReferToOpinionComponent :opinion="referTo" />
        </div>
        <div
          :class="[
            $style['opinion-info'],
            opinion.agreeType === 'agree' ? $style.agree : $style.disagree
          ]"
          v-if="opinion !== null"
        >
          <div>
            <p>선택의견</p>
            <fieldset>
              <legend>타이틀</legend>
              <p>{{ opinion.title }}</p>
            </fieldset>
            <fieldset>
              <legend>요약</legend>
              <p>{{ opinion.summary }}</p>
            </fieldset>
            <fieldset>
              <legend>본문</legend>
              <p>{{ opinion.content }}</p>
            </fieldset>
            <fieldset>
              <legend>추천</legend>
              <p>추천{{ opinion.like }}, 비추천{{ opinion.dislike }}</p>
            </fieldset>
          </div>
        </div>
        <div :class="$style['related-opinions']" v-if="referred.length !== 0">
          <ReferredOpinionComponent :referredOpinions="referred" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReferredOpinionComponent from '@/components/opinions/ReferredOpinion.vue';
import ReferToOpinionComponent from '@/components/opinions/ReferToOpinion.vue';
import { Opinion, type OpinionData, type OpinionWithReferenceItem } from '@/services/opinions';

export default defineComponent({
  name: 'OpinionItem',
  components: { ReferToOpinionComponent, ReferredOpinionComponent },
  props: {
    opinionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      referTo: null as OpinionData | null,
      opinion: null as OpinionWithReferenceItem | null,
      referred: [] as OpinionData[]
    };
  },
  watch: {
    opinionId(newOpinionId: number) {
      Opinion.fetch(newOpinionId).then((opinion: OpinionWithReferenceItem) => {
        this.assignOpinion(opinion);
      });
    }
  },
  methods: {
    onClickPage() {
      this.$emit('on-click-anywhere');
    },
    assignOpinion(opinion: OpinionWithReferenceItem) {
      this.opinion = opinion;
      this.referTo = opinion.referTo;
      let temp = [] as OpinionData[];
      temp.push(...opinion.referred);
      temp.push(...opinion.referred);
      temp.push(...opinion.referred);
      temp.push(...opinion.referred);
      temp.push(...opinion.referred);

      this.referred = temp;
    }
  },
  async created() {
    const opinion = await Opinion.fetch(this.opinionId);
    this.assignOpinion(opinion);
  }
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .wrapper {
    margin-top: 3rem;

    .box {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;

      > * {
        width: 200px;
        height: 310px;
        overflow: auto;
        margin: 3rem;
        border-radius: 5px;

        &::-webkit-scrollbar {
          display: none;
        }

        fieldset {
          border-radius: 5px;
        }
      }

      .refer-opinion {
      }

      .opinion-info {
        color: white;

        div {
          padding: 0.5rem;

          > p {
            text-align: center;
          }

          fieldset {
            border: $border-weak-line;
            margin-top: 0.5rem;

            p {
              padding: 0.5rem;
            }
          }
        }
      }

      .related-opinions {
      }
    }
  }
}

@media screen and (min-width: $middle-size) {
  .container {
    .wrapper {
      .box {
        flex-direction: row;
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

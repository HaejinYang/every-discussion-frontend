<template>
  <div :class="$style.container" @mousedown.left="onClickPage">
    <div :class="$style.box">
      <div :class="$style['refer-opinion']">
        <ReferToOpinionComponent v-if="referTo !== null" :opinion="referTo" />
      </div>
      <div
        :class="[
          $style['opinion-info'],
          opinion.agreeType === 'agree' ? $style.agree : $style.disagree
        ]"
        v-if="opinion !== null"
        @wheel="handleWheel($event)"
      >
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
      <div :class="$style['related-opinions']" @wheel="handleWheel($event)">
        <ReferredOpinionComponent :referredOpinions="referred" />
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
  methods: {
    onClickPage() {
      this.$emit('on-click-anywhere');
    }
  },
  async created() {
    const opinion = await Opinion.fetch(this.opinionId);
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
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;

  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    > * {
      width: 200px;
      max-height: 310px;
      overflow: auto;
      margin: 3rem;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .refer-opinion {
    }

    .opinion-info {
      margin: 0.5rem;
      padding: 0.5rem;
      color: white;

      fieldset {
        border: $border-weak-line;
        margin-top: 0.5rem;

        p {
          padding: 0.5rem;
        }
      }
    }

    .related-opinions {
    }
  }
}

@media screen and (min-width: $middle-size) {
  .container {
    .box {
      flex-direction: row;
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

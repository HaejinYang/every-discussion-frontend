<template>
  <div :class="$style.container" @mousedown.left="onClickPage">
    <main ref="main">
      <div :class="$style['refer-opinion']" @wheel="handleWheel($event)">
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
        <p>{{ opinion.title }}</p>
        <p>{{ opinion.summary }}</p>
        <p>{{ opinion.content }}</p>
        <p>추천{{ opinion.like }}, 비추천{{ opinion.dislike }}</p>
      </div>
      <div :class="$style['related-opinions']" @wheel="handleWheel($event)">
        <ReferredOpinionComponent :referredOpinions="referred" />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReferredOpinionComponent from '@/components/opinions/ReferredOpinion.vue';
import ReferToOpinionComponent from '@/components/opinions/ReferToOpinion.vue';
import { type Opinion, OpinionApi, type OpinionWithReference } from '@/services/opinions';

export default defineComponent({
  name: 'OpinionItem',
  components: { ReferToOpinionComponent, ReferredOpinionComponent },
  props: {
    left: {
      type: Number,
      required: true
    },
    top: {
      type: Number,
      required: true
    },
    opinionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      referTo: null as Opinion | null,
      opinion: null as OpinionWithReference | null,
      referred: [] as Opinion[]
    };
  },
  methods: {
    onClickPage() {
      this.$emit('on-click-anywhere');
    },
    handleWheel(event: Event) {
      event.stopPropagation();
    }
  },
  async created() {
    console.log(this.opinionId);
    const opinion = await OpinionApi.fetch(this.opinionId);
    this.opinion = opinion;
    this.referTo = opinion.referTo;
    this.referred = opinion.referred;

    console.log(opinion.referred);
  },
  mounted() {
    const main = this.$refs['main'] as HTMLElement | undefined;
    if (main) {
      main.style.top = `${this.top}px`;
    }
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
      width: 400px;
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

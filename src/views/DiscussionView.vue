<template>
  <div :class="$style.container" v-if="!isDisplayingSearchedOpinions">
    <div :class="$style.title">
      <h1>{{ topic?.title }}</h1>
    </div>
    <div :class="$style.opinions">
      <div :class="$style.agree">
        <Discussion agreeingType="agree" :topicId="topicId" />
        <div :class="$style['submit-agree']">
          <button @mousedown.left="displayRegisterOpinion('agree')">의견제시</button>
        </div>
      </div>

      <div :class="$style.disagree">
        <Discussion agreeingType="disagree" :topicId="topicId" />
        <div :class="$style['submit-disagree']">
          <button @mousedown.left="displayRegisterOpinion('disagree')">의견제시</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else :class="$style.container">
    <OpinionList :opinions="searchedOpinions" />
  </div>
  <div v-if="isDisplayingRegisterForm" :class="$style.register">
    <RegisterOpinion
      :agreeingType="opinionTypeOfRegistering"
      :isShowReference="isShowReferenceOfRegistering"
      :topicId="topicId"
      @remove-form="disableRegisterForm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Discussion from '@/components/discussions/Discussion.vue';
import { useSearchOpinionHandler } from '@/stores/SearchOpinion';
import OpinionList from '@/components/opinions/OpinionList.vue';
import type { AgreeingType } from '@/services/opinions';
import RegisterOpinion from '@/components/opinions/RegisterOpinion.vue';
import { getTopic, type Topic } from '@/services/topics';

export default defineComponent({
  name: 'DiscussionView',
  components: { RegisterOpinion, OpinionList, Discussion },
  props: {
    topicId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isDisplayingRegisterForm: false,
      topic: null as Topic | null,
      opinionTypeOfRegistering: 'agree' as AgreeingType,
      isShowReferenceOfRegistering: false
    };
  },
  computed: {
    isDisplayingSearchedOpinions() {
      const handler = useSearchOpinionHandler();
      return handler.isDisplayingSearchedOpinions;
    },
    searchedOpinions() {
      const handler = useSearchOpinionHandler();
      return handler.opinions;
    }
  },
  methods: {
    displayRegisterOpinion(type: AgreeingType) {
      this.isDisplayingRegisterForm = true;
      this.opinionTypeOfRegistering = type;
    },
    disableRegisterForm() {
      this.isDisplayingRegisterForm = false;
    }
  },
  beforeCreate() {
    const handler = useSearchOpinionHandler();
    handler.hideSearchedOpinions();
  },
  async created() {
    const topic = await getTopic(this.topicId);
    this.topic = topic;
  },
  mounted() {}
});
</script>

<style module lang="scss">
.container {
  background-color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    padding: 1rem;
  }

  .opinions {
    display: flex;
    flex-direction: column;

    .agree {
      padding: 1rem;
      border: $border-normal-line;
    }

    .disagree {
      padding: 1rem;
      border: $border-normal-line;
    }

    .submit-agree,
    .submit-disagree {
      text-align: center;
      margin-top: 1rem;

      > button {
        width: 100%;
        padding: 0.5rem;
        background-color: transparent;
        border: none;
        color: white;
        font-weight: bold;
      }
    }

    .submit-agree {
      background-color: $agree-background-color;
    }

    .submit-disagree {
      background-color: $disagree-background-color;
    }
  }
}

.register {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

@media screen and (min-width: $middle-size) {
  .container {
    .opinions {
      flex-direction: row;
    }
  }
}
</style>

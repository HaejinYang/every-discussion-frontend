<template>
  <div :class="$style.container">
    <div :class="$style['register-form']">
      <div :class="$style.header">
        <span>토론 생성</span>
      </div>
      <div :class="$style['topic-titles']">
        <div :class="$style['topic-name-wrapper']">
          <input
            :class="$style['topic-name']"
            type="text"
            placeholder="토론 주제"
            :value="title"
            @input="(event) => (title = (event.target as HTMLTextAreaElement).value)"
          />
          <SimilarTopics :topics="similarTopics" />
        </div>
        <WaitButton v-show="isSearchingSimliarTopics" position="right" color="black" />
      </div>
      <div :class="$style['topic-description-wrapper']">
        <input
          :class="$style['topic-description']"
          type="text"
          placeholder="토론 설명"
          :value="description"
          @input="(event) => (description = (event.target as HTMLTextAreaElement).value)"
        />
      </div>

      <div :class="$style['btn-create-wrapper']">
        <button :class="$style['btn-create']" @mousedown.left.prevent="submitTopic">
          {{ submitBtnMessags[submitStep] }}
          <a href="#" v-if="isRegisterSuccess" @mousedown.left.stop="moveToTopic"> 토론 바로가기</a>
        </button>
        <WaitButton v-show="isWait" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Topic, TopicItem } from '@/services/topics';
import WaitButton from '@/components/common/animations/WaitAnimation.vue';
import { debounce } from '@/util/timing';
import SimilarTopics from '@/components/topics/SimilarTopics.vue';
import { getErrorMessage } from '@/util/error';

enum eProcessStep {
  Init = 0,
  Wait = 1,
  Success = 2,
  Fail = 3
}

export default defineComponent({
  name: 'RegisterTopicView',
  components: { SimilarTopics, WaitButton },
  data() {
    return {
      title: '',
      description: '',
      submitBtnMessags: ['생성', '', '생성완료! ', '생성실패!'],
      submitStep: eProcessStep.Init as eProcessStep,
      createdTopicId: -1,
      debouncedSearchSimilarTitle: (...args: any[]): void => {},
      similarTopics: [] as TopicItem[],
      searchStep: eProcessStep.Init as eProcessStep
    };
  },
  computed: {
    isWait() {
      return eProcessStep.Wait === this.submitStep;
    },
    isSearchingSimliarTopics() {
      return eProcessStep.Wait === this.searchStep;
    },
    isRegisterSuccess() {
      return eProcessStep.Success === this.submitStep;
    }
  },
  watch: {
    title(newTitle: string) {
      if (newTitle.length < 1) {
        this.similarTopics = [];

        return;
      }

      this.searchStep = eProcessStep.Wait;
      this.debouncedSearchSimilarTitle(newTitle);
    },
    description(newDescription: string) {}
  },
  methods: {
    async submitTopic() {
      if (this.submitStep === eProcessStep.Wait || this.submitStep === eProcessStep.Success) {
        return;
      }

      this.submitStep = eProcessStep.Wait;
      try {
        const topic = await Topic.create(this.title, this.description);
        this.createdTopicId = topic.id;
        this.submitStep = eProcessStep.Success;
      } catch (e) {
        this.submitStep = eProcessStep.Fail;
        reportError(getErrorMessage(e));
      }
    },
    moveToTopic() {
      this.$router.push(`/discussion/${this.createdTopicId}`);
    }
  },
  created() {
    this.similarTopics = [];

    this.debouncedSearchSimilarTitle = debounce(async (title: string) => {
      try {
        const topics = await Topic.search(title);
        this.similarTopics = topics.data;
      } catch (e) {
        reportError(getErrorMessage(e));
      } finally {
        this.searchStep = eProcessStep.Init;
      }
    }, 100);
  }
});
</script>

<style module lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;

  .register-form {
    margin-top: 100px;
    border: $border-normal-line;
    padding: 1rem;
    width: 400px;
    border-radius: 5px;

    > * {
      padding: 0.5rem;
    }

    > *:first-child {
      padding-top: 0;
    }

    > *:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .header {
      text-align: center;
    }

    .topic-titles {
      position: relative;

      .topic-name-wrapper {
        position: relative;

        .topic-name {
          width: 100%;
          border: $border-weak-line;
          padding: 0.5rem;
          border-radius: 5px;
        }
      }
    }

    .topic-description {
      width: 100%;
      border: $border-weak-line;
      padding: 0.5rem;
      border-radius: 5px;
    }

    .btn-create-wrapper {
      position: relative;
      min-height: 2.2rem;
      padding: 0.5rem;

      .btn-create {
        min-height: 2.2rem;
        width: 100%;
        background-color: $primary-color;
        color: white;
        font-weight: bold;
        border-radius: 5px;
        border: none;

        &:hover {
          cursor: pointer;
          filter: brightness(85%);
        }

        > a {
          color: white;
        }
      }
    }
  }
}
</style>

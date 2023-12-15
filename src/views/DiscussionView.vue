<template>
  <div :class="$style.container">
    <div :class="$style['content']">
      <div :class="$style['title']" @mousedown.left="onClickTitle">
        <h1>{{ isShowDiscussion ? topic?.title : '' }}</h1>
        <div :class="[$style['spread'], isShowOpinionDetail ? $style.show : null]">
          <img src="@/assets/caret.svg" alt="참조" />
        </div>
      </div>
      <button @click.left="switchListOrGraph" :class="$style['goto-graph']">{{isShowOpinionList ? "그래프 보기" : "리스트 보기"}}</button>
      <div :class="[$style['opinions'], isShowOpinionList ? null : $style.short]">
        <div :class="$style['agree']">
          <Discussion
            agreeingType="agree"
            :topicId="topicId"
            :isShow="isShowDiscussion"
            @on-load-completion="onLoadDiscussions('agree')"
          />
          <div :class="$style['submit-agree']">
            <button @mousedown.left="displayRegisterOpinion('agree')">의견제시</button>
          </div>
        </div>

        <div :class="$style['disagree']">
          <Discussion
            agreeingType="disagree"
            :topicId="topicId"
            :isShow="isShowDiscussion"
            @on-load-completion="onLoadDiscussions('disagree')"
          />
          <div :class="$style['submit-disagree']">
            <button @mousedown.left="displayRegisterOpinion('disagree')">의견제시</button>
          </div>
        </div>
      </div>
      <OpinionGraph v-show="isShowOpinionGraph" :topicId="id"/>
    </div>
  </div>
  <div>
    <OpinionItem v-if="isShowOpinionDetail" :opinionId="selectedOpinionId" :topicId="topicId" />
  </div>
  <div v-if="isDisplayingRegisterForm" :class="$style.register">
    <RegisterOpinion
      :agreeingType="opinionTypeOfRegistering"
      :topicId="topicId"
      @remove-form="disableRegisterForm"
      @register-opinion="onRegisterOpinion"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Discussion from '@/components/discussions/Discussion.vue';
import type { AgreeingType } from '@/services/opinions';
import { OpinionData } from '@/services/opinions';
import RegisterOpinion from '@/components/opinions/RegisterOpinion.vue';
import { type TopicItem, TopicService } from '@/services/topics';
import { useDiscussionStore } from '@/stores/DiscussionStore';
import OpinionItem from '@/components/opinions/OpinionItem.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { eAuthForm, useAuthFormStore } from '@/stores/AuthFormStore';
import { useNewOpinionStore } from '@/stores/NewOpinionStore';
import OpinionGraph from "@/components/opinions/OpinionGraph.vue";

export default defineComponent({
  name: 'DiscussionView',
  components: {OpinionGraph, OpinionItem, RegisterOpinion, Discussion },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isDisplayingRegisterForm: false,
      topic: null as TopicItem | null,
      opinionTypeOfRegistering: 'agree' as AgreeingType,
      isShowReferenceOfRegistering: false,
      isLoadDiscussionAgree: false,
      isLoadDiscussionDisagree: false
    };
  },
  computed: {
    isShowDiscussion() {
      return this.isLoadDiscussionDisagree && this.isLoadDiscussionAgree;
    },
    topicId() {
      return parseInt(this.id);
    },
    isShowOpinionDetail() {
      const store = useDiscussionStore();
      return store.isShowOpinionDetail;
    },
    isShowOpinionList() {
      const store = useDiscussionStore();
      return store.isShowOpinionList;
    },
    isShowOpinionGraph() {
      const store = useDiscussionStore();
      return store.isShowOpinionGraph;
    },
    selectedOpinionId() {
      const store = useDiscussionStore();
      return store.selectedOpinionId;
    }
  },

  methods: {
    switchListOrGraph() {
      const store = useDiscussionStore();
      if(store.isShowOpinionList) {
        store.showOpinionGraph();
      } else if(store.isShowOpinionGraph) {
        store.showOpinionList();
      } else {
        store.showOpinionList();
      }
    },
    onLoadDiscussions(at: 'agree' | 'disagree') {
      if (at === 'agree') {
        this.isLoadDiscussionAgree = true;
      }

      if (at === 'disagree') {
        this.isLoadDiscussionDisagree = true;
      }
    },
    displayRegisterOpinion(type: AgreeingType) {
      const authStore = useAuthStore();
      if (!authStore.authInfo.isAuth) {
        const authFormStore = useAuthFormStore();
        authFormStore.show(eAuthForm.Login);

        return;
      }

      this.isDisplayingRegisterForm = true;
      this.opinionTypeOfRegistering = type;
    },
    disableRegisterForm() {
      this.isDisplayingRegisterForm = false;
    },
    onClickTitle() {
      const store = useDiscussionStore();
      store.showOpinionList();
    },
    onRegisterOpinion(opinion: OpinionData) {
      const store = useNewOpinionStore();
      store.addOpinion(this.topicId, opinion);
    }
  },
  async created() {
    const topicService = new TopicService();
    this.topic = await topicService.fetch(this.topicId);

    const store = useDiscussionStore();
    if (store.selectedOpinionId !== -1 && store.isShowOpinionWhenRedirect) {
      store.showOpinionDetail(store.selectedOpinionId);
    } else {
      store.showOpinionList();
    }
    store.isShowOpinionWhenRedirect = false;
  }
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .content {
    .goto-graph {
      border: none;
      border-radius: 5px;
      background-color: $primary-color;
      padding: 0.5rem 1rem 0.5rem 1rem;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: white;

      &:hover {
        cursor: pointer;
        filter: brightness(85%);
      }
    }

    .title {
      position: relative;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;

      &:hover {
        cursor: pointer;
      }

      .spread {
        position: absolute;
        bottom: -60%;
        left: 50%;
        opacity: 0;

        transition: all 1s ease-in-out;
      }
    }

    .opinions {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      max-height: 1000px;
      overflow: hidden;
      transition: all 1s ease-in-out;
      border-radius: 5px;

      .agree {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 300px;
        max-height: 400px;
        padding: 1rem;
        border: $border-normal-line;
        border-radius: 5px;
        margin-bottom: 1rem;
      }

      .disagree {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 300px;
        max-height: 400px;
        padding: 1rem;
        border: $border-normal-line;
        border-radius: 5px;
      }

      .submit-agree,
      .submit-disagree {
        text-align: center;
        margin-top: 1rem;
        border-radius: 5px;

        &:hover {
          filter: brightness(85%);
        }

        > button {
          width: 100%;
          padding: 0.5rem;
          background-color: transparent;
          border: none;
          color: white;
          font-weight: bold;

          &:hover {
            cursor: pointer;
          }
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
    .content {
      .opinions {
        flex-direction: row;

        .agree {
          margin-bottom: 0;
          margin-right: 1rem;
        }
      }
    }
  }
}

.short {
  max-height: 0 !important;
}

.show {
  opacity: 1 !important;
}
</style>

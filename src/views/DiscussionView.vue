<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <div :class="$style.title" @mousedown.left="onClickTitle">
        <h1>{{ topic?.title }}</h1>
        <div :class="[$style.spread, isFold ? $style.show : null]">
          <img src="@/assets/caret.svg" />
        </div>
      </div>
      <div :class="[$style.opinions, isFold ? $style.short : null]">
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
  </div>
  <div>
    <OpinionItem v-if="isShowOpinionDetail" :opinion-id="selectedOpinionId" />
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
import OpinionList from '@/components/opinions/OpinionList.vue';
import type { AgreeingType } from '@/services/opinions';
import RegisterOpinion from '@/components/opinions/RegisterOpinion.vue';
import { Topic, type TopicItem } from '@/services/topics';
import { useDiscussionHandler } from '@/stores/DiscussionHandler';
import OpinionItem from '@/components/opinions/OpinionItem.vue';
import { useAuthHandler } from '@/stores/auth';
import { useShowAuthFormHandler } from '@/stores/ShowAuthForm';

export default defineComponent({
  name: 'DiscussionView',
  components: { OpinionItem, RegisterOpinion, OpinionList, Discussion },
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
      isShowReferenceOfRegistering: false
    };
  },
  computed: {
    topicId() {
      return parseInt(this.id);
    },
    isFold() {
      const handler = useDiscussionHandler();
      return handler.isFoldOpinionList;
    },
    isShowOpinionDetail() {
      const handler = useDiscussionHandler();
      return handler.selectedOpinionId !== -1;
    },
    selectedOpinionId() {
      const handler = useDiscussionHandler();
      return handler.selectedOpinionId;
    }
  },
  methods: {
    displayRegisterOpinion(type: AgreeingType) {
      const authHandler = useAuthHandler();
      if (!authHandler.isAuth) {
        const authFormHandler = useShowAuthFormHandler();
        authFormHandler.showAuth();
        authFormHandler.showLogin();

        return;
      }

      this.isDisplayingRegisterForm = true;
      this.opinionTypeOfRegistering = type;
    },
    disableRegisterForm() {
      this.isDisplayingRegisterForm = false;
    },
    onClickTitle() {
      const handler = useDiscussionHandler();
      handler.hideOpinionDetaily();
    }
  },
  async created() {
    const topic = await Topic.fetch(this.topicId);
    this.topic = topic;

    const handler = useDiscussionHandler();
    if (handler.selectedOpinionId !== -1 && handler.isShowOpinionWhenRedirect) {
      handler.displayOpinionDetailly(handler.selectedOpinionId);
    } else {
      handler.hideOpinionDetaily();
    }
    handler.isShowOpinionWhenRedirect = false;
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
    .title {
      position: relative;
      padding: 1rem;

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
        min-height: 400px;
        padding: 1rem;
        border: $border-normal-line;
        border-radius: 5px;
        margin-bottom: 1rem;
      }

      .disagree {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 400px;
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
          margin-bottom: 0rem;
          margin-right: 1rem;
        }
      }
    }
  }
}

.short {
  max-height: 0px !important;
}

.show {
  opacity: 1 !important;
}
</style>

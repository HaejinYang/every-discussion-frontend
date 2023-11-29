<template>
  <div :class="$style.container" @mousedown.left="onClickPage($event)">
    <div :class="$style.wrapper">
      <div :class="$style.box">
        <div :class="$style['refer-opinion']" v-if="referTo !== null">
          <ReferToOpinionComponent :opinion="referTo" />
        </div>
        <div :class="$style['opinion-info-wrapper']">
          <div
            :class="[
              $style['opinion-info'],
              opinion.agreeType === 'agree' ? $style.agree : $style.disagree
            ]"
            v-if="opinion !== null"
          >
            <div>
              <div :class="$style['header-box']">
                <div :class="$style['header']"><p>선택의견</p></div>
              </div>
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
          <div :class="$style['register-opinion']" v-if="opinion !== null">
            <button @mousedown.left="onClickRegisterOpinion('agree')">보강</button>
            <button @mousedown.left="onClickRegisterOpinion('disagree')">반박</button>
          </div>
        </div>
        <div :class="$style['related-opinions']" v-if="referred.length !== 0">
          <ReferredOpinionComponent :referredOpinions="referred" />
        </div>
      </div>
    </div>
    <div>
      <AddingToOpinion
        v-if="isDisplayRegisterOpinion && opinion !== null"
        :type="registerOpinionType"
        :targetOpinionId="opinion.id"
        :topicId="topicId"
        :title="addingToOpinionTitle"
        @result="onRecvResultAddingToOpinion"
        @on-click-close="onClickAddingToOpinionClose"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReferredOpinionComponent from '@/components/opinions/ReferredOpinion.vue';
import ReferToOpinionComponent from '@/components/opinions/ReferToOpinion.vue';
import { type LinkedOpinion, type OpinionData } from '@/services/opinions';
import RegisterOpinion from '@/components/opinions/RegisterOpinion.vue';
import OpinionWriter from '@/components/opinions/OpinionWriterForm.vue';
import AddingToOpinion from '@/components/opinions/AddingToOpinion.vue';
import { eAuthForm, useAuthFormStore } from '@/stores/AuthFormStore';
import { useAuthStore } from '@/stores/AuthStore';
import { OpinionService } from '@/services/opinions/OpinionService';

export default defineComponent({
  name: 'OpinionItem',
  components: {
    AddingToOpinion,
    OpinionWriter,
    RegisterOpinion,
    ReferToOpinionComponent,
    ReferredOpinionComponent
  },
  props: {
    opinionId: {
      type: Number,
      required: true
    },
    topicId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      referTo: null as OpinionData | null,
      opinion: null as LinkedOpinion | null,
      referred: [] as OpinionData[],
      isDisplayRegisterOpinion: false,
      registerOpinionType: 'agree' as 'agree' | 'disagree',
      addingToOpinionTitle: ''
    };
  },
  watch: {
    opinionId(newOpinionId: number) {
      const opinionService = new OpinionService();
      opinionService.fetch(newOpinionId).then((opinion: LinkedOpinion) => {
        this.assignOpinion(opinion);
      });
    }
  },
  methods: {
    onClickAddingToOpinionClose() {
      this.isDisplayRegisterOpinion = false;
    },
    onRecvResultAddingToOpinion(result: 'success' | 'fail') {
      if (result === 'success') {
        setTimeout(() => {
          this.isDisplayRegisterOpinion = false;
        }, 1000);
      }
    },
    onClickPage(event: Event) {
      if (event.target !== event.currentTarget) {
        return;
      }

      this.isDisplayRegisterOpinion = false;
      this.$emit('on-click-anywhere');
    },
    assignOpinion(opinion: LinkedOpinion) {
      this.opinion = opinion;
      this.referTo = opinion.referTo;
      this.referred = opinion.referred;
    },
    onClickRegisterOpinion(type: 'agree' | 'disagree') {
      const authFormStore = useAuthFormStore();
      const authSrote = useAuthStore();
      if (!authSrote.authInfo.isAuth) {
        authFormStore.show(eAuthForm.Login);
      } else {
        this.isDisplayRegisterOpinion = true;
        this.registerOpinionType = type;
        if (this.registerOpinionType === 'agree') {
          this.addingToOpinionTitle = '보강';
        } else {
          this.addingToOpinionTitle = '반박';
        }

        if (this.opinion) {
          if (this.opinion.agreeType === 'disagree') {
            if (type === 'agree') {
              this.addingToOpinionTitle = '보강';
              this.registerOpinionType = 'disagree';
            } else {
              this.addingToOpinionTitle = '반박';

              this.registerOpinionType = 'agree';
            }
          }
        }
      }
    }
  },
  async created() {
    const opinionService = new OpinionService();
    const opinion = await opinionService.fetch(this.opinionId);
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
        transition: all 300ms ease-in-out 0s;

        &:hover {
          width: 500px;
          border: $border-strong-white-line;
        }

        &::-webkit-scrollbar {
          display: none;
        }

        fieldset {
          border-radius: 5px;
        }
      }

      .refer-opinion {
      }

      .opinion-info-wrapper {
        .opinion-info {
          color: white;

          div {
            padding: 0.5rem;

            .header-box {
              position: relative;

              .header {
                text-align: center;
              }
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

        .register-opinion {
          display: flex;
          justify-content: end;

          > * {
            padding: 0.5rem;
            margin-left: 0.5rem;
            margin-top: 0.5rem;
            background-color: white;
            border: $border-normal-line;
            border-radius: 5px;
            font-weight: bold;

            &:hover {
              filter: brightness(95%);
              cursor: pointer;
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

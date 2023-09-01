<template>
  <div :class="$style.container" @mousedown.left="disableForm">
    <div>
      <div :style="{ textAlign: 'center' }">
        {{ pickedAgreeOrDisagree === 'agree' ? '찬성' : '반대' }}
      </div>

      <div>
        <textarea type="text" placeholder="제목" />
      </div>
      <div>
        <textarea placeholder="본문" />
      </div>
      <div :style="{ textAlign: 'right' }">
        <input type="radio" id="agree" value="agree" v-model="pickedAgreeOrDisagree" />
        <label for="one">보강</label>

        <input type="radio" id="disagree" value="disagree" v-model="pickedAgreeOrDisagree" />
        <label for="two">반박</label>
      </div>
      <div :style="{ textAlign: 'center' }">
        <button :class="agreeingType === 'agree' ? $style.agree : $style.disagree">제출</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RegisterOpinion',
  props: {
    agreeingType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pickedAgreeOrDisagree: 'agree'
    };
  },
  methods: {
    disableForm() {
      this.$emit('remove-form');
    }
  }
});
</script>

<style module lang="scss">
.container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    padding: 1rem;
    width: 60%;
    background-color: white;
    box-shadow: $box-shadow-normal;

    > div {
      padding: 1rem;
      border-bottom: $border-weak-line;

      > textarea {
        width: 100%;
        height: 100px;
        border: 1px solid gray;
      }

      > input {
        margin-left: 0.5rem;
      }

      > button {
        width: 100%;
        padding: 1rem;
        border: none;
        color: white;
        font-size: 1rem;
        font-weight: bold;
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

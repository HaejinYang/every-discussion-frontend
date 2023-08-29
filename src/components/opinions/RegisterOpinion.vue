<template>
  <div :class="[$style.container, agreeingType === 'agree' ? $style.agree : $style.disagree]">
    <input type="text" placeholder="제목" />
    <input type="text" placeholder="본문" />
    <input type="radio" id="agree" value="agree" v-model="picked" />
    <label for="one">보강</label>

    <input type="radio" id="disagree" value="disagree" v-model="picked" />
    <label for="two">반박</label>
    <div>
      {{ pickedAgreeOrDisagree }}
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
      pickedAgreeOrDisagree: ''
    };
  }
});
</script>

<style module lang="scss">
.container {
}

.agree {
  background-color: $agree-background-color;
}

.disagree {
  background-color: $disagree-background-color;
}
</style>

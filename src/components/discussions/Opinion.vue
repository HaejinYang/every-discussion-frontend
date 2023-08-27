<template>
  <div :class="$style.container" @mousedown.left="onClickPage">
    <main ref="main" @wheel="handleWheel($event)">
      <div :class="$style['opinion-info']">
        <p>
          Lorem ipsum dolor sit amet. Aut tempora quas ut rerum delectus ea rerum quisquam qui
          dolorem quibusdam. In Quis sunt ut ipsum sint qui voluptates voluptatum et dolor neque ut
          odio esse eum fugiat officiis.
        </p>
        <p>
          Lorem ipsum dolor sit amet. Aut tempora quas ut rerum delectus ea rerum quisquam qui
          dolorem quibusdam. In Quis sunt ut ipsum sint qui voluptates voluptatum et dolor neque ut
          odio esse eum fugiat officiis.
        </p>
        <p>
          Lorem ipsum dolor sit amet. Aut tempora quas ut rerum delectus ea rerum quisquam qui
          dolorem quibusdam. In Quis sunt ut ipsum sint qui voluptates voluptatum et dolor neque ut
          odio esse eum fugiat officiis. Lorem ipsum dolor sit amet. Aut tempora quas ut rerum
          delectus ea rerum quisquam qui dolorem quibusdam. In Quis sunt ut ipsum sint qui
          voluptates voluptatum et dolor neque ut odio esse eum fugiat officiis.
        </p>
        <p>추천10, 비추천20</p>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Opinion',
  props: {
    left: {
      type: Number,
      required: true
    },
    top: {
      type: Number,
      required: true
    }
  },
  methods: {
    onClickPage() {
      this.$emit('on-click-anywhere');
    },
    handleWheel(event) {
      event.stopPropagation();
    }
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
  transition: all 1s ease-in-out;

  main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%);
    max-height: 400px;
    max-width: 300px;
    padding: 1rem;
    background-color: white;

    display: flex;

    .opinion-info {
      overflow-y: auto;
    }
  }
}
</style>

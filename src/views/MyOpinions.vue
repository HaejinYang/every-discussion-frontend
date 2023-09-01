<template>
  <div :class="$style.container">
    <div :class="$style['info']" v-for="index in 5" :key="index">
      <div :class="$style['topics-info']">
        <p>토론제목</p>
        <p>참여자수</p>
        <p>의견정보</p>
      </div>
      <div :class="$style['opinions-wrapper']">
        <div :class="$style.opinions">
          <p>
            의견 내용 : Lorem ipsum dolor sit amet. Vel saepe quisquam et quod nisi in autem neque
            ab qui
          </p>
          <p>
            추천 10, 비추천 10 <span><button>수정</button></span> <span><button>삭제</button></span>
          </p>
        </div>
        <div :class="$style.opinions">
          <p>
            의견 내용 : Lorem ipsum dolor sit amet. Vel saepe quisquam et quod nisi in autem neque
            ab qui
          </p>
          <p>
            추천 10, 비추천 10 <span><button>수정</button></span> <span><button>삭제</button></span>
          </p>
        </div>
        <div :class="$style.opinions">
          <p>
            의견 내용 : Lorem ipsum dolor sit amet. Vel saepe quisquam et quod nisi in autem neque
            ab qui
          </p>
          <p>
            추천 10, 비추천 10 <span><button>수정</button></span> <span><button>삭제</button></span>
          </p>
        </div>
      </div>
    </div>
    <span>MyOpinions</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MyOpinions'
});
</script>

<style module lang="scss">
.container {
  .info {
    display: flex;
    justify-content: space-around;
    padding: 1rem;

    .topics-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .opinions-wrapper {
      overflow-y: scroll;
      max-height: 200px;
      box-shadow: $box-shadow-normal;

      .opinions {
        max-width: 300px;
        padding: 1rem;
        box-shadow: $box-shadow-normal;

        > p {
          padding: 1rem;
          border-bottom: $border-weak-line;

          > span {
            float: right;
          }
        }
      }
    }
  }
}
</style>

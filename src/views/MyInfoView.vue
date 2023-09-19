<template>
  <div :class="$style['container']">
    <div :class="$style['menu']">
      <ul @mousedown.left="onClickMenu($event)">
        <li :class="[isSelectedProfile ? $style['selected'] : null]" data-select="profile">
          프로필
        </li>
        <li :class="[isSelectedPassword ? $style['selected'] : null]" data-select="password">
          비밀번호 변경
        </li>
        <li :class="[isSelectedQuit ? $style['selected'] : null]" data-select="quit">회원 탈퇴</li>
      </ul>
    </div>
    <div :class="$style['content']" v-show="isSelectedProfile">
      <h2>프로필</h2>
      <div :class="$style['item']">
        <span :class="$style['label']">계정</span>
        <span :class="$style['value']">crmerry@gmail.com</span>
      </div>
      <div :class="$style['item']">
        <span :class="$style['label']">이름</span>
        <span :class="$style['value']">씨알메리</span>
      </div>
      <div :class="$style['item']">
        <button>수정하기</button>
      </div>
    </div>
    <div :class="$style['content']" v-show="isSelectedPassword">
      <h2>비밀번호 변경</h2>
      <div :class="$style['item']">
        <span :class="$style['label']">계정</span>
        <span :class="$style['value']">crmerry@gmail.com</span>
      </div>
      <div :class="$style['item']">
        <span :class="$style['label']">이름</span>
        <span :class="$style['value']">씨알메리</span>
      </div>
      <div :class="$style['item']">
        <button>수정하기</button>
      </div>
    </div>
    <div :class="$style['content']" v-show="isSelectedQuit">
      <h2>회원 탈퇴</h2>
      <div :class="$style['item']">
        <span :class="$style['label']">계정</span>
        <span :class="$style['value']">crmerry@gmail.com</span>
      </div>
      <div :class="$style['item']">
        <span :class="$style['label']">이름</span>
        <span :class="$style['value']">씨알메리</span>
      </div>
      <div :class="$style['item']">
        <button>수정하기</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

enum eSelectMenu {
  Profile = 0,
  Password = 1,
  Quit = 2
}

export default defineComponent({
  name: 'MyInfoView',
  data() {
    return {
      selectedMenu: eSelectMenu.Profile as eSelectMenu
    };
  },
  computed: {
    isSelectedProfile() {
      return this.selectedMenu === eSelectMenu.Profile;
    },
    isSelectedPassword() {
      return this.selectedMenu === eSelectMenu.Password;
    },
    isSelectedQuit() {
      return this.selectedMenu === eSelectMenu.Quit;
    }
  },
  methods: {
    onClickMenu(event: Event) {
      const select: string = (event.target as HTMLElement).getAttribute('data-select');

      switch (select) {
        case 'profile':
          this.selectedMenu = eSelectMenu.Profile;
          break;
        case 'password':
          this.selectedMenu = eSelectMenu.Password;
          break;
        case 'quit':
          this.selectedMenu = eSelectMenu.Quit;
          break;
        default:
          console.assert(false, 'can not match this select');
          break;
      }
    }
  }
});
</script>

<style module lang="scss">
.container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .menu {
    border: $border-default-line;
    border-radius: 5px;
    box-shadow: $box-shadow-default;
    background-color: $menu-color;
    color: white;
    margin-bottom: 1rem;

    ul {
      display: flex;

      li {
        padding: 1rem;
        list-style: none;
        color: gray;

        &:hover {
          font-weight: bold;
          cursor: pointer;
        }
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    border: $border-default-line;
    border-radius: 5px;
    box-shadow: $box-shadow-default;
    padding: 1rem;

    h2 {
      text-align: center;
      padding: 1rem;
    }

    .item {
      display: flex;
      padding: 0.5rem;

      .label {
        min-width: 120px;
        font-weight: bold;
      }

      .value {
      }

      button {
        width: 100%;
        border: none;
        border-radius: 5px;
        background-color: $primary-color;
        color: white;
        font-weight: bold;
        padding: 0.5rem;
      }
    }
  }
}

.selected {
  color: white !important;
  font-weight: bold;
}
</style>

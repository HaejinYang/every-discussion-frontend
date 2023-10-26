import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DiscussionView from '@/views/DiscussionView.vue';
import ErrorView from '@/views/ErrorView.vue';
import { useAuthStore } from '@/stores/AuthStore';
import { useAuthFromStore } from '@/stores/AuthFormStore';
import TopicRegisterView from '@/views/TopicRegisterView.vue';
import UserTopicsView from '@/views/UserTopicsView.vue';
import UserProfileView from '@/views/UserProfileView.vue';
import UserOpinionsView from '@/views/UserOpinionsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/discussion/:id',
      name: 'discussion',
      component: DiscussionView,
      props: true
    },
    {
      path: '/user/topics',
      name: 'user-topics',
      component: UserTopicsView
    },
    {
      path: '/user/opinions',
      name: 'user-opinions',
      component: UserOpinionsView
    },
    {
      path: '/topic/register',
      name: 'topic-register',
      component: TopicRegisterView
    },
    {
      path: '/user/profile',
      name: 'user-profile',
      component: UserProfileView
    },
    {
      path: '/error/:msg',
      name: 'error',
      component: ErrorView,
      props: true
    }
  ]
});

router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  switch (to.name) {
    case 'user-opinions':
    // fall-through
    case 'user-topics':
    // fall-through
    case 'topic-register':
    // fall-through
    case 'user-profile':
      if (!authStore.isAuth) {
        const authFormStore = useAuthFromStore();
        authFormStore.showAuth();
        authFormStore.showLogin();

        return { name: 'home' };
      }
      break;
    default:
      // 아무일도 하지 않는다.
      break;
  }
});

export default router;

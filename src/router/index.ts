import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DiscussionView from '@/views/DiscussionView.vue';
import MyTopicsView from '@/views/MyTopicsView.vue';
import MyOpinionsView from '@/views/MyOpinionsView.vue';
import RegisterTopicView from '@/views/RegisterTopicView.vue';
import MyInfoView from '@/views/MyInfoView.vue';
import ErrorView from '@/views/ErrorView.vue';
import { useAuthHandler } from '@/stores/auth';
import { useShowAuthFormHandler } from '@/stores/ShowAuthForm';

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
      component: MyTopicsView
    },
    {
      path: '/user/opinions',
      name: 'user-opinions',
      component: MyOpinionsView
    },
    {
      path: '/topic/register',
      name: 'topic-register',
      component: RegisterTopicView
    },
    {
      path: '/user/profile',
      name: 'user-profile',
      component: MyInfoView
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
  const authHandler = useAuthHandler();
  switch (to.name) {
    case 'user-opinions':
    case 'user-topics':
    case 'topic-register':
    case 'user-profile':
      if (!authHandler.isAuth) {
        const authFormHandler = useShowAuthFormHandler();
        authFormHandler.showAuth();
        return { name: from.name };
      }
      break;
  }
});

export default router;

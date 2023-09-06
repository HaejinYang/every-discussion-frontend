import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DiscussionView from '@/views/DiscussionView.vue';
import MyTopicsView from '@/views/MyTopicsView.vue';
import MyOpinionsView from '@/views/MyOpinionsView.vue';
import RegisterTopicView from '@/views/RegisterTopicView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/discussion/:topicId',
      name: 'discussion',
      component: DiscussionView,
      props: true
    },
    {
      path: '/my-topics',
      name: 'my-topics',
      component: MyTopicsView
    },
    {
      path: '/my-opinions',
      name: 'my-opinions',
      component: MyOpinionsView
    },
    {
      path: '/topic-register',
      name: 'topic-register',
      component: RegisterTopicView
    }
  ]
});

export default router;

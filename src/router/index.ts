import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DiscussionView from '@/views/DiscussionView.vue';
import MyOpinions from '@/views/MyOpinions.vue';
import MyTopics from '@/views/MyTopics.vue';

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
      path: '/mytopics',
      name: 'mytopics',
      component: MyTopics
    },
    {
      path: '/myopinions',
      name: 'myopinions',
      component: MyOpinions
    }
  ]
});

export default router;

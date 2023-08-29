import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DiscussionView from '@/views/DiscussionView.vue';
import MyOpinions from '@/views/MyOpinions.vue';
import MyTopics from '@/views/MyTopics.vue';
import RegisterTopic from '@/views/RegisterTopic.vue';

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
      component: MyTopics
    },
    {
      path: '/my-opinions',
      name: 'my-opinions',
      component: MyOpinions
    },
    {
      path: '/topic-register',
      name: 'topic-register',
      component: RegisterTopic
    }
  ]
});

export default router;

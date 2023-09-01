import type { Opinion } from '@/services/opinions';

interface Topic {
  id: number;
  title: string;
  host: string;
  participantsCount: number;
  opinionsCount: number;
}

interface OpinionsInTopic {
  topic: Topic;
  opinions: Opinion[];
}

export { type Topic, type OpinionsInTopic };

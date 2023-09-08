import 'reflect-metadata';
import fetchApi from '@/util/network';
import { Expose, plainToInstance } from 'class-transformer';

type AgreeingType = 'agree' | 'disagree';

class Opinion {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  summary: string;

  @Expose()
  like: number;

  @Expose()
  dislike: number;

  @Expose({ name: 'agree_type' })
  agreeType: AgreeingType;

  @Expose({ name: 'created_at' })
  createdAt: string;

  @Expose({ name: 'updated_at' })
  updatedAt: string;
}

interface ReferredOpinion {
  id: number;
  title: string;
  like: number;
  dislike: number;
  agreeingType: AgreeingType;
}

interface ReferToOpinion {
  id: number;
  title: string;
  summary: string;
  like: number;
  dislike: number;
  agreeingType: AgreeingType;
}

const getOpinions = async (topicId: number) => {
  const response = await fetchApi(`/api/topics/${topicId}/opinions`, {
    method: 'GET',
    credentials: 'include'
  });

  const result = await response.json();
  const opinions: Opinion[] = plainToInstance(Opinion, result.data);
  return opinions;
};

export { type Opinion, type ReferredOpinion, type AgreeingType, type ReferToOpinion, getOpinions };

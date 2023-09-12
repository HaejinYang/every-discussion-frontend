import 'reflect-metadata';
import fetchApi from '@/util/network';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { throwErrorWhenResponseNotOk } from '@/util/error';

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

class OpinionWithReference extends Opinion {
  @Expose({ name: 'refer_to' })
  referTo: Opinion;

  @Type(() => Opinion)
  @Expose()
  referred: Opinion[];
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

interface RegisterOpinion {
  topicId: number;
  title: string;
  content: string;
  agreeingType: AgreeingType;
}

const getOpinionsInDiscussion = async (topicId: number, keyword = '') => {
  let url = `/api/topics/${topicId}/opinions`;
  if (keyword.length > 0) {
    url += `?keyword=${keyword}`;
  }

  const response = await fetchApi(url, {
    method: 'GET',
    credentials: 'include'
  });

  throwErrorWhenResponseNotOk(response);

  const result = await response.json();
  const opinions: Opinion[] = plainToInstance(Opinion, result.data);
  return opinions;
};

const registerOpinion = async (opinion: RegisterOpinion) => {
  const response = await fetchApi('/api/opinions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(opinion)
  });

  throwErrorWhenResponseNotOk(response);

  return true;
};

const getOpinionsWithReference = async (opinionId: number) => {
  const response = await fetchApi(`/api/opinions/${opinionId}`, {
    method: 'GET',
    credentials: 'include'
  });

  throwErrorWhenResponseNotOk(response);

  const result = await response.json();
  const opinion: OpinionWithReference = plainToInstance(OpinionWithReference, result.data);

  return opinion;
};

export {
  type Opinion,
  type ReferredOpinion,
  type AgreeingType,
  type ReferToOpinion,
  type OpinionWithReference,
  getOpinionsInDiscussion,
  registerOpinion,
  getOpinionsWithReference
};

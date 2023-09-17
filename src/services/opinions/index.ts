import 'reflect-metadata';
import { fetchApi } from '@/util/network';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { throwErrorWhenResponseNotOk } from '@/util/error';

type AgreeingType = 'agree' | 'disagree';

class OpinionData {
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

class OpinionWithReferenceItem extends OpinionData {
  @Expose({ name: 'refer_to' })
  referTo: OpinionData;

  @Type(() => OpinionData)
  @Expose()
  referred: OpinionData[];
}

interface RegisterOpinion {
  topicId: number;
  title: string;
  content: string;
  agreeingType: AgreeingType;
}

class Opinion {
  public static async fetch(opinionId: number) {
    const response = await fetchApi(`/api/opinions/${opinionId}`, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const opinion: OpinionWithReferenceItem = plainToInstance(
      OpinionWithReferenceItem,
      result.data
    );

    return opinion;
  }

  public static async fetchFromTopic(topicId: number, keyword = '') {
    let URI = `/api/topics/${topicId}/opinions`;
    if (keyword.length > 0) {
      URI += `?keyword=${keyword}`;
    }

    const response = await fetchApi(URI, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const opinions: OpinionData[] = plainToInstance(OpinionData, <any[]>result.data);
    return opinions;
  }

  public static async fetchFromTopicByUser(topicId: number, userId: number) {
    const response = await fetchApi(`/api/users/${userId}/topics/${topicId}/opinions`, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const opinions: OpinionWithReferenceItem[] = plainToInstance(
      OpinionWithReferenceItem,
      <any[]>result.data
    );

    return opinions;
  }

  public static async create(opinion: RegisterOpinion) {
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
  }
}

export { type OpinionData, type AgreeingType, type OpinionWithReferenceItem, Opinion };

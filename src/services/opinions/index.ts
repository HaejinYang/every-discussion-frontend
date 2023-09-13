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

interface RegisterOpinion {
  topicId: number;
  title: string;
  content: string;
  agreeingType: AgreeingType;
}

class OpinionApi {
  public static async fetch(opinionId: number) {
    const response = await fetchApi(`/api/opinions/${opinionId}`, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const opinion: OpinionWithReference = plainToInstance(OpinionWithReference, result.data);

    return opinion;
  }

  public static async fetchDataInTopic(topicId: number, keyword = '') {
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
    const opinions: Opinion[] = plainToInstance(Opinion, <any[]>result.data);
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

export { type Opinion, type AgreeingType, type OpinionWithReference, OpinionApi };

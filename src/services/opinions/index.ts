import 'reflect-metadata';
import { Expose, Type } from 'class-transformer';

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

class LinkedOpinion extends OpinionData {
  @Expose({ name: 'refer_to' })
  referTo: OpinionData;

  @Type(() => OpinionData)
  @Expose()
  referred: OpinionData[];
}

export { type AgreeingType, OpinionData, LinkedOpinion };

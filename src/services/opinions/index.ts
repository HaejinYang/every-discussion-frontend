type AgreeingType = 'agree' | 'disagree';

interface Opinion {
  id: number;
  title: string;
  content: string;
  like: number;
  dislike: number;
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

export { type Opinion, type ReferredOpinion, type AgreeingType, type ReferToOpinion };

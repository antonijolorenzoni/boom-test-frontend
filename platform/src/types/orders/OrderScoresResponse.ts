export interface OrderScoresResponse {
  scores: Score[];
  boomAverageScore: number;
  companyScore: number;
  totalScore: number;
  complete: boolean;
}

export interface Score {
  comment?: string;
  id: number;
  score: number;
  type: ScoreType;
}

export enum ScoreType {
  COMPOSITION,
  EQUIPMENT,
  TECHNIQUE,
  ACCURACY,
  COMPANY,
}

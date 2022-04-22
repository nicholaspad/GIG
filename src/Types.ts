// Question types

export enum QuestionType {
  SINGLE_CHOICE,
}

export type SingleChoiceQuestion = {
  options: string[];
};

export type GenericQuestion = {
  type: QuestionType;
  idx: number;
  id: string;
  question: string;
  content: SingleChoiceQuestion;
};

// Response types

export type SingleChoiceResponse = {
  idx: number;
};

export type GenericResponse = {
  type: QuestionType;
  questionId: string;
  response: SingleChoiceResponse;
};

// Task types

export type TaskProps = {
  id?: string;
  title: string;
  description: string;
  estCompletionTime?: number;
  questions: GenericQuestion[];
};

export type TaskOverviewData = TaskData & {
  description: string;
  estimatedTime: number;
  requestorWallet: string;
  contractAddress: string;
  created: Date;
};

export type TaskStatus = 0 | 1 | 2 | 3;

export type CreatedTaskStatus = 0 | 1 | 2;

export type TaskData = {
  task_id: string;
  name: string;
  rating?: number;
  status?: TaskStatus | CreatedTaskStatus;
  reward: string;
  maxRewardWei?: string;
  numResponses?: number;
  maxResponses?: number;
};

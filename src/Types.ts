export type mcQuestionProps = {
  idx: number;
  id?: string;
  question: string;
  options: string[];
};

export type questionProps = {
  type: number;
  idx: number;
  id: string;
  question: string;
  options?: string[];
};

export type taskProps = {
  id?: string;
  title: string;
  description: string;
  options: mcQuestionProps[];
};

export type TaskOverviewData = TaskData & {
  description: string;
  estimatedTime: number;
  requestorWallet: string;
  created: Date;
};

export type TaskStatus = 0 | 1 | 2 | 3;

export type CreatedTaskStatus = 0 | 1 | 2;

export type TaskData = {
  task_id: string;
  name: string;
  rating?: number;
  status?: TaskStatus | CreatedTaskStatus;
  reward: number;
  maxReward?: number;
  numResponses?: number;
  maxResponses?: number;
};

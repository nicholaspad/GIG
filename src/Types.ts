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

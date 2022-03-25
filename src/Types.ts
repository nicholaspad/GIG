export type TaskStatus = 0 | 1 | 2 | 3;

export type TaskData = {
    task_id: number;
    name: string;
    rating?: number;
    status?: TaskStatus;
    reward: number;
};

export type mcQuestionProps = {
    idx: number;
    id: string;
    question: string;
    options: string[];
}

export type questionProps = {
    type: number;
    idx: number;
    id: string;
    question: string;
    options?: string[];
}
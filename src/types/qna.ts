export interface QuestionDetail {
    id: string;
    title: string;
    content: string;
    author: string;
    authorId: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    answersCount: number;
    views: number;
    isResolved: boolean;
    votes: number;
    answers: Answer[];
}

export interface Answer {
    id: string;
    questionId: string;
    content: string;
    author: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    votes: number;
    isAccepted: boolean;
}

export interface AnswerFormData {
    content: string;
}

/* eslint-disable prettier/prettier */
export interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url?: string;
  keypoints?: { id: string; content: string }[];
  questions?: {
    id: string;
    question: string;
    choices: string[];
    correctAnswer: string;
  }[];
  scores?: {
    [school_id: string]: {
      answers: { [questionId: string]: string };
      score: number;
      attempts: number;
    };
  };
  isEnabled: boolean;
  difficulty: string;
}

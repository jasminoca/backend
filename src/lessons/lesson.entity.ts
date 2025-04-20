/* eslint-disable prettier/prettier */
export class Lesson {
  id?: string;
  title?: string;
  description?: string;
  youtube_url?: string;
  keypoints?: { id: string; content: string }[];
  questions?: {
    id: string;
    question: string;
    choices: string[];
    correctAnswer: string;
  }[];
}

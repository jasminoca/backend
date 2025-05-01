/* eslint-disable prettier/prettier */
export class Score {
  id?: string;
  school_id!: string;
  type!: 'lesson' | 'game';
  lessonId?: string;
  game_name?: string;
  score!: number;
  answers?: { [questionId: string]: string };
  attempts?: number;
  created_at?: string;
  lessonTitle?: string;
}

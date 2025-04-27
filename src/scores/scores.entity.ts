/* eslint-disable prettier/prettier */
export class Score {
  id?: string; 
  school_id!: string;
  type!: 'lesson' | 'game';
  lessonId?: string;
  game_name?: string;
  score!: number;
  created_at!: number;
  answers?: { [questionId: string]: string };
}

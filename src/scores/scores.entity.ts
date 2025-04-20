/* eslint-disable prettier/prettier */
export class Score {
  id?: string;
  userId?: string;
  lessonId?: string;
  gameId?: string;
  type?: 'lesson' | 'game';
  score?: number;
  attempts?: number;
  createdAt?: string;
}

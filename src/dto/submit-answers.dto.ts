/* eslint-disable prettier/prettier */
export class UpdateQuestionAttemptDto {
  school_id!: string;
  answers!: { [questionId: string]: string; };
}

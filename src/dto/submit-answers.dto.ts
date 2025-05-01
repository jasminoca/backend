/* eslint-disable prettier/prettier */
export class SubmitAnswersDto {
  school_id!: string;
  answers!: { [key: string]: string; };
  attempts?: number;
}

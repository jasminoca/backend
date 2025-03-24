/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  question!: string;

  @Column("simple-array")
  choices!: string[];

  @ManyToOne(() => Lesson, lesson => lesson.questions)
  @JoinColumn({ name: 'lesson_id' })
  lesson!: Lesson;

  @Column()
  correctAnswer!: string;

}

/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn   } from 'typeorm';
import { Lesson } from '../lessons/lesson.entity'; // make sure the path is correct


@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  score!: number;

  @Column()
  school_id!: string; // Use school_id instead of user_id

  @Column({ type: 'int', default: 1 })
  attempts!: number;

  @Column({ type: 'json', nullable: true })
  answers!: Record<string, string>;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Lesson, (lesson) => lesson.scores, { nullable: true, eager: true })
  @JoinColumn({ name: 'lesson_id' })
  lesson?: Lesson;

  @Column({ nullable: true })
  game_name?: string;

}

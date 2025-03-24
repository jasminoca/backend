/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany  } from 'typeorm';
import { KeyPoint } from './keypoint.entity';
import { Question } from './question.entity';
import { Score } from '../scores/scores.entity'

@Entity('lessons') // Name of the table
export class Lesson {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ nullable: true })
  video_url!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => KeyPoint, (keyPoint) => keyPoint.lesson, { cascade: true })
  keypoints!: KeyPoint[];
  
  @OneToMany(() => Question, (question) => question.lesson, { cascade: true })
  questions!: Question[];
  videos: any;

  @OneToMany(() => Score, (score) => score.lesson)
  scores!: Score[];

}

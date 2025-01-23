/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  school_id!: string; // Use school_id instead of user_id

  @Column()
  lesson_id!: number;

  @Column()
  score!: number;

  @CreateDateColumn()
  created_at!: Date;
}

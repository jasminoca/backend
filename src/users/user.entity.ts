import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id?: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  user_type!: string;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  role!: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
